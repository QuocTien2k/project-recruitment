const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    salary: { type: String, required: true },
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional: denormalized fields
    createdByName: { type: String },
    createdByRole: { type: String },
    hiredTeacher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Tự động tạo slug trước khi lưu
postSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra trùng slug trong DB
    while (await this.constructor.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
