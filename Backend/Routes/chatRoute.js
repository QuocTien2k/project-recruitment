const router = require("express").Router();
const { createNewChat, getAllChats } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create-new-chat", protect, createNewChat);
router.get("/my-chats", protect, getAllChats);

module.exports = router;
