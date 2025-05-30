const PostModel = require("../models/Post");
const ViewerModel = require("../models/Viewer");

//lấy bài viết tạo bởi user và thông tin user
const getDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate(
      "createdBy",
      "middleName name email profilePic"
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại." });
    }
    if (!post.createdBy) {
      return res
        .status(404)
        .json({ success: false, message: "Người tạo bài viết không tồn tại." });
    }

    const fullName = `${post.createdBy.middleName} ${post.createdBy.name}`;

    res.status(200).json({
      success: true,
      data: {
        ...post._doc,
        createdBy: {
          ...post.createdBy._doc,
          fullName,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//tổng số lượt xem 1 bài viết
const countViews = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "Bài viết không tồn tại." });
    }

    const totalViews = await ViewerModel.countDocuments({ postId });
    res.status(200).json({ success: true, totalViews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDetailPost,
  countViews,
};
