const multer = require("multer");

// Set up multer storage configuration
// cb: callback function, null means no error
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/"); // Thư mục tạm để chứa file trước khi upload lên Cloudinary
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ tên gốc
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
