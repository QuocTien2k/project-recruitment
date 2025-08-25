const router = require("express").Router();
const {
  getLogged,
  getUserById,
  updateAvatar,
  changePassword,
  updateInfo,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const uploadSingleToCloud = require("../utils/uploadSingleToCloud");
const upload = require("../middlewares/multer");

router.get("/get-logged-user", protect, getLogged);
router.get("/info-user/:id", protect, getUserById);

router.patch(
  "/update-avatar",
  protect,
  authorize("user", "teacher"),
  upload.single("avatar"),
  uploadSingleToCloud, // Upload lên Cloudinary
  updateAvatar
);

router.patch(
  "/change-password",
  protect,
  authorize("user", "teacher"),
  changePassword
);
router.patch("/update-info", protect, authorize("user", "teacher"), updateInfo);

module.exports = router;
