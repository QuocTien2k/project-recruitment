const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false, // Không bắt buộc nữa
      default: null,
    },
    hasPost: {
      type: Boolean,
      required: true,
      default: false, // Mặc định là không có bài viết
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);
