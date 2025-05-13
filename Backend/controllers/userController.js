const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");

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

// Lấy danh sách giáo viên đang hoạt động (isActive = true)
const getPublicTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find()
      .populate(
        "userId",
        "middleName name email profilePic province district isActive"
      )
      .select("-degreeImages -__v");

    // Lọc thủ công những giáo viên có userId.isActive === true
    const activeTeachers = teachers.filter(
      (teacher) => teacher.userId && teacher.userId.isActive
    );

    res.status(200).json({
      success: true,
      total: activeTeachers.length,
      teachers: activeTeachers,
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
