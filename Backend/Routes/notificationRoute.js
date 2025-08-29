const router = require("express").Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController.js");
const { protect, authorize } = require("../middlewares/authMiddleware.js");

router.get("/", protect, authorize("user", "teacher"), getMyNotifications);

router.patch(
  "/:notificationId/read",
  protect,
  authorize("user", "teacher"),
  markAsRead
);

router.patch("/read-all", protect, authorize("user", "teacher"), markAllAsRead);

router.delete(
  "/:notificationId",
  protect,
  authorize("user", "teacher"),
  deleteNotification
);

module.exports = router;
