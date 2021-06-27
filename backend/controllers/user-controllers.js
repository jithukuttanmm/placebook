const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const { EXPIRY_TOKEN } = require("../utils/constants");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password -avatar");
    if (!users)
      return next(new HttpError("fetching users failed, try again !", 500));
    let allUsers = [];
    await users.forEach(async (user, index) => {
      const parsedUser = await user.toJSON();
      allUsers.push(parsedUser);
    });
    return res.json({
      users: allUsers,
    });
  } catch (error) {
    return next(new HttpError("fetching users failed, try again !", 500));
  }
};
const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return next(new HttpError("Invalid data !", 422));
  const { id = uuid(), name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return next(new HttpError("User already exists !", 500));

    const encodedPassword = await bcrypt.hash(password, 10);
    const buffer = await sharp(req.file.buffer).png().toBuffer(); // image editing.
    const avatar = {
      data: buffer,
      contentType: "image/png",
    };

    const user = new User({
      name,
      email,
      password: encodedPassword,
      image: req.file.path,
      places: [],
      avatar,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id.toString(), EXPIRY_TOKEN },
      process.env.SECRET_KEY,
      {
        expiresIn: EXPIRY_TOKEN,
      }
    );
    return res.status(201).json({ user: await user.toJSON(), token });
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
    return next(new HttpError("User not found, please sign up!", 500));
  }
  if (!user) return next(new HttpError("User not found, please sign up!", 500));
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!user || !isValidPassword)
    return next(new HttpError("Email or password wrong.", 401));

  const token = jwt.sign(
    { userId: user._id.toString(), EXPIRY_TOKEN },
    process.env.SECRET_KEY,
    {
      expiresIn: EXPIRY_TOKEN,
    }
  );
  return res.json({
    message: "Welcome " + user.name,
    user: await user.toJSON(),
    token,
  });
};

const getAvatar = async (req, res, next) => {
  let user = null;
  try {
    user = await User.findById(req.params.id);
    if (!(user || user.avatar))
      return next(new HttpError("User not found !", 404));
    res.set("Content-Type", "image/png");
    res.send(user.avatar.data);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong, try again !", 500));
  }
};

module.exports = {
  getUsers,
  signup,
  login,
  getAvatar,
};
