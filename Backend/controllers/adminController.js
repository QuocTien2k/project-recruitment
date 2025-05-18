const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");
const PostModel = require("../models/Post");

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
    res.status(400).json({
      message: "Lấy danh sách người dùng thất bại!" + error.message,
      success: false,
    });
  }
};

//lấy danh sách user tạm khóa
const getInActiveUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      role: "user",
      isActive: false,
    }).select("-password -resetPasswordToken");

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lấy danh sách người dùng thất bại!" + error.message,
      success: false,
    });
  }
};

//lấy danh sách teacher hoạt động
const getActiveTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find()
      .populate(
        "userId",
        "middleName name email phone profilePic province district isActive"
      ) // Lấy info cơ bản từ bảng User
      .select("-__v");

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

//lấy danh sách teacher tạm khóa
const getInActiveTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find()
      .populate(
        "userId",
        "middleName name email phone profilePic province district isActive"
      ) // Lấy info cơ bản từ bảng User
      .select("-__v");

    const activeTeachers = teachers.filter(
      (teacher) => teacher.userId && !teacher.userId.isActive
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

//cập nhật trạng thái cho tài khoản
const toggleAccountStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).select(
      "-password -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Lật trạng thái
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Tài khoản đã được ${
        user.isActive ? "mở khóa" : "khóa"
      } thành công`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái tài khoản",
      error: error.message,
    });
  }
};

//xóa tài khoản
const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "không tìm thấy tài khoản",
        success: false,
      });
    }

    //xóa trong bảng teacher
    if (user.role === "teacher") {
      await TeacherModel.findOneAndDelete({ userId: user.id });
    }

    //xóa trong bảng user
    await UserModel.findOneAndDelete(userId);

    res.status(200).json({
      message: "Xóa tài khoản thành công",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa tài khoản",
      error: error.message,
    });
  }
};

//xóa bài post
const deletePostByAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài tuyển dụng." });
    }

    await PostModel.findByIdAndDelete(postId);

    res.status(200).json({ message: "Xóa bài tuyển dụng thành công." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  getActiveUsers,
  getInActiveUsers,
  getActiveTeachers,
  getInActiveTeachers,
  toggleAccountStatus,
  deleteAccount,
  deletePostByAdmin,
};
