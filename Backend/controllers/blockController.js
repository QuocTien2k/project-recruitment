const BlockModel = require("../models/Block");

// Chặn user
const blockUser = async (req, res) => {
  try {
    const blockedBy = req.user.userId; // lấy từ authMiddleware
    const { blockedUser } = req.body;

    if (!blockedUser) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin user cần chặn", success: false });
    }

    if (blockedBy === blockedUser) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự chặn chính mình", success: false });
    }

    // Tạo block (unique index sẽ ngăn chặn duplicate)
    const block = new BlockModel({ blockedBy, blockedUser });
    await block.save();

    res
      .status(201)
      .json({ message: "Chặn người dùng thành công!", success: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bạn đã chặn người dùng này trước đó!",
        success: false,
      });
    }
    res
      .status(500)
      .json({ message: "Chặn thất bại: " + error.message, success: false });
  }
};

// Mở chặn
const unblockUser = async (req, res) => {
  try {
    const blockedBy = req.user.userId;
    const { blockedUser } = req.body;

    if (!blockedUser) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin user cần mở chặn", success: false });
    }

    const result = await BlockModel.findOneAndDelete({
      blockedBy,
      blockedUser,
    });
    if (!result) {
      return res
        .status(404)
        .json({ message: "Bạn chưa chặn user này!", success: false });
    }

    // Lấy lại danh sách đã chặn sau khi xóa
    const blockedList = await BlockModel.find({ blockedBy }).populate(
      "blockedUser",
      "name email"
    );

    res.status(200).json({
      message: "Đã mở chặn thành công!",
      success: true,
      data: result.blockedUser, // FE có thể cập nhật ngay danh sách mới
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Mở chặn thất bại: " + error.message, success: false });
  }
};

// Lấy danh sách user mình đã chặn + filter
const getBlockedUsers = async (req, res) => {
  try {
    const blockedBy = req.user.userId;
    const { name, email } = req.query;

    // Tạo điều kiện match cho populate
    let match = {};
    if (name) {
      const nameRegex = new RegExp(name, "i"); // không phân biệt hoa/thường
      match.$or = [{ name: nameRegex }, { middleName: nameRegex }];
    }
    if (email) {
      match.email = new RegExp(email, "i");
    }

    const blockedList = await BlockModel.find({ blockedBy }).populate({
      path: "blockedUser",
      select: "middleName name email profilePic",
      match,
    });

    // lọc bỏ record nào populate không match (null)
    const filteredList = blockedList.filter((item) => item.blockedUser);

    res.status(200).json({
      message: "Danh sách user đã chặn",
      success: true,
      data: filteredList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy danh sách: " + error.message,
      success: false,
    });
  }
};

//kiểm tra trạng thái chặn
const getBlockStatus = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { receiverId } = req.params;

    const block = await BlockModel.findOne({
      blockedBy: currentUserId,
      blockedUser: receiverId,
    });

    res.json({
      success: true,
      isBlocked: !!block,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể kiểm tra trạng thái chặn: " + error.message,
    });
  }
};

module.exports = { blockUser, unblockUser, getBlockedUsers, getBlockStatus };
