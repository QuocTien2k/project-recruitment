const PostModel = require("../models/Post");
const ApplicationModel = require("../models/Application");
const Notification = require("../models/Notification");

//lấy danh sách role user
const getApplicationsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài tuyển dụng." });
    }

    if (post.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem danh sách này.",
      });
    }

    // lấy applications + thông tin user cơ bản
    const applications = await ApplicationModel.find({ post: postId })
      .populate(
        "applicant",
        "name middleName email phone profilePic district province role"
      )
      .sort({ createdAt: -1 });

    const userIds = applications.map((app) => app.applicant._id);
    const teachers = await TeacherModel.find({ userId: { $in: userIds } });

    const result = applications.map((app) => {
      const teacher = teachers.find(
        (t) => t.userId.toString() === app.applicant._id.toString()
      );
      return {
        _id: app._id,
        status: app.status,
        message: app.message,
        createdAt: app.createdAt,
        applicant: {
          user: app.applicant,
          teacher,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//nộp đơn ứng tuyển role teacher
const createApplication = async (req, res) => {
  try {
    const teacherId = req.user.userId; // từ middleware protect
    const { postId } = req.params;

    // kiểm tra post có tồn tại không
    const post = await PostModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài tuyển dụng." });
    }

    // tạo đơn ứng tuyển (nhờ unique index nên nếu apply trùng sẽ báo lỗi)
    const application = await ApplicationModel.create({
      post: postId,
      applicant: teacherId,
    });

    // tăng tổng số ứng tuyển
    await PostModel.findByIdAndUpdate(postId, {
      $inc: { applicationsCount: 1 },
    });

    // 🔔 gửi notification cho chủ post
    const notification = await Notification.create({
      user: post.createdBy,
      type: "APPLICATION_PENDING",
      post: post._id,
      message: `Có giáo viên ứng tuyển vào bài tuyển dụng "${post.title}"`,
      link: `/bai-viet/${post.slug}`,
    });

    // socket: bắn noti realtime cho chủ post
    req.app
      .get("io")
      .to(post.createdBy.toString())
      .emit("receive-notification", notification);

    res.status(201).json({
      success: true,
      message: "Ứng tuyển thành công.",
      data: application,
    });
  } catch (error) {
    // handle duplicate key error (E11000) do unique index (post + applicant)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã ứng tuyển vào bài này rồi.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//duyệt ứng tuyển role user
const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.userId; // từ middleware auth

    const application = await ApplicationModel.findById(applicationId).populate(
      "post"
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển." });
    }

    // chỉ chủ bài post mới được duyệt
    if (application.post.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền duyệt đơn này." });
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Đơn đã được xử lý trước đó." });
    }

    application.status = "accepted";
    await application.save();

    // tăng count vào post (nếu muốn log số người đã nhận)
    await PostModel.findByIdAndUpdate(application.post._id, {
      $inc: { applicationsCount: 1 },
      $addToSet: { hiredTeacher: application.applicant }, //tránh trùng lặp
    });

    // 🔔 gửi noti cho teacher
    const notification = await Notification.create({
      user: application.applicant,
      type: "APPLICATION_ACCEPTED",
      post: application.post._id,
      message: `Đơn ứng tuyển của bạn vào "${application.post.title}" đã được chấp nhận!`,
    });

    req.app
      .get("io")
      .to(application.applicant.toString())
      .emit("receive-notification", notification);

    res.status(200).json({
      success: true,
      message: "Duyệt đơn ứng tuyển thành công.",
      data: application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//từ chối ứng tuyển role user
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.userId;

    const application = await ApplicationModel.findById(applicationId).populate(
      "post"
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển." });
    }

    if (application.post.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền từ chối đơn này.",
      });
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Đơn đã được xử lý trước đó." });
    }

    application.status = "rejected";
    await application.save();

    // 🔔 gửi noti cho teacher
    const notification = await Notification.create({
      user: application.applicant,
      type: "APPLICATION_REJECTED",
      post: application.post._id,
      message: `Đơn ứng tuyển của bạn vào "${application.post.title}" đã bị từ chối.`,
    });

    req.app
      .get("io")
      .to(application.applicant.toString())
      .emit("receive-notification", notification);

    res.status(200).json({
      success: true,
      message: "Từ chối đơn ứng tuyển thành công.",
      data: application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

// kiểm tra trạng thái ứng tuyển của giáo viên cho 1 bài post
const checkApplicationStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const teacherId = req.user.userId; // lấy từ middleware auth

    // kiểm tra bài post có tồn tại không
    const post = await PostModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài tuyển dụng." });
    }

    // tìm ứng tuyển của giáo viên này
    const application = await ApplicationModel.findOne({
      post: postId,
      applicant: teacherId,
    });

    if (!application) {
      return res.status(200).json({
        success: true,
        applied: false,
        message: "Chưa ứng tuyển bài này.",
      });
    }

    res.status(200).json({
      success: true,
      applied: true,
      status: application.status, // pending | accepted | rejected
      applicationId: application._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  getApplicationsByPost,
  createApplication,
  approveApplication,
  rejectApplication,
  checkApplicationStatus,
};
