const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const auth = require("./routes/auth");
const passport = require('passport');
const session = require("express-session");
const MongoStore = require('connect-mongo');

const app = express();

// CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "https://sarradise-shop-app.onrender.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Session management with MongoDB
app.use(
  session({
      secret:"secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: 'sessions',
      }),
      cookie: {
          sameSite: "none",
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 // 1 day
      }
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.use(passport.initialize()); //utilisée pour l'authentification des utilisateurs
require("./passport.js")(passport);
app.use("/", auth);
// Corrected PORT definition
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
