const UserModel = require("../models/User");
const FavoriteModel = require("../models/Favorite");
const TeacherModel = require("../models/Teacher");
const SavedPostModel = require("../models/SavedPost.js");
const PostModel = require("../models/Post.js");
const ReportModel = require("../models/Report.js");
const cloudinary = require("../cloudinary");
const bcrypt = require("bcryptjs");

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

    let responseData = {
      _id: user._id,
      name: user.name,
      middleName: user.middleName,
      email: user.email,
      phone: user.phone,
      province: user.province,
      district: user.district,
      role: user.role,
      isActive: user.isActive,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Nếu là giáo viên → lấy thêm thông tin từ bảng teacher
    if (user.role === "teacher") {
      const teacher = await TeacherModel.findOne({ userId: user._id });
      if (teacher) {
        responseData = {
          ...responseData,
          teacher: {
            workingType: teacher.workingType,
            timeType: teacher.timeType,
            description: teacher.description,
            faculty: teacher.faculty,
            teachingLevel: teacher.teachingLevel,
            experience: teacher.experience,
          },
        };
      }
    }

    res.status(200).json({
      message: "Lấy thông tin user đăng nhập thành công",
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi: " + error.message,
      success: false,
    });
  }
};

// lấy thông tin dựa vào id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    let teacherId = null;
    if (user.role === "teacher") {
      const teacher = await TeacherModel.findOne({ userId: user._id }).select(
        "_id"
      );
      teacherId = teacher?._id || null;
    }

    // 👉 Trả về user + teacherId (nếu có)
    res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      success: true,
      data: { ...user.toObject(), teacherId },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server: " + error.message,
      success: false,
    });
  }
};

//update avatar
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Kiểm tra có ảnh mới không
    if (!req.image || !req.image.url) {
      return res.status(400).json({
        success: false,
        message: "Không có ảnh được tải lên",
      });
    }

    // Tìm user hiện tại
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Nếu có avatar cũ → xoá khỏi Cloudinary
    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Cập nhật ảnh mới
    user.profilePic = {
      url: req.image.url,
      public_id: req.image.public_id,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công",
      avatar: {
        user: user.profilePic.url,
        public_id: user.profilePic.public_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 1. Kiểm tra đủ trường
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ các trường",
      });
    }

    // 2. Kiểm tra confirm khớp
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    // 3. Tìm user theo token
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 4. Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không đúng",
      });
    }

    // 5. Hash lại mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

