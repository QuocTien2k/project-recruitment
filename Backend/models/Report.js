const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Người gửi báo cáo
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Loại đối tượng bị báo cáo: user hoặc post
    type: {
      type: String,
      enum: ["user", "post"],
      required: true,
    },

    // ID của đối tượng bị báo cáo
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type", // dynamic reference (User hoặc Post)
    },

    // Lý do báo cáo do người dùng nhập
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Hình ảnh minh họa (chỉ 1 hình)
    reportPic: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    // Trạng thái xử lý báo cáo (đơn giản)
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    // Ghi chú của admin (tùy chọn, chỉ admin thấy)
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
