const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
//xac thực token
// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).send({
//         message: "Không có token",
//         success: false,
//       });
//     }

//     // Lấy token sau "Bearer "
//     const token = authHeader.split(" ")[1];

//     // Xác thực token
//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // { userId: user._id }

//     // Sau khi verify, lưu toàn bộ thông tin decode
//     req.user = decodedToken;

//     //kiểm tra user
//     const user = await UserModel.findById(req.user.userId);
//     if (!user) {
//       return res.status(401).send({
//         message: "Không tìm thấy người dùng!",
//         success: false,
//       });
//     }

//     //kiểm tra trạng thái tài khoản
//     if (!user.isActive) {
//       return res.status(401).send({
//         message: "Tài khoản đã bị khóa!",
//         success: false,
//       });
//     }

//     next(); // Tiếp tục xử lý request
//   } catch (error) {
//     // Kiểm tra lỗi từ jwt.verify
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).send({
//         message: "Token hết hạn! Vui lòng đăng nhập lại",
//         success: false,
//       });
//     }
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).send({
//         message: "Token không hợp lệ",
//         success: false,
//       });
//     }

//     res.status(401).send({
//       message: "Lỗi token: " + error.message,
//       success: false,
//     });
//   }
// };

const protect = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "Không có token",
        success: false,
      });
    }

    // Xác thực token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // { userId, role }
    req.user = decodedToken;

    // Kiểm tra user trong DB
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy người dùng!",
        success: false,
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(401).json({
        message: "Tài khoản đã bị khóa!",
        success: false,
      });
    }

    next(); // Tiếp tục xử lý
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token hết hạn! Vui lòng đăng nhập lại",
        success: false,
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token không hợp lệ",
        success: false,
      });
    }

    res.status(401).json({
      message: "Lỗi token: " + error.message,
      success: false,
    });
  }
};

// Middleware kiểm tra role động
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Không có quyền truy cập",
        success: false,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
