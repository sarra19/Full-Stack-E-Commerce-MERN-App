const userModel = require("../../models/userModel")
const crypto = require("crypto");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../sendEmail");

const requestPasswordReset = async (req, res) => {
    try {
        console.log("Request received to send password reset link...");

        const emailSchema = Joi.object({
            email: Joi.string().email().required().label("Email"),
        });
        const { error } = emailSchema.validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        let user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            console.log("Utilisateur avec ce email :", req.body.email);
            return res.status(409).send({ message: "Utilisateur avec ce email non existant!" });
        }

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            console.log("Generating new token for user:", user._id);
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const url = `${process.env.BASE_URLp}password-reset/${user._id}/${token.token}/`;
        console.log("Sending password reset email to:", user.email);
        await sendEmail(user.email, "Password Reset", url);

        console.log("Password reset link sent successfully!");
        res.status(200).send({ message: "Lien envoyé à votre email" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: "erreur de serveur" });
    }
};

const verifyPasswordResetLink = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        res.status(200).send("Valid Url");
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        console.log("Request received to set new password...");

        const passwordSchema = Joi.object({
            password: passwordComplexity().required().label("Password"),
        });
        const { error } = passwordSchema.validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await userModel.findOne({ _id: req.params.id });
        if (!user) {
            console.log("userModel not found with id:", req.params.id);
            return res.status(400).send({ message: "Invalid link" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            console.log("Token not found");
            return res.status(400).send({ message: "Invalid link" });
        }

        if (!user.verified) user.verified = true;

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user.password = hashPassword;
        await user.save();

        if (token.remove && typeof token.remove === 'function') {
            await token.remove();
            console.log("Token removed successfully!");
        } else {
            console.error("Token remove function not available");
        }

        console.log("Password reset successfully!");
        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = {
    requestPasswordReset,
    verifyPasswordResetLink,
    resetPassword,
};
