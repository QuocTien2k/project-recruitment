const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

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

module.exports = {
  signupUser,
};
