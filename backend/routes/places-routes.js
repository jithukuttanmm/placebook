const express = require("express");
const placesControllers = require("../controllers/places-controllers");
const HttpError = require("../models/http-error");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlacesById);
router.get("/user/:userId", placesControllers.getUserPlacesById);
router.post("/create", placesControllers.createPlace);
router.patch("/:placeId", placesControllers.updatePlaceById);
router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = {
  placeRouter: router,
};
