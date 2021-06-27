const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/user-controllers");
const { fileUpload } = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userControllers.getUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  userControllers.signup
);
router.post("/login", userControllers.login);
router.get("/:id/avatar", userControllers.getAvatar);

module.exports = { usersRouter: router };
