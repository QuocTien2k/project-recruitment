const router = require("express").Router();
const {
  blockUser,
  unblockUser,
  getBlockedUsers,
  getBlockStatus,
} = require("../controllers/blockController");
const { protect, authorize } = require("../middlewares/authMiddleware");

//
router.get("/block/status/:receiverId", protect, getBlockStatus);

// Chặn user
router.post("/block", protect, authorize("user", "teacher"), blockUser);

// Mở chặn user
router.delete("/unblock", protect, authorize("user", "teacher"), unblockUser);

// Lấy danh sách đã chặn
router.get("/blocked", protect, authorize("user", "teacher"), getBlockedUsers);

module.exports = router;
