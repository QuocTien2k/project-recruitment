const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String },
    attachments: [
      {
        url: String,
        public_id: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Chặn apply trùng
applicationSchema.index({ post: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
