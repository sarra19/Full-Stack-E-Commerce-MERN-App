const express = require("express");
const Router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");

// Google authentication route
Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google authentication callback route
Router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    try {
      // Successful authentication, retrieve user by email
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        // User does not exist, create or handle accordingly
        throw new Error("User does not exist");
      }

      // Prepare token data
      const tokenData = {
        _id: user._id,
        email: user.email
      };

      // Generate JWT token
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

      // Set token in cookies
      const tokenOption = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      };

      // Set the token in a cookie and redirect to frontend with token
      res.cookie("token", token, tokenOption);

      // Redirect to the frontend application with the token
      // Pass the token as a query parameter
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);

    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = Router;
