const PostModel = require("../models/Post");
const ViewerModel = require("../models/Viewer");

//ghi nhận lượt xem
const view = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // Kiểm tra xem bài viết có tồn tại không
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết.",
      });
    }

    //xác thực người dùng
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng.",
      });
    }
    // Kiểm tra xem user này đã xem bài viết này trước đó chưa
    const existingView = await ViewerModel.findOne({ postId, userId });
    if (existingView) {
      return res.status(200).json({
        success: true,
        message: "Bạn đã xem bài viết này rồi.",
      });
    }

    // Nếu chưa có thì ghi nhận lượt xem
    const newView = new ViewerModel({ postId, userId });
    await newView.save();

    res.status(201).json({
      success: true,
      message: "Đã ghi nhận lượt xem.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  view,
};
