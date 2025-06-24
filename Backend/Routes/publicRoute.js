const router = require("express").Router();
const {
  getDetailPost,
  getPostBySlug,
  countViews,
} = require("../controllers/publicController.js");

router.get("/detail-post/:postId", getDetailPost);
router.get("/detail-by-slug/:slug", getPostBySlug);
router.get("/count-view/:postId", countViews);

module.exports = router;
