const cloudinary = require("../cloudinary");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const uploadSingle = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được gửi lên",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });

    // Xóa file tạm
    fs.unlinkSync(file.path);

    req.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (error) {
    //xóa file nếu upload thất bại
    if (fs.existsSync(file?.path)) fs.unlinkSync(file.path);

    console.error("❌ Lỗi upload Cloudinary:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi upload ảnh lên Cloudinary.",
      error: error.message,
    });
  }
});

module.exports = uploadSingle;
