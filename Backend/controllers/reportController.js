const UserModel = require("../models/User");
const ReportModel = require("../models/Report.js");

const getListReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, email, type } = req.query; // filter báo cáo

    // Kiểm tra người dùng
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Điều kiện lọc cơ bản trong bảng Report
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // 1️⃣ Nếu có email → lọc theo email người bị báo cáo
    if (email) {
      filter.reportedEmail = { $regex: email, $options: "i" };
    }

    // 2️⃣ Truy vấn báo cáo
    const reports = await ReportModel.find(filter)
      .populate("reporterId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
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
    const reportImages = req.images || [];
    if (reportImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tải lên ít nhất 1 ảnh báo cáo.",
      });
    }

    // Ở đây bạn chỉ cho phép 1 ảnh → lấy reportImages[0]
    const reportPic = reportImages[0];

    // 4️⃣ Tạo mới báo cáo
    const newReport = await ReportModel.create({
      reporterId: userId,
      type,
      reportedEmail: reportedEmail.trim().toLowerCase(),
      reason,
      reportPic,
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

const handleReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNote } = req.body;

    // 1️⃣ Kiểm tra ID
    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID của báo cáo cần xử lý.",
      });
    }

    // 2️⃣ Kiểm tra trạng thái hợp lệ
    const validStatuses = ["pending", "resolved"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ.",
      });
    }

    // 3️⃣ Bắt buộc phải có adminNote nếu chuyển sang resolved
    if (status === "resolved" && (!adminNote || adminNote.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập ghi chú xử lý.",
      });
    }

    // 4️⃣ Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNote !== undefined) updateFields.adminNote = adminNote.trim();

    // 5️⃣ Cập nhật và trả về document mới
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      updateFields,
      { new: true }
    );

    // 6️⃣ Kiểm tra tồn tại
    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy báo cáo.",
      });
    }

    // 7️⃣ Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Xử lý báo cáo thành công.",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật báo cáo:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = { getListReport, createReport, handleReport };
