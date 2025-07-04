const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up multer storage configuration
// cb: callback function, null means no error
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lấy loại upload từ req.body hoặc mặc định là 'others'
    const type = req.body.type || "others"; // ví dụ: 'user', 'teacher', 'banner', 'blog'
    const uploadPath = path.join(__dirname, "..", "uploads", type);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Thư mục tạm để chứa file trước khi upload lên Cloudinary
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ tên gốc
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
