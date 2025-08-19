const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");
const PostModel = require("../models/Post");

/********************* Account ************************** */
// lấy danh sách user hoạt động
const getActiveUsers = async (req, res) => {
  try {
    const { id, name, email, province, district } = req.query;

    const query = { role: "user", isActive: true };

    if (id) query._id = id;
    if (name) {
      query.$or = [
        { name: { $regex: name, $options: "i" } },
        { middleName: { $regex: name, $options: "i" } },
      ];
    }
    if (email) query.email = { $regex: email, $options: "i" };
    if (province) query.province = province;
    if (district) query.district = district;

    const users = await UserModel.find(query).select(
      "-password -resetPasswordToken"
    );

    res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lấy danh sách người dùng thất bại! " + error.message,
      success: false,
    });
  }
};

// lấy danh sách user tạm khóa
const getInActiveUsers = async (req, res) => {
  try {
    const { id, name, email, province, district } = req.query;

    const query = { role: "user", isActive: false };

    if (id) query._id = id;
    if (name) {
      query.$or = [
        { name: { $regex: name, $options: "i" } },
        { middleName: { $regex: name, $options: "i" } },
      ];
    }
    if (email) query.email = { $regex: email, $options: "i" };
    if (province) query.province = province;
    if (district) query.district = district;

    const users = await UserModel.find(query).select(
      "-password -resetPasswordToken"
    );

    res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lấy danh sách người dùng thất bại! " + error.message,
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
    const user = await UserModel.findByIdAndDelete(userId);

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

    res.status(200).json({
      message: "Xóa tài khoản thành công",
      success: true,
      deletedUser: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa tài khoản",
      error: error.message,
    });
  }
};

/********************* Bài Post ************************** */
// Lấy danh sách bài đang chờ duyệt (có filter)
const getPendingPost = async (req, res) => {
  try {
    const { title, province, district } = req.query;

    // Bắt đầu với điều kiện mặc định
    const filters = { status: "pending" };

    // Nếu có filter tiêu đề
    if (title && title.trim() !== "") {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    // Nếu có filter tỉnh
    if (province && province.trim() !== "") {
      filters.province = province.trim();
    }

    // Nếu có filter quận/huyện
    if (district && district.trim() !== "") {
      filters.district = district.trim();
    }

    // Query dữ liệu
    const pendingPosts = await PostModel.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài tuyển dụng đang chờ duyệt thành công.",
      data: pendingPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Lấy danh sách bài đã duyệt (có filter)
const getApprovedPostByAdmin = async (req, res) => {
  try {
    const { title, province, district } = req.query;

    // Điều kiện mặc định
    const filters = { status: "approved" };

    if (title && title.trim() !== "") {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    if (province && province.trim() !== "") {
      filters.province = province.trim();
    }

    if (district && district.trim() !== "") {
      filters.district = district.trim();
    }

    const approvedPosts = await PostModel.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài tuyển dụng duyệt thành công.",
      data: approvedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//duyệt bài
const approvePostByAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tuyển dụng.",
      });
    }

    // Nếu bài đã được duyệt rồi thì không cần duyệt lại
    if (post.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Bài tuyển dụng đã được duyệt trước đó.",
      });
    }

    post.status = "approved";
    await post.save();

    res.status(200).json({
      success: true,
      message: "Duyệt bài tuyển dụng thành công.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//từ chối bài
const rejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    // Kiểm tra có nhập lý do từ chối không
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập lý do từ chối.",
      });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tuyển dụng.",
      });
    }

    if (post.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Bài tuyển dụng đã bị từ chối trước đó.",
      });
    }

    post.status = "rejected";
    post.rejectionReason = reason;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Từ chối bài tuyển dụng thành công.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
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

    res.status(200).json({
      success: true,
      message: "Xóa bài tuyển dụng thành công.",
      deletedId: postId,
    });
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
  getPendingPost,
  getApprovedPostByAdmin,
  approvePostByAdmin,
  rejectPost,
  deletePostByAdmin,
};
