const userModel = require("../../models/userModel");
const jwt = require('jsonwebtoken')

const userVerifyController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        // Verify the token
        jwt.verify(req.params.token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).send({ message: "Invalid or expired token" });
            }

            if (user.verified) {
                return res.status(400).send({ message: "User already verified" });
            }

            user.verified = true;
            user.secret = null; // Clear the token after verification
            await user.save();

            res.redirect("http://localhost:3000/login");
        });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = userVerifyController;