const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    salary: { type: String, required: true },
    workingType: { type: String, enum: ["online", "offline"], required: true },
    timeType: {
      type: String,
      enum: ["full-time", "part-time"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional: denormalized fields
    createdByName: { type: String },
    createdByRole: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
