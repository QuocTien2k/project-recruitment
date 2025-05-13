const UserModel = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user" }).select(
      "-password -resetPasswordToken"
    );

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(400).send({
      message: "Lấy danh sách người dùng thất bại!" + error.message,
      success: false,
    });
  }
};

module.exports = {
  getAllUsers,
};
