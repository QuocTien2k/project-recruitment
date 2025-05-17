const router = require("express").Router();
const { createPost, updatePost } = require("../controllers/postController");
const { protect, isUser } = require("../middlewares/authMiddleware");

router.post("/create-post", protect, isUser, createPost);
router.post("/update-post/:postId", protect, isUser, updatePost);

module.exports = router;
