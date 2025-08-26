const ChatModel = require("../models/Chat");
const MessageModel = require("../models/Message");
const BlockModel = require("../models/Block");

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

    // --- 1. Lấy thông tin chat để biết 2 thành viên ---
    const chat = await ChatModel.findById(chatId).populate("members", "_id");
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chat!", success: false });
    }

    // Xác định người nhận (receiver)
    const receiverId = chat.members.find(
      (m) => m._id.toString() !== userId.toString()
    );
    if (!receiverId) {
      return res
        .status(400)
        .json({ message: "Chat không hợp lệ!", success: false });
    }

    // --- 2. Kiểm tra block (cả 2 chiều) ---
    const isBlocked = await BlockModel.findOne({
      $or: [
        { blockedBy: userId, blockedUser: receiverId }, // mình chặn họ
        { blockedBy: receiverId, blockedUser: userId }, // họ chặn mình
      ],
    });

    if (isBlocked) {
      let msg = "Không thể gửi tin nhắn vì đã bị chặn!";

      // Nếu mình là người chặn => thông báo khác
      if (isBlocked.blockedBy.toString() === userId.toString()) {
        msg = "Bạn đã chặn người này. Không thể gửi tin nhắn!";
      }

      return res.status(403).json({
        message: msg,
        success: false,
      });
    }

    // --- 3. Lưu tin nhắn ---
    const newMessage = new MessageModel({ chatId, sender: userId, text });
    let savedMessage = await newMessage.save();

    // Populate người gửi để FE hiển thị
    savedMessage = await savedMessage.populate(
      "sender",
      "middleName name email"
    );

    // --- 4. Cập nhật chat ---
    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: savedMessage._id,
      $inc: { [`unreadCounts.${receiverId}`]: 1 }, // chỉ tăng cho receiver
    });

    // --- 5. Trả về ---
    res.status(201).json({
      message: "Tạo tin nhắn thành công!",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Tạo tin nhắn thất bại! " + error.message,
      success: false,
    });
  }
};

// cập nhật số lượng tin nhắn chưa đọc
const clearUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = req.body.chatId;

    //1.tin nhắn chưa đọc
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        message: "Không tìm thấy cuộc trò chuyện!",
        success: false,
      });
    }

    // Reset số tin chưa đọc cho user hiện tại
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $set: { [`unreadCounts.${userId}`]: 0 } },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    // Cập nhật tin nhắn read=false -> true (của user hiện tại)
    await MessageModel.updateMany(
      { chatId, read: false, sender: { $ne: userId } },
      { read: true }
    );

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
      .populate("sender", "middleName name email"); // Lấy thông tin người gửi

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