//cập nhật thông tin
const updateInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      phone,
      district,
      province,
      workingType,
      timeType,
      description,
      experience,
      faculty,
      teachingLevel,
    } = req.body;

    // 1. Tìm user theo ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 2. Nếu có đổi phone → kiểm tra trùng
    if (phone && phone !== user.phone) {
      const phoneExists = await UserModel.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại đã được sử dụng",
        });
      }
      user.phone = phone;
    }

    // 3. Cập nhật các trường chung (user & teacher)
    if (district) user.district = district;
    if (province) user.province = province;

    await user.save();

    let teacherData = null;
    // 4. Nếu là teacher → cập nhật bảng TeacherModel
    if (user.role === "teacher") {
      const teacher = await TeacherModel.findOne({ userId: user._id });
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy hồ sơ giáo viên",
        });
      }

      if (experience) teacher.experience = experience;
      if (workingType) teacher.workingType = workingType;
      if (timeType) teacher.timeType = timeType;
      if (description) teacher.description = description;
      if (faculty) teacher.faculty = faculty;
      if (teachingLevel) teacher.teachingLevel = teachingLevel;

      await teacher.save();
      teacherData = {
        workingType: teacher.workingType,
        timeType: teacher.timeType,
        description: teacher.description,
        experience: teacher.experience,
        faculty: teacher.faculty,
        teachingLevel: teacher.teachingLevel,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        user: {
          _id: user._id,
          middleName: user.middleName,
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: user.district,
          province: user.province,
          role: user.role,
        },
        ...(teacherData && { teacher: teacherData }),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

/******** Cá nhân - đối với role User ******** */
const getFavoriteTeachers = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy userId từ token
    const { name, email, province, district } = req.query;

    // 1. Lấy tất cả favorite của user kèm theo thông tin User (teacher)
    const favorites = await FavoriteModel.find({ user: userId })
      .populate("teacher", "-password -resetPasswordToken") // populate để lấy thông tin User
      .lean();

    // 2. Lấy danh sách id của teacher (User._id)
    const teacherIds = favorites.map((fav) => fav.teacher._id);

    // 3. Tìm hồ sơ Teacher (TeacherModel) theo danh sách userId
    const teacherProfiles = await TeacherModel.find({
      userId: { $in: teacherIds },
    }).lean();

    // 4. Lọc theo các điều kiện (name, email, province, district)
    let result = favorites
      .map((fav) => {
        const u = fav.teacher; // lấy thông tin từ UseModel
        const tp = teacherProfiles.find(
          (t) => t.userId.toString() === u._id.toString()
        ); // tìm teacher profile

        return {
          _id: u._id, //id bảng User
          name: u.name,
          middleName: u.middleName,
          email: u.email,
          province: u.province,
          district: u.district,
          isActive: u.isActive,
          profilePic: u.profilePic,
          experience: tp?.experience ?? null,
          subject: tp?.subject ?? [],
          faculty: tp?.faculty ?? null,
          workingType: tp?.workingType ?? null,
          timeType: tp?.timeType ?? null,
          teacherId: tp?._id ?? null, //id bảng teacher
        };
      })
      // 5. Chỉ lấy những giáo viên đang hoạt động
      .filter((t) => t.isActive);

    // 6. Lọc theo query (name, email, province, district)
    result = result.filter((t) => {
      if (name) {
        const regex = new RegExp(name, "i");
        if (!regex.test(t.name) && !regex.test(t.middleName)) return false;
      }
      if (email) {
        const regex = new RegExp(email, "i");
        if (!regex.test(t.email)) return false;
      }
      if (province && t.province !== province) return false;
      if (district && t.district !== district) return false;
      return true;
    });

    // 7. Trả kết quả
    res.status(200).json({
      success: true,
      message: "Lấy danh sách yêu thích thành công.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Thêm teacher vào mục yêu thích
const addFavoriteTeacher = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy user từ token
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu teacherId.",
      });
    }

    // kiểm tra teacher có tồn tại không
    const teacher = await UserModel.findOne({
      _id: teacherId,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giáo viên.",
      });
    }

    // tạo bản ghi favorite (sẽ fail nếu đã tồn tại vì unique index)
    const favorite = await FavoriteModel.create({
      user: userId,
      teacher: teacherId,
    });

    res.status(201).json({
      success: true,
      message: "Đã thêm vào mục yêu thích.",
      data: favorite,
    });
  } catch (error) {
    // trường hợp duplicate key error (user + teacher đã tồn tại)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Giáo viên này đã có trong danh sách yêu thích.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//xóa teacher ở mục yêu thích
const removeFavoriteTeacher = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy user từ token
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu teacherId.",
      });
    }

    // xóa bản ghi yêu thích
    const favorite = await FavoriteModel.findOneAndDelete({
      user: userId,
      teacher: teacherId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trong danh sách yêu thích.",
      });
    }

    // lấy lại danh sách yêu thích mới nhất
    const favorites = await FavoriteModel.find({ user: userId }).populate(
      "teacher"
    );

    const teacherIds = favorites.map((fav) => fav.teacher._id);

    const teachers = await UserModel.find({
      _id: { $in: teacherIds },
      isActive: true,
      role: "teacher",
    }).select("-password -resetPasswordToken");

    res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách yêu thích.",
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Check teacher có trong danh sách yêu thích không
const checkFavoriteTeacher = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy từ token
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu teacherId.",
      });
    }

    // tìm xem có tồn tại record favorite không
    const favorite = await FavoriteModel.findOne({
      user: userId,
      teacher: teacherId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite, //ép sang boolean
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const getNearbyTeachers = async (req, res) => {
  try {
    const userId = req.user.userId;

    //lấy user hiện tại từ token
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    //lấy tỉnh thành - phường/xã
    const { province } = currentUser;
    //console.log("Province:", province);

    // Tìm tất cả user có cùng tỉnh role teacher
    const nearbyUsers = await UserModel.find({
      province,
      isActive: true,
      role: "teacher",
    }).select("_id district province");

    if (!nearbyUsers.length) {
      return res.status(200).json({
        success: true,
        message: "Không có giáo viên nào gần bạn.",
        data: [],
      });
    }

    // Lấy danh sách userId của giáo viên cùng tỉnh
    const teacherUserIds = nearbyUsers.map((u) => u._id);

    // Tìm trong bảng Teacher, populate thông tin userId
    const teachers = await TeacherModel.find({
      userId: { $in: teacherUserIds },
    })
      .populate({
        path: "userId",
        select:
          "middleName name email phone profilePic district province isActive role",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách giáo viên gần bạn thành công.",
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

/******** Cá nhân - đối với role Teacher ******** */
const getSavePosts = async (req, res) => {
  try {
    const teacherId = req.user.userId; // lấy teacher từ token
    const { title, province, district, workingType, timeType } = req.query;

    // 1. Lấy danh sách postId mà teacher đã lưu
    const savedPosts = await SavedPostModel.find({ teacher: teacherId }).lean();
    const postIds = savedPosts.map((sp) => sp.post);

    if (!postIds.length) {
      return res.status(200).json({
        success: true,
        message: "Danh sách bài viết đã lưu rỗng.",
        data: [],
      });
    }

    // 2. Xây dựng bộ lọc
    const filters = { _id: { $in: postIds }, status: "approved" };

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
      filters.workingType = workingType.trim();
    }

    if (timeType && timeType.trim() !== "") {
      filters.timeType = timeType.trim();
    }

    // 3. Truy vấn PostModel với filter
    const posts = await PostModel.find(filters)
      .populate("createdBy", "-password -resetPasswordToken")
      .sort({ createdAt: -1 }); // mới nhất trước

    // 4. Trả về kết quả
    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài viết đã lưu thành công.",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const addSavePost = async (req, res) => {
  try {
    const teacherId = req.user.userId; // lấy user từ token
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu postId.",
      });
    }

    // kiểm tra user có phải teacher không
    const teacher = await UserModel.findOne({
      _id: teacherId,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Chỉ giáo viên mới có quyền lưu bài viết.",
      });
    }

    // kiểm tra post có tồn tại không
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết.",
      });
    }

    // tạo bản ghi save (sẽ fail nếu đã tồn tại vì unique index)
    const savedPost = await SavedPostModel.create({
      teacher: teacherId,
      post: postId,
    });

    res.status(201).json({
      success: true,
      message: "Đã lưu bài viết.",
      data: savedPost,
    });
  } catch (error) {
    // trường hợp duplicate key error (teacher + post đã tồn tại)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã lưu bài viết này trước đó.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Xóa post khỏi mục đã lưu (chỉ teacher mới có quyền)
const removeSavePost = async (req, res) => {
  try {
    const teacherId = req.user.userId; // lấy user từ token
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu postId.",
      });
    }

    // kiểm tra user có phải teacher không
    const teacher = await UserModel.findOne({
      _id: teacherId,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Chỉ giáo viên mới có quyền xóa bài đã lưu.",
      });
    }

    // xóa bản ghi lưu
    const saved = await SavedPostModel.findOneAndDelete({
      teacher: teacherId,
      post: postId,
    });

    if (!saved) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trong danh sách đã lưu.",
      });
    }

    // lấy lại danh sách bài viết đã lưu mới nhất
    const savedPosts = await SavedPostModel.find({
      teacher: teacherId,
    }).populate("post");

    // lọc danh sách postId
    const postIds = savedPosts.map((sp) => sp.post._id);

    const posts = await PostModel.find({
      _id: { $in: postIds },
      status: "approved", // chỉ lấy bài viết còn hợp lệ
    }).populate("createdBy", "-password -resetPasswordToken");

    res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách đã lưu.",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const checkSavePost = async (req, res) => {
  try {
    const teacherId = req.user.userId; // lấy từ token
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu postId.",
      });
    }

    // kiểm tra user có phải teacher không
    const teacher = await UserModel.findOne({
      _id: teacherId,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Chỉ giáo viên mới có quyền kiểm tra lưu bài.",
      });
    }

    // tìm xem có tồn tại record savedPost không
    const saved = await SavedPostModel.findOne({
      teacher: teacherId,
      post: postId,
    });

    res.status(200).json({
      success: true,
      isSaved: !!saved, // ép sang boolean
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const getNearbyPostsForTeacher = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1️⃣ Lấy user (giáo viên)
    const currentUser = await UserModel.findById(userId);
    if (!currentUser || currentUser.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Chỉ giáo viên mới được truy cập chức năng này.",
      });
    }

    // 2️⃣ Lấy province từ user
    const { province } = currentUser;

    // 3️⃣ Tìm bài viết cùng province, đã duyệt
    const posts = await PostModel.find({
      province,
      status: "approved",
    })
      .populate({
        path: "createdBy",
        select: "middleName name _id role",
      })
      .sort({ createdAt: -1 });

    // 4️⃣ Chuẩn hóa dữ liệu (để frontend xài đúng PostCard)
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      district: post.district,
      province: post.province,
      salary: post.salary,
      workingType: post.workingType,
      timeType: post.timeType,
      createdAt: post.createdAt,
      createdByName: `${post.createdBy?.middleName || ""} ${
        post.createdBy?.name || ""
      }`.trim(),
      createdBy: post.createdBy?._id,
      status: post.status,
      rejectionReason: post.rejectionReason,
    }));

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài viết gần bạn thành công.",
      data: formattedPosts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết gần giáo viên:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

