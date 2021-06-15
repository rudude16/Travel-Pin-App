const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Pin = require("./pin");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      min: 2,
      max: 25,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("remove", async function (next) {
  const user = this;
  await Pin.deleteMany({ userName: user.userName });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
