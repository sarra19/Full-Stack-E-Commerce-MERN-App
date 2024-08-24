const express = require("express");
const Router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Helper function to handle user creation or retrieval
async function findOrCreateUser(req, res) {
  try {
    // Check if the user already exists
    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      // Create a new user if not found
      user = new userModel({
        email: req.user.email,
        // Populate other fields as needed
      });

      await user.save();
    }

    // Prepare token data
    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "8h",
    });

    // Set token in cookies
    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Set the token in a cookie and redirect to frontend with token
    res.cookie("token", token, tokenOption);

    // Redirect to the frontend application with the token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);

    if (error.code === 11000) {
      // Duplicate key error (E11000)
      res.status(400).send("User with this email already exists.");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
}

// Google authentication route
Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google authentication callback route
Router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  findOrCreateUser
);

// Facebook authentication route
Router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook authentication callback route
Router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  findOrCreateUser
);


// Github authentication route
Router.get(
  "/auth/github",
  passport.authenticate("github", { scope:  ['user:email'] })
);

// Github authentication callback route
Router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  findOrCreateUser
);


module.exports = Router;
