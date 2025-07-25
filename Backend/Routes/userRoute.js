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
  protect, // Xác thực user từ JWT
  upload.single("avatar"), // Nhận 1 file tên "avatar"
  uploadSingleToCloud, // Upload lên Cloudinary
  updateAvatar // Controller xử lý
);

module.exports = router;
