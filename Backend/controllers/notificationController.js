const Notification = require("../models/Notification");
const UserModel = require("../models/User");

//lấy tất cả thông báo
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    // --- Kiểm tra trạng thái hoạt động ---
    const checkUser = await UserModel.findById(userId).select("isActive");
    if (!checkUser || !checkUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn có vấn đề! Vui lòng đăng nhập lại.",
      });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // mới nhất lên đầu
      .populate("post", "title"); // lấy title của bài viết nếu có

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//đánh dấu 1 thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    // --- Kiểm tra trạng thái hoạt động ---
    const checkUser = await UserModel.findById(userId).select("isActive");
    if (!checkUser || !checkUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn có vấn đề! Vui lòng đăng nhập lại.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo.",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    // --- Kiểm tra trạng thái hoạt động ---
    const checkUser = await UserModel.findById(userId).select("isActive");
    if (!checkUser || !checkUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn có vấn đề! Vui lòng đăng nhập lại.",
      });
    }

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "Tất cả thông báo đã được đánh dấu là đã đọc.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    // --- Kiểm tra trạng thái hoạt động ---
    const checkUser = await UserModel.findById(userId).select("isActive");
    if (!checkUser || !checkUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn có vấn đề! Vui lòng đăng nhập lại.",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo để xóa.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa thông báo thành công.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
