const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

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

// PATCH
// Update password and following
router.patch("/:userName", auth, async (req, res) => {
  if (req.user.userName != req.params.userName)
    return res.status(401).send("Unauthorized Request!");

  const user = await User.findOne({ userName: req.params.userName });
  const allowedParameters = ["password", "following"];
  const updates = Object.keys(req.body);
  var isValidParameters = true;
  updates.forEach((update) => {
    if (!allowedParameters.includes(update)) isValidParameters = false;
  });

  if (!isValidParameters) return res.status(404).send();
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashPassword;
    }
    if (req.body.following) {
      const findUser = await User.findOne({ userName: req.body.following });
      if (!findUser) return res.send(400);
      const followingUser = req.body.following;
      var found = false;
      user.following.forEach((f) => {
        if (f.followingUser === followingUser) found = true;
      });
      if (!found) user.following = user.following.concat({ followingUser });
    }
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});
// DELETE
// Stop following the given follower
router.delete("/:userName/:followinguserName", auth, async (req, res) => {
  const user = await User.findOne({ userName: req.params.userName });
  if (user.userName != req.user.userName)
    return res.status(401).send("Unauthorized!");
  try {
    var index = -1;
    user.following.forEach((f, i) => {
      if (f.followingUser === req.params.followinguserName) index = i;
    });
    if (index !== -1) user.following.splice(index, 1);
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

// DELETE
// Delete the given user
router.delete("/:userName", auth, async (req, res) => {
  const user = await User.findOne({ userName: req.params.userName });
  if (user.userName != req.user.userName)
    return res.status(401).send("Unauthorized!");
  try {
    await user.remove();
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
