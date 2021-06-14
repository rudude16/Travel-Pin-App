const express = require("express");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("../backend/routes/pins");
const userRoute = require("../backend/routes/user");

app.use(express.json());
app.use("/api/pins", pinRoute);
app.use("/api/user", userRoute);

dotenv.config();
require("../backend/db/mongo");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
