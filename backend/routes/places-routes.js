const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlacesById);
router.get("/user/:userId", placesControllers.getUserPlacesById);
router.post(
  "/create",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.createPlace
);
router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);
router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = {
  placeRouter: router,
};
