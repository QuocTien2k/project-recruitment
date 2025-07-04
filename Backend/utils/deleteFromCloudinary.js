const cloudinary = require("../cloudinary");

const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: "image", // hoặc "auto"
    });
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
};

module.exports = deleteImage;
