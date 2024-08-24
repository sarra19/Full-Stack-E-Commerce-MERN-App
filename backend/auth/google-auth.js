const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel.js");

module.exports = (passport) => {
    // Sérialisation de l'utilisateur pour stocker dans la session
    passport.serializeUser(function (user, done) {
        done(null, user.id);  //Stocke l'ID de l'utilisateur dans la session
    });

    // Désérialisation de l'utilisateur à partir de l'ID stocké dans la session
    passport.deserializeUser(function (id, done) {
        userModel.findById(id, function (err, user) {
            done(err, user); // Récupère l'utilisateur à partir de l'ID
        });
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: "http://localhost:8080/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, cb) {
                console.log(profile);
                try {
                    let user = await userModel.findOne({ googleId: profile.id });

                    if (user) {
                        const updatedUser = {
                            name: profile.displayName,
                            email: profile.emails[0].value,
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
                        const newUser = new userModel({
                            googleId: profile.id,
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
};