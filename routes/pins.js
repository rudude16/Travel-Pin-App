const express = require("express");
const router = express.Router();
const Pin = require("../models/pin");
const auth = require("../middleware/auth");

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

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (e) {
    res.status(404).json(e);
  }
});

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
