const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ai sẽ nhận thông báo
      required: true,
    },
    type: {
      type: String,
      enum: [
        "POST_APPROVED", // admin duyệt
        "POST_REJECTED", // admin từ chối
        "APPLICATION_PENDING", // teacher gửi đơn tuyển (đang chờ duyệt)
        "APPLICATION_ACCEPTED", // user duyệt đơn ứng tuyển
        "APPLICATION_REJECTED", // user từ chối đơn ứng tuyển
      ],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    message: {
      type: String,
      required: true, // "Bài viết ABC đã được duyệt", ...
    },
    link: {
      type: String, // để frontend redirect khi click vào
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
