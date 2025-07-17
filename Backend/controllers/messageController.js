const ChatModel = require("../models/Chat");
const MessageModel = require("../models/Message");

// Tạo tin nhắn mới
const createNewMessage = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy userId từ middleware authMiddleware
    const { chatId, text } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chatId || !userId || !text) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc!",
        success: false,
      });
    }

    // 1. Lưu tin nhắn vào collection messages
    const newMessage = new MessageModel({ chatId, userId, text });
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

    res.status(201).json({
      message: "Tạo tin nhắn thành công!",
      success: true,
      data: currentChat,
    });
  } catch (error) {
    res.status(400).json({
      message: "Tạo tin nhắn thất bại!" + error.message,
      success: false,
    });
  }
};

// cập nhật số lượng tin nhắn chưa đọc
const clearUnreadMessageCount = async (req, res) => {
  try {
    const chatId = req.body.chatId;

    //1.tin nhắn chưa đọc
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        message: "Không tìm thấy cuộc trò chuyện!",
        success: false,
      });
    }

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    //2. cập nhật tin đã đọc false -> true
    await MessageModel.updateMany({ chatId, read: false }, { read: true });

    res.status(200).json({
      message: "Đánh dấu tất cả tin nhắn là đã đọc thành công!",
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.status(400).json({
      message: "Đánh dấu tin nhắn chưa đọc thất bại!" + error.message,
      success: false,
    });
  }
};

// lấy tất cả tin nhắn trong cuộc trò chuyện của chatId
const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        message: "Thiếu chatId!",
        success: false,
      });
    }

    const allMessages = await MessageModel.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("userId", "middleName name email"); // Lấy thông tin người gửi

    res.status(200).json({
      message: "Lấy tin nhắn thành công!",
      success: true,
      data: allMessages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lấy tin nhắn thất bại! " + error.message,
      success: false,
    });
  }
};

module.exports = {
  createNewMessage,
  clearUnreadMessageCount,
  getAllMessages,
};
