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
    console.log(error);
    res
      .status(500)
      .send(`Internal error at: uploadSingleToCloudinary.js - ${error}`);
  }
});

module.exports = uploadSingle;
