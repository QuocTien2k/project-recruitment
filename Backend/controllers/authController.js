const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");

// Đăng ký role là user
const signupUser = async (req, res) => {
  try {
    const { middleName, name, email, phone, password, district, province } =
      req.body;

    // 1. Kiểm tra thiếu trường
    if (
      !middleName ||
      !name ||
      !email ||
      !phone ||
      !password ||
      !district ||
      !province
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    // 2. Kiểm tra trùng email và phone (song song)
    const [existingEmail, existingPhone] = await Promise.all([
      UserModel.findOne({ email }),
      UserModel.findOne({ phone }),
    ]);

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được sử dụng",
      });
    }

    // 3. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user mới
    const newUser = new UserModel({
      middleName,
      name,
      email,
      phone,
      password: hashedPassword,
      district,
      province,
      role: "user",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

//Đăng ký role là teacher
const signupTeacher = async (req, res) => {
  try {
    const {
      middleName,
      name,
      email,
      phone,
      password,
      district,
      province,
      experience,
      workingType,
      timeType,
      subject,
      description,
    } = req.body;

    //1. Kiểm tra thông tin
    if (
      !middleName ||
      !name ||
      !email ||
      !phone ||
      !password ||
      !district ||
      !province ||
      !experience ||
      !workingType ||
      !timeType ||
      !subject ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const degreeFiles = req.files || [];

    //2. Kiểm tra hình ảnh
    if (degreeFiles.length === 0) {
      return res.status(400).send({
        message: "Vui lòng tải lên ít nhất 1 ảnh bằng cấp.",
        success: false,
      });
    }

    if (degreeFiles.length > 2) {
      return res.status(400).send({
        message: "Chỉ được phép upload tối đa 2 ảnh bằng cấp",
        success: false,
      });
    }

    //3. Kiểm tra email và phone (song song)
    const [existingEmail, existingPhone] = await Promise.all([
      UserModel.findOne({ email }),
      UserModel.findOne({ phone }),
    ]);

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được sử dụng",
      });
    }

    //4. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Normalize môn học
    const normalizedSubject = subject
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => /^[\p{L}\s]+$/gu.test(s));

    if (normalizedSubject.length === 0) {
      return res.status(400).send({
        message: "Môn học không hợp lệ, vui lòng chỉ nhập tên môn học.",
        success: false,
      });
    }

    // 6. Upload ảnh bằng cấp lên Cloudinary
    const degreeImageUrls = req.images;

    // 7. Tạo user mới
    const newUser = new UserModel({
      middleName,
      name,
      email,
      phone,
      password: hashedPassword,
      district,
      province,
      role: "teacher",
    });
    await newUser.save();

    // 8. Tạo giáo viên
    const newTeacher = new TeacherModel({
      userId: newUser._id,
      experience,
      workingType,
      timeType,
      subject: normalizedSubject,
      description,
      degreeImages: degreeImageUrls,
    });
    await newTeacher.save();
    return res.status(201).json({
      success: true,
      message: "Đăng ký giáo viên thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

module.exports = {
  signupUser,
  signupTeacher,
};
