const mongoose = require("mongoose");

const viewerSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Đảm bảo mỗi user chỉ ghi nhận 1 lượt xem cho mỗi bài viết
viewerSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Viewer", viewerSchema);
