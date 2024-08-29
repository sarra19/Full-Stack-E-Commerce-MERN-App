const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');
const sendEmail = require("../../sendEmail");
const jwt = require('jsonwebtoken')

async function userSignUpController(req, res) {
    try {
      const { email, password, name } = req.body;
  
      if (!email || !password || !name) {
        return res.status(400).json({
          message: "Please provide email, password, and name",
          error: true,
          success: false,
        });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists.",
          error: true,
          success: false,
        });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
  
      const tokenData = { email, name };
  
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      });
  
      const payload = {
        email,
        name,
        password: hashPassword,
        role: "GENERAL",
        secret: token,
      };
  
      const newUser = new userModel(payload);
      const saveUser = await newUser.save();
  
      const verificationUrl = `${process.env.REACT_APP_BACKEND_URL}api/${saveUser._id}/verify/${token}`;
  
      await sendEmail({
        recipient_email: email,
        subject: "Verify Email",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #ff6699;">Welcome to Our Service!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering with us. To complete your registration, please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #ff6699; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p><a href="${verificationUrl}" style="color: #ff6699;">${verificationUrl}</a></p>
            <p>Thank you for choosing our service!</p>
        </div>
    `
      });
  
      res.status(201).json({
        data: saveUser,
        success: true,
        error: false,
        message: "User created successfully! Please check your email to verify your account.",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }
  }
  
module.exports = userSignUpController;