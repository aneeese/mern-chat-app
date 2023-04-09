require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const { User } = require("./models/User.js");

// Setting database connection
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// Defining routes
app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    })
  } else {
    res.status(401).json('No token');
  }
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const foundUser = await User.findOne({username});
  if (foundUser) {
    const passOK = bcrypt.compareSync(password, foundUser.password);
    if (passOK) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (error, token) => {
        if (error) throw error;
        res.cookie("token", token, {sameSite: 'none', secure: true}).json({
          id: foundUser._id
        });
      });
    } else res.json("Incorrect password!!!");
  } else res.json("User not found!!!");
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({ 
      username: username,
      password: hashedPassword 
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (error, token) => {
      if (error) throw error;
      res.cookie("token", token, {sameSite: 'none', secure: true}).status(201).json({
        id: createdUser._id
      });
    });
  } catch (error) {
    if (error) throw error;
    res.status(500).json("error");
  }
});

app.listen(4000);
