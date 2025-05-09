const cloudinary = require("../cloudinary");
const asyncHandler = require("express-async-handler");

const uploadMultiple = asyncHandler(async (req, resizeBy, next) => {
  try {
    const images = req.files;
    //console.log(images);
    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });

      imageUrls.push(result.secure_url);
    }

    req.images = imageUrls;
    //console.log(req.images);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal error at: uploadMultiple.js - ${error}`);
  }
});

module.exports = uploadMultiple;
