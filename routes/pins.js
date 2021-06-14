const express = require("express");
const router = express.Router();
const Pin = require("../models/pin");

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
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (e) {
    res.status(404).json(e);
  }
});

module.exports = router;
