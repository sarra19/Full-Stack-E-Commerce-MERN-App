const userModel = require("./models/userModel");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = (passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, cb) {
                try {
                    // First, check if a user with this email already exists
                    let user = await userModel.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // If the user exists, update their Google info
                        const updatedUser = {
                            ProfileId: profile.id,
                            name: profile.displayName,
                            profilePic: profile.photos[0].value,
                            secret: accessToken,
                        };

                        user = await userModel.findOneAndUpdate(
                            { _id: user.id },
                            { $set: updatedUser },
                            { new: true }
                        );
                        return cb(null, user);
                    } else {
                        // If no user exists with this email, create a new one
                        const newUser = new userModel({
                            ProfileId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profilePic: profile.photos[0].value,
                            secret: accessToken,
                        });

                        user = await newUser.save();
                        return cb(null, user);
                    }
                } catch (err) {
                    return cb(err, null);
                }
            }
        )
    );


    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_SECRET_KEY,
                callbackURL: "http://localhost:8080/auth/facebook/callback",
                profileFields: ["id", "displayName", "photos", "email"]
            },
            async function (accessToken, refreshToken, profile, cb) {
                try {
                    // First, check if a user with this email already exists
                    let user = await userModel.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // If the user exists, update their Facebook info
                        const updatedUser = {
                            ProfileId: profile.id,
                            name: profile.displayName,
                            profilePic: profile.photos[0].value,
                            provider: 'facebook',
                            secret: accessToken,
                        };

                        user = await userModel.findOneAndUpdate(
                            { _id: user.id },
                            { $set: updatedUser },
                            { new: true }
                        );
                        return cb(null, user);
                    } else {
                        // If no user exists with this email, create a new one
                        const newUser = new userModel({
                            ProfileId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profilePic: profile.photos[0].value,
                            provider: 'facebook',
                            secret: accessToken,
                        });

                        user = await newUser.save();
                        return cb(null, user);
                    }
                } catch (error) {
                    console.error("Error in Facebook authentication:", error);
                    return cb(error);
                }
            }
        )
    );


    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_SECRET_KEY,
                callbackURL: "http://localhost:8080/auth/github/callback",
                scope: ['user:email'],
            },
            async function (accessToken, refreshToken, profile, cb) {
                try {
                    // Check for email in profile
                    const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;
    
                    if (!email) {
                        return cb(new Error("Email is required for GitHub authentication"), null);
                    }
    
                    // Find user by email or ProfileId
                    let user = await userModel.findOne({ email: email }) || 
                               await userModel.findOne({ ProfileId: profile.id, provider: 'github' });
    
                    if (user) {
                        // Update existing user
                        const updatedUser = {
                            name: profile.displayName,
                            profilePic: profile._json.avatar_url,
                            secret: accessToken,
                        };
    
                        user = await userModel.findOneAndUpdate(
                            { _id: user._id },  // Use user's _id for update
                            { $set: updatedUser },
                            { new: true }
                        );
                        return cb(null, user);
                    } else {
                        // Create new user
                        const newUser = new userModel({
                            ProfileId: profile.id,
                            name: profile.displayName,
                            email: email,
                            profilePic: profile._json.avatar_url,
                            provider: 'github',
                            secret: accessToken,
                        });
    
                        user = await newUser.save();
                        return cb(null, user);
                    }
                } catch (error) {
                    console.error("Error in GitHub authentication:", error);
                    return cb(error);
                }
            }
        )
    );
    
};
