const ChatModel = require("../models/Chat");
const MessageModel = require("../models/Message");

// Tạo tin nhắn mới
const createNewMessage = async (req, res) => {
  try {
    const sender = req.user.userId; // Lấy userId từ middleware authMiddleware
    const { chatId, text } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chatId || !sender || !text) {
      return res.status(400).send({
        message: "Thiếu thông tin bắt buộc!",
        success: false,
      });
    }

    // 1. Lưu tin nhắn vào collection messages
    const newMessage = new MessageModel({ chatId, sender, text });
    const savedMessage = await newMessage.save();

    // 2. Cập nhật tin nhắn cuối cùng & tăng số tin chưa đọc
    const currentChat = await ChatModel.findOneAndUpdate(
      { _id: chatId },
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessageCount: 1 }, // Tăng số tin nhắn chưa đọc
      },
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    res.status(201).send({
      message: "Tạo tin nhắn thành công!",
      success: true,
      data: currentChat,
    });
  } catch (error) {
    res.status(400).send({
      message: "Tạo tin nhắn thất bại!" + error.message,
      success: false,
    });
  }
};

module.exports = {
  createNewMessage,
};
