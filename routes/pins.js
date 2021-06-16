const express = require("express");
const router = express.Router();
const Pin = require("../models/pin");
const User = require("../models/user");
const auth = require("../middleware/auth");

//POST
// Create a new Pin
router.post("/", async (req, res) => {
  try {
    const newPin = new Pin(req.body);
    const savePin = await newPin.save();
    res.status(200).json(savePin);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

// GET
// Get the pins of the User and of users they follow
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;
    const pins = await Pin.find({ userName: user.userName });
    const following = user.following;
    for (let i = 0; i < following.length; ++i) {
      const followingPins = await Pin.find({
        userName: following[i].followingUser,
      });
      pins.push(...followingPins);
    }
    res.status(200).json(pins);
  } catch (e) {
    res.status(404).json(e);
    console.log(e);
  }
});

//PATCH
//Edit the pin
router.patch("/:pinId", auth, async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);
  if (pin.userName != req.user.userName)
    return res.status(401).send("Unauthorized!");
  const allowedParameters = ["place", "review", "rating"];
  const updates = Object.keys(req.body);
  var isValidParameters = true;
  updates.forEach((update) => {
    if (!allowedParameters.includes(update)) isValidParameters = false;
  });

  if (!isValidParameters) return res.status(404).send();

  try {
    updates.forEach((update) => {
      pin[update] = req.body[update];
    });
    await pin.save();
    res.status(200).send(pin);
  } catch (e) {
    res.status(500).send(e);
  }
});

//DELETE
// Delete the pin created by the user
router.delete("/:pinId", auth, async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);
  if (pin.userName != req.user.userName)
    return res.status(401).send("Unauthorized!");
  try {
    await pin.remove();
    res.status(200).send(pin);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
