const ChatModel = require("../models/Chat");
const UserModel = require("../models/User");

// Tạo mới cuộc trò chuyện
const createNewChat = async (req, res) => {
  try {
    const { members } = req.body;

    // Kiểm tra members có hợp lệ không
    if (!members || !Array.isArray(members) || members.length !== 2) {
      return res.status(400).json({
        message: "Cuộc trò chuyện tối đa 2 người!",
        success: false,
      });
    }

    // Kiểm tra xem 2 ID có trùng nhau không
    if (members[0] === members[1]) {
      return res.status(400).json({
        message: "Không thể tạo cuộc trò chuyện với chính mình!",
        success: false,
      });
    }

    // Kiểm tra trạng thái của từng user
    const users = await UserModel.find({ _id: { $in: members } });

    if (users.length !== 2) {
      return res.status(404).json({
        message: "Một hoặc cả hai tài khoản không tồn tại!",
        success: false,
      });
    }

    // Tìm tài khoản bị khóa (nếu có)
    const inactiveUser = users.find((user) => user.isActive === false);

    if (inactiveUser) {
      return res.status(403).json({
        message: `Tài khoản "${inactiveUser.name}" đã bị khóa bởi admin. Không thể trò chuyện.`,
        success: false,
      });
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    const existingChat = await ChatModel.findOne({
      members: { $all: members, $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Cuộc trò chuyện đã tồn tại!",
        success: true,
        data: existingChat,
      });
    }

    //Tạo mới chat
    const chat = new ChatModel({ members });
    const savedChat = await chat.save();
    await savedChat.populate("members");

    res.status(201).json({
      message: "Tạo chat thành công!",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Tạo chat thất bại! " + error.message,
      success: false,
    });
  }
};

// Lấy danh sách cuộc trò chuyện của người dùng
const getAllChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const allChats = await ChatModel.find({ members: userId })
      .populate("members", "middleName name email isActive") // Lấy thêm trạng thái tài khoản
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: `Lấy danh sách chat của ${userId} thành công!`,
      success: true,
      data: allChats,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lấy danh sách chat thất bại! " + error.message,
      success: false,
    });
  }
};

module.exports = {
  createNewChat,
  getAllChats,
};
