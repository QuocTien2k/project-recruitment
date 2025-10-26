const PostModel = require("../models/Post");
const ViewerModel = require("../models/Viewer");
const TeacherModel = require("../models/Teacher");

//lấy bài viết đã duyệt
const getAllApprovedPosts = async (req, res) => {
  try {
    const { title, province, district, workingType, timeType } = req.query;

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

    if (workingType && workingType.trim() !== "") {
      filters.workingType = workingType.trim(); // "online" hoặc "offline"
    }

    if (timeType && timeType.trim() !== "") {
      filters.timeType = timeType.trim(); // "full-time" hoặc "part-time"
    }

    const posts = await PostModel.find(filters)
      .sort({ createdAt: -1 })
      .populate("createdBy", "middleName name isActive");

    //lấy những bài mà tác giả còn hoạt động
    const visiblePosts = posts.filter((post) => post.createdBy.isActive);

    const formattedPosts = visiblePosts.map((post) => {
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

//lấy 9 bài viết đã duyệt
const getApproveShortList = async (req, res) => {
  try {
    const posts = await PostModel.find({ status: "approved" })
      .sort({ createdAt: -1 }) //mới nhất
      .limit(9)
      .populate("createdBy", "middleName name isActive");

    //lấy những bài mà tác giả còn hoạt động
    const visiblePosts = posts.filter((post) => post.createdBy.isActive);

    const formattedPosts = visiblePosts.map((post) => {
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
      message: "Lấy bài viết thành công",
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

// Bài viết tương tự dựa vào province
const getRelatedPostsByProvince = async (req, res) => {
  try {
    const { id } = req.params; // id bài gốc

    // Tìm bài gốc
    const currentPost = await PostModel.findById(id);
    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại.",
      });
    }

    // Lấy danh sách bài viết tương tự theo province
    const relatedPosts = await PostModel.find({
      _id: { $ne: currentPost._id }, // loại bỏ bài gốc
      province: currentPost.province, // cùng province
      status: "approved", // chỉ lấy bài đã duyệt
    })
      .populate("createdBy", "middleName name email profilePic isActive")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    //lấy những bài mà tác giả còn hoạt động
    const visiblePosts = relatedPosts.filter((post) => post.createdBy.isActive);

    // Chuẩn hóa dữ liệu trả về
    const data = visiblePosts.map((post) => {
      const fullName = post.createdBy
        ? `${post.createdBy.middleName || ""} ${
            post.createdBy.name || ""
          }`.trim()
        : "";
      return {
        _id: post._id,
        title: post.title,
        slug: post.slug,
        createdAt: post.createdAt,
        province: post.province,
        district: post.district,
        salary: post.salary,
        workingType: post.workingType,
        timeType: post.timeType,
        createdBy: {
          ...post.createdBy,
          fullName,
        },
      };
    });

    res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//lấy 8 giáo viên đang hoạt động
const getTeachersShortList = async (req, res) => {
  try {
    const teachers = await TeacherModel.aggregate([
      // Chỉ lấy teacher có userId.isActive = true
      {
        $lookup: {
          from: "users", // collection user
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: { isActive: true } }, // chỉ user đang active
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" }, // chỉ lấy teacher có user match
      { $project: { degreeImages: 0, __v: 0 } }, // loại bỏ field không cần thiết
      { $limit: 8 }, // lấy tối đa 8 giáo viên
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
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

    // Build teacher filters
    const teacherMatch = {};
    if (experience) {
      // Trường hợp dạng "0-1", "2-3"
      if (experience.includes("-")) {
        const parts = experience.split("-"); // "2-3" -> ["2", "3"]
        const min = Number(parts[0]);
        const max = Number(parts[1]);

        // Tìm teacher có số năm kinh nghiệm >= min và <= max
        teacherMatch.experience = { $gte: min, $lte: max };
      }
      // Trường hợp dạng "5+" (từ 5 năm trở lên)
      else if (experience.endsWith("+")) {
        const min = Number(experience.replace("+", "")); // "5+" -> 5
        teacherMatch.experience = { $gte: min };
      }
      // Trường hợp chỉ có một số (fallback)
      else {
        teacherMatch.experience = Number(experience);
      }
    }
    if (workingType) teacherMatch.workingType = workingType;
    if (timeType) teacherMatch.timeType = timeType;
    if (subject) teacherMatch.subject = { $regex: subject, $options: "i" };

    // Build user filters
    const userMatch = { isActive: true };
    if (province) userMatch.province = province;
    if (district) userMatch.district = district;

    const teachers = await TeacherModel.aggregate([
      { $match: teacherMatch }, // filter teacher
      {
        $lookup: {
          from: "users", // tên collection
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: userMatch }, // filter user
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" }, // chỉ lấy teacher có user thỏa match
      { $project: { degreeImages: 0, __v: 0 } }, // loại bỏ field không cần thiết
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm danh sách giáo viên",
      error: error.message,
    });
  }
};

// lấy danh sách giáo viên khoa tự nhiên
const getListTeacherNatural = async (req, res) => {
  try {
    const { experience, workingType, timeType, subject, province, district } =
      req.query;

    // Build teacher filters
    const teacherMatch = { faculty: "tunhien" }; //thêm điều kiện faculty
    if (experience) {
      if (experience.includes("-")) {
        const [min, max] = experience.split("-").map(Number);
        teacherMatch.experience = { $gte: min, $lte: max };
      } else if (experience.endsWith("+")) {
        const min = Number(experience.replace("+", ""));
        teacherMatch.experience = { $gte: min };
      } else {
        teacherMatch.experience = Number(experience);
      }
    }
    if (workingType) teacherMatch.workingType = workingType;
    if (timeType) teacherMatch.timeType = timeType;
    if (subject) teacherMatch.subject = { $regex: subject, $options: "i" };

    // Build user filters
    const userMatch = { isActive: true };
    if (province) userMatch.province = province;
    if (district) userMatch.district = district;

    const teachers = await TeacherModel.aggregate([
      { $match: teacherMatch },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: userMatch },
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      { $project: { degreeImages: 0, __v: 0 } },
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm danh sách giáo viên khoa tự nhiên",
      error: error.message,
    });
  }
};
// lấy danh sách giáo viên khoa xã hội
const getListTeacherSocial = async (req, res) => {
  try {
    const { experience, workingType, timeType, subject, province, district } =
      req.query;

    // Build teacher filters
    const teacherMatch = { faculty: "xahoi" }; //thêm điều kiện faculty
    if (experience) {
      if (experience.includes("-")) {
        const [min, max] = experience.split("-").map(Number);
        teacherMatch.experience = { $gte: min, $lte: max };
      } else if (experience.endsWith("+")) {
        const min = Number(experience.replace("+", ""));
        teacherMatch.experience = { $gte: min };
      } else {
        teacherMatch.experience = Number(experience);
      }
    }
    if (workingType) teacherMatch.workingType = workingType;
    if (timeType) teacherMatch.timeType = timeType;
    if (subject) teacherMatch.subject = { $regex: subject, $options: "i" };

    // Build user filters
    const userMatch = { isActive: true };
    if (province) userMatch.province = province;
    if (district) userMatch.district = district;

    const teachers = await TeacherModel.aggregate([
      { $match: teacherMatch },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: userMatch },
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      { $project: { degreeImages: 0, __v: 0 } },
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm danh sách giáo viên khoa xã hội",
      error: error.message,
    });
  }
};

// lấy danh sách giáo viên khoa ngoại ngữ
const getListTeacherLanguages = async (req, res) => {
  try {
    const { experience, workingType, timeType, subject, province, district } =
      req.query;

    // Build teacher filters
    const teacherMatch = { faculty: "ngoaingu" }; //thêm điều kiện faculty
    if (experience) {
      if (experience.includes("-")) {
        const [min, max] = experience.split("-").map(Number);
        teacherMatch.experience = { $gte: min, $lte: max };
      } else if (experience.endsWith("+")) {
        const min = Number(experience.replace("+", ""));
        teacherMatch.experience = { $gte: min };
      } else {
        teacherMatch.experience = Number(experience);
      }
    }
    if (workingType) teacherMatch.workingType = workingType;
    if (timeType) teacherMatch.timeType = timeType;
    if (subject) teacherMatch.subject = { $regex: subject, $options: "i" };

    // Build user filters
    const userMatch = { isActive: true };
    if (province) userMatch.province = province;
    if (district) userMatch.district = district;

    const teachers = await TeacherModel.aggregate([
      { $match: teacherMatch },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: userMatch },
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      { $project: { degreeImages: 0, __v: 0 } },
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm danh sách giáo viên khoa ngoại ngữ",
      error: error.message,
    });
  }
};

// Lấy 8 giáo viên có kinh nghiệm >= 5 năm để làm slider
const getExperiencedTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.aggregate([
      {
        $match: {
          experience: { $gte: 5 }, // lọc >= 5 năm
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $match: { isActive: true }, // chỉ lấy user còn active
            },
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      { $project: { degreeImages: 0, __v: 0 } },
      { $sort: { experience: -1 } }, // ưu tiên giáo viên kinh nghiệm cao hơn
      { $limit: 6 }, // chỉ lấy 6 người
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách giáo viên 5+ năm kinh nghiệm",
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

//lấy giáo viên tương tự dựa vào id
const getSimilarTeachers = async (req, res) => {
  try {
    const { id } = req.params;
    const currentTeacher = await TeacherModel.findById(id);
    if (!currentTeacher) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giáo viên!" });
    }

    const teachers = await TeacherModel.aggregate([
      {
        $match: {
          faculty: currentTeacher.faculty,
          _id: { $ne: currentTeacher._id },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            { $match: { isActive: true } },
            {
              $project: {
                middleName: 1,
                name: 1,
                email: 1,
                profilePic: 1,
                province: 1,
                district: 1,
                isActive: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      { $project: { degreeImages: 0, __v: 0 } },
      { $limit: 8 }, // lấy 8 giáo viên gợi ý
    ]);

    res.status(200).json({
      success: true,
      total: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách giáo viên tương tự",
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
  getApproveShortList,
  getDetailPost,
  getPostBySlug,
  getTeachersShortList,
  getListTeachers,
  getListTeacherNatural,
  getListTeacherSocial,
  getListTeacherLanguages,
  getPublicTeacherDetail,
  getExperiencedTeachers,
  getSimilarTeachers,
  getRelatedPostsByProvince,
  countViews,
};
