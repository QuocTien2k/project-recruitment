const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // giáo viên lưu bài
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // bài viết được lưu
      required: true,
    },
  },
  { timestamps: true }
);

// Tránh 1 teacher lưu cùng 1 post nhiều lần
savedPostSchema.index({ teacher: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", savedPostSchema);
