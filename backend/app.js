const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { placeRouter } = require("./routes/places-routes.js");
const { usersRouter } = require("./routes/users-routes.js");
const HttpError = require("./models/http-error.js");

const app = express();
app.use(bodyParser.json());

app.use("/api/places", placeRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  throw new HttpError("Could not find route", 404);
});

app.use((error, req, res, next) => {
  //default error handling code
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ error: error.message || "Something went wrong !" });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
