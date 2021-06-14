const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 2,
      max: 25,
    },
    title: {
      type: String,
      required: true,
      max: 100,
    },
    description: {
      type: String,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    latitude: {
      type: Number,
      required: true,
    },
    langitude: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Pin = mongoose.model("Pin", pinSchema);
module.exports = Pin;
