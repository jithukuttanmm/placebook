const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const sharp = require("sharp");
const { getCooridinatesForAddress } = require("../utils/location");
const Place = require("../models/places");
const User = require("../models/user");
const PlaceImage = require("../models/placeImage");

const getPlacesById = async (req, res, next) => {
  const { placeId } = req.params;
  if (placeId) {
    try {
      const places = await Place.findById(placeId);
      if (places)
        return res.json(
          places.toObject({
            gettera: true,
          })
        );
      return next(new HttpError("No places found", 404));
    } catch (error) {
      console.log(error);
      return next(new HttpError("Something went wrong !", 500));
    }
  }

  return next(new HttpError("No places found", 500));
};

const getUserPlacesById = async (req, res, next) => {
  const { userId } = req.params;
  let places = null;
  try {
    if (userId) {
      places = await Place.find({ creator: userId });
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong !", 500));
  }
  if (!places || places.length === 0) return res.json({ places: [] });

  return res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return next(new HttpError("Invalid data !", 422));
  const { title, description, address, creator } = req.body;
  let user;
  try {
    const coordinates = await getCooridinatesForAddress(address);
    const buffer = await sharp(req.file.buffer).png().toBuffer(); // image editing.
    const placeImage = new PlaceImage({
      data: buffer,
      contentType: "image/png",
    });
    const savedPlace = await placeImage.save();
    const place = new Place({
      title,
      description,
      address,
      creator: req.user._id,
      location: coordinates,
      imageUrl: req.file.path,
      imageId: savedPlace._id,
    });
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const result = await place.save({ session: sess });

    user = await User.findById(req.user._id);
    if (!user) return next(new HttpError("Could not find the user !", 404));

    user.places.push(place);
    await user.save({ session: sess });
    sess.commitTransaction();

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Creation failed !", 500));
  }
};

const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) throw new HttpError("Invalid data !", 422);
  const { placeId } = req.params;
  const { title, description } = req.body;
  let place = null;
  if (placeId) {
    try {
      place = await Place.findById(placeId);
      if (place.creator.toString() !== req.user._id.toString())
        return next(
          new HttpError(
            "You do not have the permission to edit this place!",
            401
          )
        );

      place.title = title;
      place.description = description;
      await place.save();
    } catch (error) {
      console.log(error);
      return next(new HttpError("Something went wrong !", 500));
    }
    if (!place) return next(new HttpError("Place to edit not found!", 404));

    return res.status(200).json({ place: place.toObject({ getters: true }) });
  }
  throw new HttpError("Place to edit not found!", 404);
};

const deletePlaceById = async (req, res, next) => {
  const { placeId } = req.params;
  let place = null;
  if (placeId) {
    try {
      place = await Place.findById(placeId).populate("creator");
      placeImage = await PlaceImage.findById(place.imageId);

      if (place.creator._id.toString() !== req.user._id.toString())
        return next(
          new HttpError(
            "You do not have the permission to delete this place!",
            401
          )
        );

      const imagePath = place.imageUrl;
      const sess = await mongoose.startSession();
      await sess.startTransaction();
      await placeImage.remove();
      await place.remove({ session: sess });
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });

      await sess.commitTransaction();
    } catch (error) {
      console.log(error);
      return next(new HttpError("Something went wrong !", 500));
    }
    if (!place)
      return next(new HttpError("Delete failed - place not found!", 404));

    return res.status(200).json({ place: place.toObject({ getters: true }) });
  }
  return next(new HttpError("Delete failed - place not found!", 404));
};

const getPlaceImageById = async (req, res, next) => {
  let place = null;
  try {
    place = await PlaceImage.findById(req.params.placeId);
    console.log(place);
    if (!(place || place.data))
      return next(new HttpError("Place not found !", 404));
    res.set("Content-Type", "image/png");
    res.send(place.data);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong, try again !", 500));
  }
};

module.exports = {
  getPlacesById,
  getUserPlacesById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
  getPlaceImageById,
};
