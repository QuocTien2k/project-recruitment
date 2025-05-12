const router = require("express").Router();
const { createNewChat } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create-new-chat", protect, createNewChat);

module.exports = router;
