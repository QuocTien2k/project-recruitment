const UserModel = require("../models/User");
const cloudinary = require("../cloudinary");

//lấy toàn bộ thông tin
const getLogged = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    res.status(200).json({
      message: "Lấy thông tin user đăng nhập thành công",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi: " + error.message,
      success: false,
    });
  }
};

//lấy thông tin dựa vào id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server: " + error.message,
      success: false,
    });
  }
};

//update avatar
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Kiểm tra có ảnh mới không
    if (!req.image || !req.image.url) {
      return res.status(400).json({
        success: false,
        message: "Không có ảnh được tải lên",
      });
    }

    // Tìm user hiện tại
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Nếu có avatar cũ → xoá khỏi Cloudinary
    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Cập nhật ảnh mới
    user.profilePic = {
      url: req.image.url,
      public_id: req.image.public_id,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công",
      avatar: user.profilePic.url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

module.exports = {
  getLogged,
  getUserById,
  updateAvatar,
};
