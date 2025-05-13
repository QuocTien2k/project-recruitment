const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
//xac thực token
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Không có token",
        success: false,
      });
    }

    // Lấy token sau "Bearer "
    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // { userId: user._id }

    // Sau khi verify, lưu toàn bộ thông tin decode
    req.user = decodedToken;

    //kiểm tra user
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(401).send({
        message: "Không tìm thấy người dùng!",
        success: false,
      });
    }

    //kiểm tra trạng thái tài khoản
    if (user.isActive === false) {
      return res.status(401).send({
        message: "Tài khoản đã bị khóa!",
        success: false,
      });
    }

    next(); // Tiếp tục xử lý request
  } catch (error) {
    // Kiểm tra lỗi từ jwt.verify
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        message: "Token hết hạn! Vui lòng đăng nhập lại",
        success: false,
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({
        message: "Token không hợp lệ",
        success: false,
      });
    }

    res.status(401).send({
      message: "Lỗi token: " + error.message,
      success: false,
    });
  }
};

// Middleware kiểm tra vai trò cụ thể
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Không có quyền admin", success: false });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Không có quyền teacher", success: false });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res
      .status(403)
      .json({ message: "Không có quyền user", success: false });
  }
  next();
};

module.exports = { protect, isAdmin, isTeacher, isUser };
