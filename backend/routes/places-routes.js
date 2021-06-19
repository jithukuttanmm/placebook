const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const { fileUpload } = require("../middleware/file-upload");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlacesById);
router.get("/user/:userId", placesControllers.getUserPlacesById);
router.post(
  "/create",
  fileUpload.single("image"),
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
