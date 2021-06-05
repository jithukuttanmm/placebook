const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
  {
    id: "p2",
    title: "Emp State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

const getPlacesById = (req, res, next) => {
  const { placeId } = req.params;
  if (placeId) {
    const places = DUMMY_PLACES.filter((place) => place.id === placeId);
    if (places) return res.json(places);
    return next(new HttpError("No places found", 404));
  }
  return next(new HttpError("No places found", 500));
};

const getUserPlacesById = (req, res, next) => {
  const { userId } = req.params;
  if (userId) {
    const places = DUMMY_PLACES.filter((place) => place.creator === userId);

    if (places) return res.json(places);
    return next(new HttpError("No places found for user", 404));
  }
  return next(new HttpError("No places found for user", 500));
};

const createPlace = (req, res, next) => {
  const { title, description, address, location, creator } = req.body;
  DUMMY_PLACES.push({
    id: uuid(),
    title,
    description,
    address,
    location,
    creator,
  });
  return res.status(201).json(DUMMY_PLACES);
};

const updatePlaceById = (req, res, next) => {
  const { placeId } = req.params;
  const { title, description } = req.body;
  if (placeId) {
    const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
    if (placeIndex > -1) {
      DUMMY_PLACES[placeIndex].title = title;
      DUMMY_PLACES[placeIndex].description = description;
      return res.status(200).json(DUMMY_PLACES);
    }
  }
  throw new HttpError("Place to edit not found!", 404);
};

const deletePlaceById = (req, res, next) => {
  const { placeId } = req.params;
  if (placeId) {
    DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
    return res.status(200).json({ message: "Delete successful" });
  }
  throw new HttpError("Delete failed!", 404);
};

module.exports = {
  getPlacesById,
  getUserPlacesById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
