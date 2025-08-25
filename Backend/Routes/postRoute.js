const router = require("express").Router();
const {
  createPost,
  updatePost,
  getMyPosts,
  deletePost,
} = require("../controllers/postController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/create-post", protect, authorize("user"), createPost);
router.patch("/update-post/:postId", protect, authorize("user"), updatePost);
router.get("/my-posts", protect, authorize("user"), getMyPosts);
router.delete("/delete-post/:postId", protect, authorize("user"), deletePost);

module.exports = router;
