const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("fetching users failed, try again !", 500));
  }

  if (!users)
    return next(new HttpError("fetching users failed, try again !", 500));

  return res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};
const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return next(new HttpError("Invalid data !", 422));
  const { id = uuid(), name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return next(new HttpError("User already exists !", 500));
    const user = new User({
      name,
      email,
      password,
      image: "http://placekitten.com/g/200/300",
      places: [],
    });
    await user.save();
    return res.status(201).json({ user: user.toObject({ getters: true }) });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong, try again !", 500));
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Login failed, try again !", 500));
  }

  if (!user || user.password !== password)
    return next(new HttpError("Email or password wrong.", 401));

  return res.json("Welcome " + user.name);
};

module.exports = {
  getUsers,
  signup,
  login,
};
