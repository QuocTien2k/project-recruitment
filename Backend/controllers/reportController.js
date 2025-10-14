const ReportModel = require("../models/Report.js");

const getPendingReports = async (req, res) => {
  try {
    const { email, type } = req.query;
    const filter = { status: "pending" };

    if (type) filter.type = type;
    if (email) filter.reportedEmail = { $regex: email, $options: "i" };

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

const getResolvedReports = async (req, res) => {
  try {
    const { email, type } = req.query;
    const filter = { status: "resolved" };

    if (type) filter.type = type;
    if (email) filter.reportedEmail = { $regex: email, $options: "i" };

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

module.exports = { getPendingReports, getResolvedReports, handleReport };
