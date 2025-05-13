const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");

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

// lấy danh sách teacher ở role user
const getPublicTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find()
      .populate("userId", "middleName name email profilePic province district") // Lấy info cơ bản từ bảng User
      .select("-degreeImages -__v"); // Không trả về degreeImages

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
  getLogged,
  getPublicTeachers,
};
