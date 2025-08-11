const router = require("express").Router();
const { recordView, getPostViews } = require("../controllers/viewerController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:postId", protect, recordView);
router.get("/:postId", getPostViews);

module.exports = router;
