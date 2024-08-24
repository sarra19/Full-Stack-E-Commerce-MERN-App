const userModel = require("./models/userModel");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

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
};
