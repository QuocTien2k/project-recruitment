const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Người chặn
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // người bị chặn
  },
  { timestamps: true }
);

//tránh cùng 1ng chặn nhiều lần
blockSchema.index({ blockedBy: 1, blockedUser: 1 }, { unique: true });

module.exports = mongoose.model("Block", blockSchema);
