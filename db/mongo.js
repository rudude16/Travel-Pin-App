const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((e) => {
    console.log("Error in Database Connection " + e);
  });
