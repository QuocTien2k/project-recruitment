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

module.exports = {
  createPost,
};
