const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Người gửi báo cáo
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Loại báo cáo: user | post
    type: {
      type: String,
      enum: ["user", "post"],
      required: true,
    },

    // Email người bị báo cáo (người dùng nhập tay)
    reportedEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Lý do báo cáo
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Hình ảnh minh họa
    reportPic: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },

    // Trạng thái xử lý
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    // Ghi chú của admin
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
