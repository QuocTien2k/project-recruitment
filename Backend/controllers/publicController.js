const PostModel = require("../models/Post");
const ViewerModel = require("../models/Viewer");
const TeacherModel = require("../models/Teacher");

//lấy bài viết đã duyệt
const getAllApprovedPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "middleName name");

    const formattedPosts = posts.map((post) => {
      const { _id } = post.createdBy;
      const fullName = `${post.createdBy.middleName} ${post.createdBy.name}`;
      return {
        ...post._doc,
        createdBy: {
          _id,
          fullName,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài viết đã duyệt thành công.",
      data: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//lấy bài viết tạo bởi user và thông tin user
const getDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate(
      "createdBy",
      "middleName name email profilePic"
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại." });
    }
    if (!post.createdBy) {
      return res
        .status(404)
        .json({ success: false, message: "Người tạo bài viết không tồn tại." });
    }

    const fullName = `${post.createdBy.middleName} ${post.createdBy.name}`;

    res.status(200).json({
      success: true,
      data: {
        ...post._doc,
        createdBy: {
          ...post.createdBy._doc,
          fullName,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//chi tiết bài viết dựa vào slug
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await PostModel.findOne({ slug }).populate(
      "createdBy",
      "middleName name email profilePic"
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại." });
    }

    const fullName = `${post.createdBy.middleName} ${post.createdBy.name}`;

    res.status(200).json({
      success: true,
      data: {
        ...post._doc,
        createdBy: {
          ...post.createdBy._doc,
          fullName,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//lấy 12 giáo viên đang hoạt động
const getTeachersShortList = async (req, res) => {
  try {
    // Lấy 12 teacher có userId.isActive = true
    const teachers = await TeacherModel.find()
      .populate({
        path: "userId",
        match: { isActive: true },
        select: "middleName name email profilePic province district isActive",
      })
      .select("-degreeImages -__v")
      .limit(12);

    // Loại bỏ teacher không match userId.isActive
    const activeTeachers = teachers.filter((t) => t.userId);

    res.status(200).json({
      success: true,
      total: activeTeachers.length,
      data: activeTeachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách giáo viên rút gọn",
      error: error.message,
    });
  }
};

//lấy danh sách giáo viên + search
const getListTeachers = async (req, res) => {
  try {
    const { experience, workingType, timeType, subject, province, district } =
      req.query;

    // Query cho Teacher
    const teacherQuery = {};
    if (experience) teacherQuery.experience = experience;
    if (workingType) teacherQuery.workingType = workingType;
    if (timeType) teacherQuery.timeType = timeType;
    if (subject) teacherQuery.subject = { $regex: subject, $options: "i" };

    // Query cho User
    const userMatch = { isActive: true };
    if (province) userMatch.province = province;
    if (district) userMatch.district = district;

    const teachers = await TeacherModel.find(teacherQuery)
      .populate({
        path: "userId",
        match: userMatch,
        select: "middleName name email profilePic province district isActive",
      })
      .select("-degreeImages -__v");

    const activeTeachers = teachers.filter((t) => t.userId);

    res.status(200).json({
      success: true,
      total: activeTeachers.length,
      data: activeTeachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm danh sách giáo viên",
      error: error.message,
    });
  }
};

// Lấy chi tiết 1 giáo viên đang hoạt động
const getPublicTeacherDetail = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await TeacherModel.findById(teacherId)
      .populate(
        "userId",
        "middleName name email profilePic province district isActive"
      )
      .select("-degreeImages -__v");

    // Trường hợp không tìm thấy giáo viên
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giáo viên",
      });
    }

    // Kiểm tra user liên kết có đang hoạt động không
    if (!teacher.userId || !teacher.userId.isActive) {
      return res.status(403).json({
        success: false,
        message: "Giáo viên không còn hoạt động",
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết giáo viên",
      error: error.message,
    });
  }
};

//tổng số lượt xem 1 bài viết
const countViews = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "Bài viết không tồn tại." });
    }

    const totalViews = await ViewerModel.countDocuments({ postId });
    res.status(200).json({ success: true, totalViews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllApprovedPosts,
  getDetailPost,
  getPostBySlug,
  getTeachersShortList,
  getListTeachers,
  getPublicTeacherDetail,
  countViews,
};
