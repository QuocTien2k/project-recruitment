const UserModel = require("../models/User");
const BlogModel = require("../models/Blog");
const TeacherModel = require("../models/Teacher");
const PostModel = require("../models/Post");
const Notification = require("../models/Notification");
const deleteImage = require("../utils/deleteFromCloudinary");

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
    const { userId, name, email, province, district, faculty } = req.query;

    let teacherQuery = {};
    if (userId) teacherQuery.userId = userId;
    if (faculty) teacherQuery.faculty = faculty;

    let userQuery = { isActive: true, role: "teacher" };
    if (name) {
      userQuery.$or = [
        { name: { $regex: name, $options: "i" } },
        { middleName: { $regex: name, $options: "i" } },
      ];
    }
    if (email) userQuery.email = { $regex: email, $options: "i" };
    if (province) userQuery.province = province;
    if (district) userQuery.district = district;

    const teachers = await TeacherModel.find(teacherQuery)
      .populate({
        path: "userId",
        match: userQuery, // lọc user theo điều kiện
        select:
          "middleName name email phone profilePic province district faculty isActive",
      })
      .select("-__v");

    // Sau khi populate, có thể có teacher.userId = null nếu user không match
    const activeTeachers = teachers.filter((teacher) => teacher.userId);

    res.status(200).json({
      success: true,
      total: activeTeachers.length,
      data: activeTeachers,
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
    const { userId, name, email, province, district, faculty } = req.query;

    let teacherQuery = {};
    if (userId) teacherQuery.userId = userId;

    let userQuery = { isActive: false, role: "teacher" };

    if (name) {
      userQuery.$or = [
        { name: { $regex: name, $options: "i" } },
        { middleName: { $regex: name, $options: "i" } },
      ];
    }
    if (email) userQuery.email = { $regex: email, $options: "i" };
    if (province) userQuery.province = province;
    if (district) userQuery.district = district;
    if (faculty) userQuery.faculty = faculty;

    const teachers = await TeacherModel.find(teacherQuery)
      .populate({
        path: "userId",
        match: userQuery, // lọc user theo điều kiện
        select:
          "middleName name email phone profilePic province district faculty isActive",
      })
      .select("-__v");

    const inActiveTeachers = teachers.filter((teacher) => teacher.userId);

    res.status(200).json({
      success: true,
      total: inActiveTeachers.length,
      data: inActiveTeachers,
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

    // 1. Xóa profilePic nếu có
    if (user.profilePic?.public_id) {
      await deleteImage(user.profilePic.public_id);
    }

    // 2. Nếu user là teacher
    if (user.role === "teacher") {
      const teacher = await TeacherModel.findOne({ userId: user._id });

      if (teacher) {
        // Xóa degreeImages
        if (teacher.degreeImages?.length > 0) {
          for (const img of teacher.degreeImages) {
            if (img.public_id) {
              await deleteImage(img.public_id);
            }
          }
        }

        // Xóa document teacher
        await TeacherModel.findOneAndDelete({ userId: user._id });
      }
    }

    // 3. Cuối cùng xóa user
    await UserModel.findByIdAndDelete(user._id);

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
    const { title, province, district, dateFrom, dateTo } = req.query;

    const filters = { status: "pending" };

    if (title && title.trim()) {
      filters.title = { $regex: title.trim(), $options: "i" };
    }
    if (province && province.trim()) filters.province = province.trim();
    if (district && district.trim()) filters.district = district.trim();

    //filter theo khoảng thời gian tạo
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom); // ví dụ: "2025-09-01"
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999); // bao trọn ngày cuối
        filters.createdAt.$lte = end;
      }
    }

    const pendingPosts = await PostModel.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài tuyển dụng đang chờ duyệt thành công.",
      total: pendingPosts.length,
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
    const { title, province, district, dateFrom, dateTo } = req.query;

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

    //filter theo khoảng thời gian tạo
    //$gte = greater than or equal
    //$lte = less than or equal (nhỏ hơn hoặc bằng).
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      //"2025-09-10T00:00:00.000Z"
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999); // bao trọn ngày cuối: "2025-09-10T23:59:59.999Z"
        filters.createdAt.$lte = end;
      }
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

    // 🔔 Tạo thông báo cho chủ bài viết
    const notification = await Notification.create({
      user: post.createdBy, // id user tạo bài viết
      type: "POST_APPROVED",
      post: post._id,
      message: `Bài viết "${post.title}" của bạn đã được duyệt!`,
    });

    // emit socket realtime
    req.app
      .get("io")
      .to(post.createdBy.toString())
      .emit("receive-notification", notification);
    //console.log("Emit noti tới:", post.createdBy.toString(), notification);

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

    // 🔔 Tạo thông báo cho chủ bài viết
    const notification = await Notification.create({
      user: post.createdBy,
      type: "POST_REJECTED",
      post: post._id,
      message: `Bài viết "${post.title}" của bạn đã bị từ chối!`,
    });

    // emit socket realtime luôn
    req.app
      .get("io")
      .to(post.createdBy.toString())
      .emit("receive-notification", notification);
    //console.log("Emit noti tới:", post.createdBy.toString(), notification);

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

