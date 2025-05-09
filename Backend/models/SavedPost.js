const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Đảm bảo không có bài viết trùng với teacherId
savedPostSchema.index({ teacherId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", savedPostSchema);
