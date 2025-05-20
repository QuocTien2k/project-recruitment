const router = require("express").Router();
const { view } = require("../controllers/viewerController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:postId", protect, view);

module.exports = router;
