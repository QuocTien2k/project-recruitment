const UserModel = require("../models/User");

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

module.exports = {
  getLogged,
  getUserById,
};
