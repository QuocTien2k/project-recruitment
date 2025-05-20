const router = require("express").Router();
const {
  createPost,
  updatePost,
  getMyPosts,
  getDetailPost,
  deletePost,
} = require("../controllers/postController");
const { protect, isUser } = require("../middlewares/authMiddleware");

router.post("/create-post", protect, isUser, createPost);
router.put("/update-post/:postId", protect, isUser, updatePost);
router.get("/my-posts", protect, isUser, getMyPosts);
router.get("/detail-post", getDetailPost);
router.delete("/delete-post/:postId", protect, isUser, deletePost);

module.exports = router;
