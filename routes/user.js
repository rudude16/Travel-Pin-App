const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// POST
// Sign up
router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const newUser = new User(req.body);
    const token = await jwt.sign(
      { userName: newUser.userName },
      process.env.jwt_SECRET
    );
    newUser.tokens = newUser.tokens.concat({ token });
    await newUser.save();
    const userName = newUser.userName;
    res.status(201).send({ userName, token });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

// POST
// Log in the user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) return res.status(404).json("Wrong username or password");
    const match = await bcrypt.compare(req.body.password, user.password);
    const token = await jwt.sign(
      { userName: user.userName },
      process.env.jwt_SECRET
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    const userName = user.userName;
    if (match) res.status(200).send({ userName, token });
    else res.status(404).json("Wrong username or password");
  } catch (e) {
    res.status(404).json(e);
  }
});

router.patch("/", async (req, res) => {
  try {
  } catch (e) {
    res.send(500).json(e);
  }
});

module.exports = router;
