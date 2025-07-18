const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: { type: Number, required: true },
    workingType: { type: String, enum: ["online", "offline"], required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
