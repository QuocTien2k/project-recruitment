const router = require("express").Router();
const { createPost } = require("../controllers/postController");
const { protect, isUser } = require("../middlewares/authMiddleware");

router.post("/create-post", protect, isUser, createPost);

module.exports = router;
