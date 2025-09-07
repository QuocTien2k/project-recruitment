const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // người thích
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // giáo viên được thích
      required: true,
    },
  },
  { timestamps: true }
);

// Tránh trường hợp 1 user thích 1 teacher nhiều lần
favoriteSchema.index({ user: 1, teacher: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
