const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const auth = require("../middleware/auth-check");
const { fileUpload } = require("../middleware/file-upload");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlacesById);
router.get("/user/:userId", placesControllers.getUserPlacesById);
router.post(
  "/create",
  auth,
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.createPlace
);
router.patch(
  "/:placeId",
  auth,
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);
router.delete("/:placeId", auth, placesControllers.deletePlaceById);
router.get("/image/:placeId", placesControllers.getPlaceImageById);

module.exports = {
  placeRouter: router,
};
