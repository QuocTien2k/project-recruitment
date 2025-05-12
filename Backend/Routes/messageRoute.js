const router = require("express").Router();
const {
  createNewMessage,
  clearUnreadMessageCount,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/new-message", protect, createNewMessage);
router.post("/clear-unread-message-count", protect, clearUnreadMessageCount);

module.exports = router;
