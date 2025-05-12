const router = require("express").Router();
const {
  createNewMessage,
  clearUnreadMessageCount,
  getAllMessages,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/new-message", protect, createNewMessage);
router.post("/clear-unread-message-count", protect, clearUnreadMessageCount);
router.get("/get-all-messages/:chatId", protect, getAllMessages);

module.exports = router;
