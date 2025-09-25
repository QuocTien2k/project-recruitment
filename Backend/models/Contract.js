const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null, // null nếu hợp đồng “trống”
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Bên A
    },
    createdByName: {
      type: String,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Bên B, null nếu chưa chọn
    },
    content: {
      type: String,
      default: "", // nội dung hợp đồng
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);
