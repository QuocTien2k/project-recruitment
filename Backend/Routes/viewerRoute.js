const router = require("express").Router();
const { recordView, getPostViews } = require("../controllers/viewerController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/:postId", protect, authorize("user", "teacher"), recordView);
router.get("/:postId", getPostViews);

module.exports = router;