/******** Báo cáo ******** */
const getUserReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    // Kiểm tra người dùng
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Chỉ lọc theo trạng thái
    const filter = {};
    if (status) filter.status = status;

    const reports = await ReportModel.find(filter)
      .populate("reporterId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const createReport = async (req, res) => {
  try {
    const { reason, type, reportedEmail } = req.body;
    const userId = req.user.userId;

    // 1️⃣ Kiểm tra người gửi báo cáo
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // 2️⃣ Kiểm tra dữ liệu đầu vào
    if (!reason || !type || !reportedEmail) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin báo cáo.",
      });
    }

    if (!["user", "post"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Loại báo cáo không hợp lệ.",
      });
    }

    // 3️⃣ Ảnh báo cáo (middleware upload đã xử lý sẵn)
    const reportImage = req.image || null;
    if (reportImage.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tải lên ít nhất 1 ảnh báo cáo.",
      });
    }

    // 4️⃣ Tạo mới báo cáo
    const newReport = await ReportModel.create({
      reporterId: userId,
      type,
      reportedEmail: reportedEmail.trim().toLowerCase(),
      reason,
      reportPic: reportImage,
    });

    return res.status(201).json({
      success: true,
      message: "Gửi báo cáo thành công.",
      report: newReport,
    });
  } catch (error) {
    console.error("Lỗi khi tạo báo cáo:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  getLogged,
  getUserById,
  updateAvatar,
  changePassword,
  updateInfo,
  getFavoriteTeachers,
  addFavoriteTeacher,
  removeFavoriteTeacher,
  checkFavoriteTeacher,
  getNearbyTeachers,
  getSavePosts,
  addSavePost,
  removeSavePost,
  checkSavePost,
  getNearbyPostsForTeacher,
  getUserReports,
  createReport,
};
