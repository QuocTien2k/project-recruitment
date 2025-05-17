const PostModel = require("../models/Post");
const UserModel = require("../models/User");

//tạo bài tuyển dụng
const createPost = async () => {
  try {
    const {
      title,
      description,
      district,
      province,
      salary,
      workingType,
      timeType,
    } = req.body;

    //kiểm tra rỗng
    if (
      !title ||
      !description ||
      !district ||
      !province ||
      !salary ||
      !workingType ||
      !timeType
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    //kiểm tra user qua middleware
    const userId = req.user.userId;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Không xác thực được người dùng.",
      });
    }

    //kiểm tra user id qua collection User
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }
    const fullName = `${user.middleName} ${user.name}`.trim();

    const newPost = new PostModel({
      title,
      description,
      district,
      province,
      salary,
      workingType,
      timeType,
      createdBy: user._id,
      createdByName: fullName,
      createdByRole: user.role,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Tạo bài tuyển dụng thành công.",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Cập nhật bài tuyển dụng
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId; // lấy từ middleware xác thực

    const {
      title,
      description,
      district,
      province,
      salary,
      workingType,
      timeType,
    } = req.body;

    // Tìm bài post
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tuyển dụng.",
      });
    }

    // Kiểm tra quyền: chỉ người tạo mới được sửa
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa bài viết này.",
      });
    }

    // Cập nhật dữ liệu
    post.title = title || post.title;
    post.description = description || post.description;
    post.district = district || post.district;
    post.province = province || post.province;
    post.salary = salary || post.salary;
    post.workingType = workingType || post.workingType;
    post.timeType = timeType || post.timeType;
    post.status = "pending"; // reset lại trạng thái duyệt sau khi sửa

    await post.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật bài tuyển dụng thành công.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//lấy danh sách bài tuyển dụng của mình
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng.",
      });
    }

    const posts = await PostModel.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài tuyển dụng của bạn thành công.",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  getMyPosts,
};
