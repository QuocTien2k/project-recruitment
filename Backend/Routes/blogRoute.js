const router = require("express").Router();
const {
  createBlogByAdmin,
  updateBlogByAdmin,
  deleteBlogByAdmin,
  getAllBlogs,
  getBlogDetailBySlug,
} = require("../controllers/adminController");
const uploadSingleToCloud = require("../utils/uploadSingleToCloud");
const upload = require("../middlewares/multer");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post(
  "/create",
  protect,
  authorize("admin"),
  upload.single("blogPic"),
  uploadSingleToCloud,
  createBlogByAdmin
);

router.patch(
  "/update/:blogId",
  protect,
  authorize("admin"),
  upload.single("blogPic"),
  uploadSingleToCloud,
  updateBlogByAdmin
);

router.delete(
  "/delete/:blogId",
  protect,
  authorize("admin"),
  deleteBlogByAdmin
);

router.get("/", getAllBlogs);
router.get("/:slug", getBlogDetailBySlug);
module.exports = router;
