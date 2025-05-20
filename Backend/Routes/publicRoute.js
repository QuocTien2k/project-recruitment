const router = require("express").Router();
const { getDetailPost, countViews } = reuqire(
  "../controllers/publicController.js"
);

router.get("/detail-post/:postId", getDetailPost);
router.get("/count-view/:postId", countViews);

module.exports = router;
