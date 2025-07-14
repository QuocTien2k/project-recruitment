const router = require("express").Router();
const {
  getDetailPost,
  getPostBySlug,
  getPublicTeachers,
  countViews,
} = require("../controllers/publicController.js");

router.get("/detail-post/:postId", getDetailPost);
router.get("/detail-by-slug/:slug", getPostBySlug);
router.get("/get-lists-teacher", getPublicTeachers);
router.get("/count-view/:postId", countViews);

module.exports = router;
