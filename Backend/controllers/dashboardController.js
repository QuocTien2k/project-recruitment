const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const ReportModel = require("../models/Report");
const BlogModel = require("../models/Blog");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Kiểm tra người thực hiện
    const admin = await UserModel.findById(userId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // --- USERS ---
    const activeUsers = await UserModel.countDocuments({
      role: "user",
      isActive: true,
    });
    const blockedUsers = await UserModel.countDocuments({
      role: "user",
      isActive: false,
    });

    // --- TEACHERS ---
    const activeTeachers = await UserModel.countDocuments({
      role: "teacher",
      isActive: true,
    });
    const blockedTeachers = await UserModel.countDocuments({
      role: "teacher",
      isActive: false,
    });

    // --- POSTS ---
    const pendingPosts = await PostModel.countDocuments({ status: "pending" });
    const approvedPosts = await PostModel.countDocuments({
      status: "approved",
    });

    // --- REPORTS ---
    const pendingReports = await ReportModel.countDocuments({
      status: "pending",
    });
    const resolvedReports = await ReportModel.countDocuments({
      status: "resolved",
    });

    // --- BLOGS ---
    const totalBlogs = await BlogModel.countDocuments();

    // --- TỔNG HỢP ---
    res.status(200).json({
      message: "Lấy dữ liệu thành công!",
      success: true,
      accounts: {
        activeUsers,
        blockedUsers,
        activeTeachers,
        blockedTeachers,
      },
      posts: {
        pending: pendingPosts,
        approved: approvedPosts,
      },
      reports: {
        pending: pendingReports,
        resolved: resolvedReports,
      },
      blogs: {
        total: totalBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = { getDashboard };
