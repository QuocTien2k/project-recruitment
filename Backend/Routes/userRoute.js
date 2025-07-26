const router = require("express").Router();
const {
  getLogged,
  getUserById,
  updateAvatar,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const uploadSingleToCloud = require("../utils/uploadSingleToCloud");
const upload = require("../middlewares/multer");

router.get("/get-logged-user", protect, getLogged);
router.get("/info-user/:id", protect, getUserById);

router.patch(
  "/update-avatar",
  protect,
  upload.single("avatar"),
  uploadSingleToCloud, // Upload lên Cloudinary
  updateAvatar
);

module.exports = router;
