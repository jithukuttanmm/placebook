const mongoose = require("mongoose");

const placesSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lang: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  imageId: { type: mongoose.Types.ObjectId, required: true, ref: "PlaceImage" },
});

const Place = mongoose.model("Place", placesSchema);

module.exports = Place;
