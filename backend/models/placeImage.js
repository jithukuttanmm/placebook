const mongoose = require("mongoose");

const placesImageSchema = mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const PlaceImage = mongoose.model("PlaceImage", placesImageSchema);

module.exports = PlaceImage;
