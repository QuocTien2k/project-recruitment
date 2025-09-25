const ContractModel = require("../models/Contract");
const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const moment = require("moment-timezone"); // thư viện moment-timezone để xử lý giờ VN
const path = require("path");
const fontRoboto = path.join(__dirname, "../fonts/Roboto-Regular.ttf");

// hợp đồng chỉ có thông tin bên A
const createEmptyContract = async (req, res) => {
  try {
    const userId = req.user.userId; // từ middleware
    const user = await UserModel.findById(userId);
    if (!user || user.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền tạo hợp đồng." });
    }

    const newContract = new ContractModel({
      createdBy: user._id,
      createdByName: `${user.middleName} ${user.name}`,
      postId: null,
      recipient: null,
      content: "",
    });

    const savedContract = await newContract.save();

    return res.status(201).json({
      success: true,
      message: "Tạo hợp đồng trống thành công",
      data: savedContract,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

// hợp đồng có thông tin A + bài viết
const createContractWithPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user || user.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền tạo hợp đồng." });
    }

    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "Cần cung cấp postId." });
    }

    const post = await PostModel.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại." });
    if (post.status !== "approved")
      return res
        .status(400)
        .json({ success: false, message: "Bài viết chưa được duyệt." });
    if (post.createdBy.toString() !== userId)
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể tạo hợp đồng từ bài viết của mình.",
      });

    const newContract = new ContractModel({
      createdBy: user._id,
      createdByName: `${user.middleName} ${user.name}`,
      postId: post._id,
      recipient: null,
      content: "",
    });

    const savedContract = await newContract.save();

    const populatedContract = await ContractModel.findById(
      savedContract._id
    ).populate("postId");

    return res.status(201).json({
      success: true,
      message: "Tạo hợp đồng thành công (có bài viết)",
      data: populatedContract,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//hợp đồng có thông tin tất cả
const createContractWithPostAndRecipient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId, recipientId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user || user.role !== "user")
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền tạo hợp đồng." });

    if (!postId || !recipientId)
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp postId và recipientId.",
      });

    const post = await PostModel.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại." });
    if (post.status !== "approved")
      return res
        .status(400)
        .json({ success: false, message: "Bài viết chưa được duyệt." });
    if (post.createdBy.toString() !== userId)
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể tạo hợp đồng từ bài viết của mình.",
      });

    const recipient = await UserModel.findById(recipientId);
    if (!recipient || recipient.role !== "teacher")
      return res
        .status(404)
        .json({ success: false, message: "Người nhận không hợp lệ." });

    const newContract = new ContractModel({
      createdBy: user._id,
      createdByName: `${user.middleName} ${user.name}`,
      postId: post._id,
      recipient: recipient._id,
      content: "",
    });

    const savedContract = await newContract.save();

    const populatedContract = await ContractModel.findById(savedContract._id)
      .populate("postId")
      .populate("recipient");

    return res.status(201).json({
      success: true,
      message: "Tạo hợp đồng thành công (có bài viết + bên B)",
      data: populatedContract,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

//tải hợp đồng
const downloadContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.userId;

    // Lấy hợp đồng, populate postId và recipient nếu có
    const contract = await ContractModel.findById(contractId)
      .populate("postId")
      .populate("recipient");

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Hợp đồng không tồn tại" });
    }

    // Chỉ creator mới tải được
    if (contract.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tải hợp đồng này",
      });
    }

    const doc = new PDFDocument();
    const pageWidth = doc.page.width;
    const margin = 72;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${contract._id}.pdf`
    );

    doc.registerFont("Roboto", fontRoboto);
    doc.font("Roboto");
    doc.pipe(res);

    // --- Tiêu đề ---
    doc.fontSize(20).text("HỢP ĐỒNG TUYỂN DỤNG GIA SƯ", { align: "center" });
    doc.moveDown(1.5);

    // --- Thông tin chung ---
    doc.fontSize(12);
    doc.text(`Mã hợp đồng: ${contract._id}`);
    doc.text(
      `Ngày tạo: ${moment(contract.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY")}`
    );
    doc.moveDown(1);

    // --- BÊN A ---
    doc.fontSize(14).text("BÊN A (Người tạo hợp đồng):", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Họ và tên: ${contract.createdByName}`);
    doc.text(`Vai trò: Người sử dụng dịch vụ (phụ huynh / người tuyển dụng)`);
    doc.moveDown(1);

    // --- BÊN B ---
    doc.fontSize(14).text("BÊN B (Gia sư):", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);

    const drawLine = (label) => {
      doc.text(label);
      doc
        .moveTo(margin, doc.y + 5)
        .lineTo(pageWidth - margin, doc.y + 5)
        .stroke();
      doc.moveDown(1.2);
    };

    if (contract.recipient) {
      drawLine(
        `Họ và tên: ${contract.recipient.middleName || ""} ${
          contract.recipient.name || ""
        }`
      );
      drawLine("Ngày sinh:");
      drawLine("CMND/CCCD:");
      drawLine("Địa chỉ:");
      drawLine("Số điện thoại:");
      doc.moveDown(1.5);
    } else {
      // Nếu chưa có Bên B, in dòng trống
      for (let i = 0; i < 5; i++) drawLine("");
    }

    // --- Bài tuyển dụng ---
    if (contract.postId) {
      doc.fontSize(14).text("Thông tin bài tuyển dụng:", { underline: true });
      doc.moveDown(0.5);

      const { title, description, salary, workingType, district, province } =
        contract.postId;

      doc.fontSize(12);

      const pageContentWidth = doc.page.width - 72 * 2; // margin 72

      const lines = [
        { label: "Tiêu đề", value: title },
        { label: "Mô tả", value: description },
        { label: "Lương", value: salary },
        { label: "Hình thức làm việc", value: workingType },
        { label: "Địa điểm", value: `${district || ""}, ${province || ""}` },
      ];

      const maxCharsPerLine = 320; // giới hạn ký tự để tránh quá dài (tuỳ chỉnh)

      lines.forEach(({ label, value }) => {
        if (!value) return;
        // cắt nếu quá dài
        let textValue =
          value.length > maxCharsPerLine
            ? value.slice(0, maxCharsPerLine) + "..."
            : value;

        doc.text(`${label}: ${textValue}`, {
          lineGap: 6,
          width: pageContentWidth, // tự wrap nếu quá dài
        });
        doc.moveDown(0.5);
      });

      doc.moveDown(1);
    } else {
      // Nếu không có bài post, in phần trao đổi trống
      doc.fontSize(14).text("Thông tin trao đổi:");
      doc.moveDown(0.5);
      for (let i = 0; i < 5; i++) {
        doc
          .moveTo(margin, doc.y + 5)
          .lineTo(pageWidth - margin, doc.y + 5)
          .stroke();
        doc.moveDown(1.2);
      }
    }

    // --- Điều khoản ---
    doc.fontSize(14).text("Điều khoản thỏa thuận:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);

    const terms = [
      "1. Bên B cam kết cung cấp dịch vụ gia sư đúng theo nội dung bài tuyển dụng và không vi phạm đạo đức nghề nghiệp.",
      "2. Bên A có trách nhiệm thanh toán đúng hạn và đầy đủ tiền công theo mức lương đã thỏa thuận.",
      "3. Trong trường hợp xảy ra tranh chấp, hai bên ưu tiên giải quyết bằng thương lượng. Nếu không đạt được thỏa thuận, vụ việc sẽ được đưa ra cơ quan có thẩm quyền.",
      "4. Thời gian hợp đồng bắt đầu tính từ ngày hai bên ký tên và có hiệu lực trong suốt quá trình làm việc theo lịch đã thống nhất.",
      "5. Hai bên cam kết cung cấp thông tin trung thực và chịu trách nhiệm pháp lý nếu có hành vi gian dối.",
      "6. Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.",
    ];
    terms.forEach((line) => doc.text(line, { lineGap: 6 }));
    doc.moveDown(1);

    // Ngày tháng năm
    const today = new Date();
    doc.text(`Ngày .... tháng .... năm ${today.getFullYear()}`, {
      align: "right",
    });
    doc.moveDown(1);

    // Ký tên
    const signatureY = doc.y;
    doc.text("ĐẠI DIỆN BÊN A", margin, signatureY);
    doc.text("ĐẠI DIỆN BÊN B", pageWidth - margin - 120, signatureY);
    doc.moveDown(2);
    const signLineY = doc.y;
    doc.text("(Ký và ghi rõ họ tên)", margin, signLineY);
    doc.text("(Ký và ghi rõ họ tên)", pageWidth - margin - 135, signLineY);

    doc.end();
  } catch (error) {
    console.error("Lỗi khi tải hợp đồng:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo hợp đồng PDF" });
  }
};

module.exports = {
  createEmptyContract,
  createContractWithPost,
  createContractWithPostAndRecipient,
  downloadContract,
};
