require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { User } = require("./models/User.js");

// Setting database connection
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
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

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password });
    jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (error, token) => {
      if (error) throw error;
      res.cookie("token", token).status(201).json({
        _id: createdUser._id,
      });
    });
  } catch (error) {
    if (error) throw error;
    res.status(500).json("error");
  }
});

app.listen(4000);
