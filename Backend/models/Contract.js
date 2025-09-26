const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null, // null nếu hợp đồng “trống”
    },
    partyA: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      district: { type: String },
      province: { type: String },
    },
    partyB: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      district: { type: String },
      province: { type: String },
    },
    content: {
      type: String,
      default: "", // nội dung hợp đồng
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);