/********************* Blog ************************** */
const createBlogByAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy user từ token
    const { title, desc1, desc2 } = req.body;

    //1️⃣ Kiểm tra người tạo
    const admin = await UserModel.findById(userId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 2️⃣ Kiểm tra dữ liệu đầu vào
    if (!title || !desc1 || !desc2) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    //3️⃣ Ảnh blog
    const blogImage = req.image;
    if (!blogImage || !blogImage.url || !blogImage.public_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tải lên 1 ảnh.",
      });
    }

    // 4️⃣ Tạo blog mới
    const blog = await BlogModel.create({
      title,
      blogPic: blogImage,
      desc1,
      desc2,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo blog thành công.",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const updateBlogByAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy user từ token
    const { blogId } = req.params;
    const { title, desc1, desc2 } = req.body;

    //1️⃣ Kiểm tra người cập nhật
    const admin = await UserModel.findById(userId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 2️⃣ Tìm bài blog
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài blog này.",
      });
    }

    // 3️⃣ Kiểm tra có ảnh mới không
    if (req.image && req.image.url) {
      // Nếu có ảnh mới → xoá ảnh cũ + cập nhật
      if (blog.blogPic?.public_id) {
        await cloudinary.uploader.destroy(blog.blogPic.public_id);
      }

      //4️⃣ Cập nhật ảnh mới
      blog.blogPic = {
        url: req.image.url,
        public_id: req.image.public_id,
      };
    }

    // Cập nhật dữ liệu
    blog.title = title || blog.title;
    blog.desc1 = desc1 || blog.desc1;
    blog.desc2 = desc2 || blog.desc2;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật bài blog thành công.",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const deleteBlogByAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy user từ token
    const { blogId } = req.params;

    // 1️⃣ Kiểm tra người thực hiện
    const admin = await UserModel.findById(userId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 2️⃣ Tìm blog
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài blog này.",
      });
    }

    // 3️⃣ Xoá ảnh trên Cloudinary (nếu có)
    if (blog.blogPic?.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.blogPic.public_id);
      } catch (error) {
        console.error("❌ Lỗi xoá ảnh Cloudinary:", error.message);
      }
    }

    // 4️⃣ Xoá blog trong DB
    await blog.deleteOne();

    // 5️⃣ Lấy danh sách blog còn lại
    const blogs = await BlogModel.find().sort({ createdAt: -1 });

    // 6️⃣ Trả phản hồi
    return res.status(200).json({
      success: true,
      message: "Xoá bài blog thành công.",
      data: blogs,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xoá blog:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { title } = req.query;

    // 1️⃣ Tạo điều kiện tìm kiếm
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // không phân biệt hoa thường
    }

    // 2️⃣ Truy vấn DB
    const blogs = await BlogModel.find(query)
      .populate("createdBy", "role")
      .sort({ createdAt: -1 });

    // 3️⃣ Trả về
    res.status(200).json({
      success: true,
      message: title
        ? `Kết quả tìm kiếm cho "${title}"`
        : "Lấy danh sách blog thành công.",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const getBlogDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1️⃣ Tìm blog theo slug
    const blog = await BlogModel.findOne({ slug }).populate(
      "createdBy",
      "role"
    );

    // 2️⃣ Kiểm tra tồn tại
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài blog này.",
      });
    }

    // 3️⃣ Trả về dữ liệu
    res.status(200).json({
      success: true,
      message: "Lấy chi tiết blog thành công.",
      data: blog,
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
  createBlogByAdmin,
  updateBlogByAdmin,
  deleteBlogByAdmin,
  getAllBlogs,
  getBlogDetailBySlug,
};
