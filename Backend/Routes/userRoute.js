const router = require("express").Router();
const {
  getLogged,
  getUserById,
  updateAvatar,
  changePassword,
  updateInfo,
  getFavoriteTeachers,
  addFavoriteTeacher,
  removeFavoriteTeacher,
  checkFavoriteTeacher,
  getNearbyTeachers,
  getSavePosts,
  addSavePost,
  removeSavePost,
  checkSavePost,
  getUserReports,
  createReport,
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

/******** Cá nhân - đối với role User ******** */
router.get("/favorites", protect, authorize("user"), getFavoriteTeachers);
router.post("/add-favorite", protect, authorize("user"), addFavoriteTeacher);
router.delete(
  "/delete-favorite",
  protect,
  authorize("user"),
  removeFavoriteTeacher
);
router.get(
  "/favorites/check/:teacherId",
  protect,
  authorize("user"),
  checkFavoriteTeacher
);
router.get("/nearby", protect, authorize("user"), getNearbyTeachers);

/******** Cá nhân - đối với role Teacher ******** */
router.get("/saved-posts", protect, authorize("teacher"), getSavePosts);
router.post("/add-saved", protect, authorize("teacher"), addSavePost);
router.delete("/delete-saved", protect, authorize("teacher"), removeSavePost);
router.get(
  "/saved-post/check/:postId",
  protect,
  authorize("teacher"),
  checkSavePost
);

/******** Báo cáo ******** */
router.get("/lists", protect, authorize("user", "teacher"), getUserReports);
router.post(
  "/create",
  protect,
  authorize("user", "teacher"),
  upload.single("reportPic"),
  uploadSingleToCloud,
  createReport
);

module.exports = router;
