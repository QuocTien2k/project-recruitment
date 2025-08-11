const router = require("express").Router();
const { recordView } = require("../controllers/viewerController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:postId", protect, recordView);

module.exports = router;
