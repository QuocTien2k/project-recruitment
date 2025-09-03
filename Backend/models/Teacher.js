const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: { type: Number, required: true },
    workingType: {
      type: String,
      enum: ["online", "offline", "both"],
      required: true,
    },
    timeType: {
      type: String,
      enum: ["full-time", "part-time"],
      required: true,
    },
    subject: [{ type: String, required: true }],
    description: { type: String, required: true },
    degreeImages: [
      {
        url: String,
        public_id: String,
      },
    ],
    faculty: {
      type: String,
      enum: ["xahoi", "tunhien", "ngoaingu", "khac"],
      required: true,
    },
    teachingLevel: {
      type: String,
      enum: ["cap1", "cap2", "cap3", "daihoc", "khac"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
