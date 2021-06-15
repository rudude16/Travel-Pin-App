const express = require("express");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/user");

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/pins", pinRoute);
app.use("/api/user", userRoute);

dotenv.config();
require("./db/mongo");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
