const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/User");
const TeacherModel = require("../models/Teacher");
const sendEmail = require("../utils/sendEmail");

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
      faculty,
      teachingLevel,
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
      !description ||
      !faculty ||
      !teachingLevel
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const degreeFiles = req.files || [];

    //2. Kiểm tra hình ảnh
    if (degreeFiles.length === 0) {
      return res.status(400).json({
        message: "Vui lòng tải lên ít nhất 1 ảnh bằng cấp.",
        success: false,
      });
    }

    if (degreeFiles.length > 2) {
      return res.status(400).json({
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
      return res.status(400).json({
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
      faculty,
      teachingLevel,
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

//Đăng nhập
const login = async (req, res) => {
  try {
    //1. Lấy thông tin từ body
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu",
      });
    }

    //2. Kiểm tra email
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        message: "Email không tồn tại hoặc chưa đăng ký",
        success: false,
      });
    }

    //3. Kiểm tra mật khẩu
    const isValid = await bcrypt.compare(req.body.password, user.password);
    //console.log("Password comparison:", isValid);
    if (!isValid) {
      return res.status(401).json({
        message: "Mật khẩu không đúng",
        success: false,
      });
    }

    //4. Kiểm tra trạng thái tài khoản
    if (user.isActive === false) {
      return res.status(401).json({
        message: "Tài khoản đã bị khóa",
        success: false,
      });
    }

    //5. Đăng nhập thành công + đăng ký token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      success: true,
      user: {
        _id: user._id,
        middleName: user.middleName,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

//quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại trong hệ thống",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const htmlContent = `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để tiếp tục:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
    `;

    await sendEmail(email, "Khôi phục mật khẩu", htmlContent);

    return res.status(200).json({
      success: true,
      message: "Đã gửi email đặt lại mật khẩu",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống: ${error.message}`,
    });
  }
};

//reset mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Thiếu token đặt lại mật khẩu",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    const user = await UserModel.findOne({ resetPasswordToken: token }).select(
      "+resetPasswordToken"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
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
  login,
  forgotPassword,
  resetPassword,
};
