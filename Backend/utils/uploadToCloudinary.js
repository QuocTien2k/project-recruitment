const cloudinary = require("../cloudinary");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const uploadMultiple = asyncHandler(async (req, res, next) => {
  try {
    const images = req.files;
    const imageResults = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });

      imageResults.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      // ❌ Xóa file tạm sau khi upload
      fs.unlinkSync(image.path);
    }

    req.images = imageResults; // [{ url, public_id }, ...]
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal error at: uploadMultiple.js - ${error}`);
  }
});

module.exports = uploadMultiple;
