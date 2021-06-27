const multer = require("multer");
const fileUpload = multer({
  limits: 500000,
  fileFilter(req, file, callback) {
    // callback(undefined, false); // silently fail
    if (!/.(jpg|jpeg|png)$/.test(file.originalname))
      callback(new Error("File must be image/jpg."));
    callback(undefined, true);
  },
});

module.exports = { fileUpload };
