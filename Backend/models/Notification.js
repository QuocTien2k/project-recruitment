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
        "POST_PENDING", // user vừa tạo post (đang chờ duyệt)
        "POST_APPROVED", // admin duyệt
        "POST_REJECTED", // admin từ chối
        "NEW_BLOG", // admin thêm blog
      ],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
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
