const router = require("express").Router();
const {
  getAllApprovedPosts,
  getDetailPost,
  getPostBySlug,
  getPublicTeachers,
  getPublicTeacherDetail,
  countViews,
} = require("../controllers/publicController.js");

router.get("/list-posts", getAllApprovedPosts);
router.get("/detail-post/:postId", getDetailPost);
router.get("/detail-by-slug/:slug", getPostBySlug);
router.get("/get-lists-teacher", getPublicTeachers);
router.get("/teachers/:teacherId", getPublicTeacherDetail);
router.get("/count-view/:postId", countViews);

module.exports = router;
