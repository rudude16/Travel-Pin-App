const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.jwt_SECRET);
    const user = await User.findOne({
      userName: decode.userName,
      "tokens.token": token,
    });
    if (!user) throw new Error("");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

module.exports = auth;
