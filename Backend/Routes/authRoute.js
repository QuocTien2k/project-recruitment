const router = require("express").Router();
const {
  signupUser,
  signupTeacher,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const upload = require("../middlewares/multer");
const uploadMultiple = require("../utils/uploadToCloudinary");

const forceType = (type) => (req, res, next) => {
  req.body.type = type;
  next();
};

router.post("/signup-user", signupUser);
router.post(
  "/signup-teacher",
  upload.array("degreeImages", 2), // tối đa 2 ảnh bằng cấp
  forceType("teacher"),
  uploadMultiple,
  signupTeacher
);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
