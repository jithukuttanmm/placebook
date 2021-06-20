const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) return next(new HttpError("Authentication failed!", 401));
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Authentication failed!", 401));
  }
};
module.exports = auth;
