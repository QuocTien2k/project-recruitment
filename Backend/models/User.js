const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    middleName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: {
      url: {
        type: String,
        required: false,
      },
      public_id: {
        type: String,
        required: false,
      },
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false, // không cần trả về khi query user
    },
    role: { type: String, enum: ["user", "teacher", "admin"], default: "user" },
    district: { type: String, required: true },
    province: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true, // mặc định tài khoản đang hoạt động
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
