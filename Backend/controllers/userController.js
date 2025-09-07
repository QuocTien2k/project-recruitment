const UserModel = require("../models/User");
const FavoriteModel = require("../models/Favorite");
const TeacherModel = require("../models/Teacher");
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

/******** Cá nhân ******** */
const getFavoriteTeachers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, province, district } = req.query;

    //1 lấy danh sách
    const favorites = await FavoriteModel.find({ user: userId }).populate(
      "teacher"
    );

    //2 lọc
    const teacherIds = favorites.map((fav) => fav.teacher._id);

    //3
    const query = {
      _id: { $in: teacherIds },
      isActive: true,
      role: "teacher",
    };

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: "i" } },
        { middleName: { $regex: name, $options: "i" } },
      ];
    }
    if (email) query.email = { $regex: email, $options: "i" };
    if (province) query.province = province;
    if (district) query.district = district;

    const teachers = await UserModel.find(query).select(
      "-password -resetPasswordToken"
    );

    res.status(200).json({
      success: true,
      message: "Lấy danh sách yêu thích thành công.",
      data: teachers,
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

module.exports = {
  getLogged,
  getUserById,
  updateAvatar,
  changePassword,
  updateInfo,
  getFavoriteTeachers,
  addFavoriteTeacher,
  removeFavoriteTeacher,
};
