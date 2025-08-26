const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: function (v) {
          return v.length === 2; // Chỉ cho phép 2 thành viên
        },
        message: "Cuộc trò chuyện chỉ được có 2 thành viên!",
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCounts: {
      type: Map,
      of: Number, // key là userId, value là số tin chưa đọc
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
