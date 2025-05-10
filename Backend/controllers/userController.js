const UserModel = require("../models/User");

//lấy toàn bộ thông tin
const getLogged = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).send({
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    res.status(200).send({
      message: "Lấy thông tin user đăng nhập thành công",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Lỗi: " + error.message,
      success: false,
    });
  }
};

module.exports = {
  getLogged,
};
