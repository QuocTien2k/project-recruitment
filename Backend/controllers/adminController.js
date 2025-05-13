const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");

//lấy danh sách user hoạt động
const getActiveUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user", isActive: true }).select(
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

//lấy danh sách teacher
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find()
      .populate(
        "userId",
        "middleName name email phone profilePic province district"
      ) // Lấy info cơ bản từ bảng User
      .select("-__v");

    res.status(200).json({
      success: true,
      total: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách giáo viên",
      error: error.message,
    });
  }
};

module.exports = {
  getActiveUsers,
  getAllTeachers,
};
