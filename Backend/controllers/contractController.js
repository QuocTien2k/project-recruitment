const ContractModel = require("../models/Contract");
const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const moment = require("moment-timezone"); // thư viện moment-timezone để xử lý giờ VN
const path = require("path");
const fontRoboto = path.join(__dirname, "../fonts/Roboto-Regular.ttf");
const PDFDocument = require("pdfkit");

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
      partyA: {
        userId: user._id,
        name: `${user.middleName} ${user.name}`,
        email: user.email,
        phone: user.phone,
        district: user.district,
        province: user.province,
      },
      partyB: null, // chưa chọn bên B
      postId: null, // hợp đồng trống
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
      postId: post._id,
      partyA: {
        userId: user._id,
        name: `${user.middleName} ${user.name}`,
        email: user.email,
        phone: user.phone,
        district: user.district,
        province: user.province,
      },
      content: "",
    });

    const savedContract = await newContract.save();

    const populatedContract = await ContractModel.findById(savedContract._id)
      .populate("postId")
      .populate("partyA.userId");

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

// //tải hợp đồng
// const downloadContract = async (req, res) => {
//   try {
//     const { contractId } = req.params;
//     const userId = req.user.userId;

//     // Lấy hợp đồng, populate postId và recipient nếu có
//     const contract = await ContractModel.findById(contractId)
//       .populate("postId")
//       .populate("recipient");

//     if (!contract) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Hợp đồng không tồn tại" });
//     }

//     // Chỉ creator mới tải được
//     if (contract.createdBy.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: "Bạn không có quyền tải hợp đồng này",
//       });
//     }

//     const doc = new PDFDocument();
//     const pageWidth = doc.page.width;
//     const margin = 72;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=contract-${contract._id}.pdf`
//     );

//     doc.registerFont("Roboto", fontRoboto);
//     doc.font("Roboto");
//     doc.pipe(res);

//     // --- Tiêu đề ---
//     doc.fontSize(20).text("HỢP ĐỒNG TUYỂN DỤNG GIA SƯ", { align: "center" });
//     doc.moveDown(1.5);

//     // --- Thông tin chung ---
//     doc.fontSize(12);
//     doc.text(`Mã hợp đồng: ${contract._id}`);
//     doc.text(
//       `Ngày tạo: ${moment(contract.createdAt)
//         .tz("Asia/Ho_Chi_Minh")
//         .format("DD/MM/YYYY")}`
//     );
//     doc.moveDown(1);

//     // --- BÊN A ---
//     doc.fontSize(14).text("BÊN A (Người tạo hợp đồng):", { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12);
//     doc.text(`Họ và tên: ${contract.createdByName}`);
//     doc.text(`Vai trò: Người sử dụng dịch vụ (phụ huynh / người tuyển dụng)`);
//     doc.moveDown(1);

//     // --- BÊN B ---
//     doc.fontSize(14).text("BÊN B (Gia sư):", { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12);

//     const drawLine = (label) => {
//       doc.text(label);
//       doc
//         .moveTo(margin, doc.y + 5)
//         .lineTo(pageWidth - margin, doc.y + 5)
//         .stroke();
//       doc.moveDown(1.2);
//     };

//     if (contract.recipient) {
//       drawLine(
//         `Họ và tên: ${contract.recipient.middleName || ""} ${
//           contract.recipient.name || ""
//         }`
//       );
//       drawLine("Ngày sinh:");
//       drawLine("CMND/CCCD:");
//       drawLine("Địa chỉ:");
//       drawLine("Số điện thoại:");
//       doc.moveDown(1.5);
//     } else {
//       // Nếu chưa có Bên B, in dòng trống
//       for (let i = 0; i < 5; i++) drawLine("");
//     }

//     // --- Bài tuyển dụng ---
//     if (contract.postId) {
//       doc.fontSize(14).text("Thông tin bài tuyển dụng:", { underline: true });
//       doc.moveDown(0.5);

//       const { title, description, salary, workingType, district, province } =
//         contract.postId;

//       doc.fontSize(12);

//       const pageContentWidth = doc.page.width - 72 * 2; // margin 72

//       const lines = [
//         { label: "Tiêu đề", value: title },
//         { label: "Mô tả", value: description },
//         { label: "Lương", value: salary },
//         { label: "Hình thức làm việc", value: workingType },
//         { label: "Địa điểm", value: `${district || ""}, ${province || ""}` },
//       ];

//       const maxCharsPerLine = 320; // giới hạn ký tự để tránh quá dài (tuỳ chỉnh)

//       lines.forEach(({ label, value }) => {
//         if (!value) return;
//         // cắt nếu quá dài
//         let textValue =
//           value.length > maxCharsPerLine
//             ? value.slice(0, maxCharsPerLine) + "..."
//             : value;

//         doc.text(`${label}: ${textValue}`, {
//           lineGap: 6,
//           width: pageContentWidth, // tự wrap nếu quá dài
//         });
//         doc.moveDown(0.5);
//       });

//       doc.moveDown(1);
//     } else {
//       // Nếu không có bài post, in phần trao đổi trống
//       doc.fontSize(14).text("Thông tin trao đổi:");
//       doc.moveDown(0.5);
//       for (let i = 0; i < 5; i++) {
//         doc
//           .moveTo(margin, doc.y + 5)
//           .lineTo(pageWidth - margin, doc.y + 5)
//           .stroke();
//         doc.moveDown(1.2);
//       }
//     }

//     // --- Điều khoản ---
//     doc.fontSize(14).text("Điều khoản thỏa thuận:", { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12);

//     const terms = [
//       "1. Bên B cam kết cung cấp dịch vụ gia sư đúng theo nội dung bài tuyển dụng và không vi phạm đạo đức nghề nghiệp.",
//       "2. Bên A có trách nhiệm thanh toán đúng hạn và đầy đủ tiền công theo mức lương đã thỏa thuận.",
//       "3. Trong trường hợp xảy ra tranh chấp, hai bên ưu tiên giải quyết bằng thương lượng. Nếu không đạt được thỏa thuận, vụ việc sẽ được đưa ra cơ quan có thẩm quyền.",
//       "4. Thời gian hợp đồng bắt đầu tính từ ngày hai bên ký tên và có hiệu lực trong suốt quá trình làm việc theo lịch đã thống nhất.",
//       "5. Hai bên cam kết cung cấp thông tin trung thực và chịu trách nhiệm pháp lý nếu có hành vi gian dối.",
//       "6. Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.",
//     ];
//     terms.forEach((line) => doc.text(line, { lineGap: 6 }));
//     doc.moveDown(1);

//     // Ngày tháng năm
//     const today = new Date();
//     doc.text(`Ngày .... tháng .... năm ${today.getFullYear()}`, {
//       align: "right",
//     });
//     doc.moveDown(1);

//     // Ký tên
//     const signatureY = doc.y;
//     doc.text("ĐẠI DIỆN BÊN A", margin, signatureY);
//     doc.text("ĐẠI DIỆN BÊN B", pageWidth - margin - 120, signatureY);
//     doc.moveDown(2);
//     const signLineY = doc.y;
//     doc.text("(Ký và ghi rõ họ tên)", margin, signLineY);
//     doc.text("(Ký và ghi rõ họ tên)", pageWidth - margin - 135, signLineY);

//     doc.end();
//   } catch (error) {
//     console.error("Lỗi khi tải hợp đồng:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Lỗi server khi tạo hợp đồng PDF" });
//   }
// };

const downloadContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.userId;

    const contract = await ContractModel.findById(contractId).populate(
      "postId"
    );

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Hợp đồng không tồn tại" });
    }

    // Chỉ bên A (người tạo) mới tải được
    if (contract.partyA.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tải hợp đồng này",
      });
    }

    const doc = new PDFDocument({ size: "A4", margin: 72 });
    const pageWidth = doc.page.width;
    const margin = doc.page.margins.left;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${contract._id}.pdf`
    );

    doc.registerFont("Roboto", fontRoboto);
    doc.font("Roboto");
    doc.pipe(res);

    // --- Logo ---
    try {
      const logoPath = path.join(__dirname, "../public/logo.png");
      doc.image(logoPath, margin, 40, { width: 60 });
      doc.moveDown(0);
    } catch (err) {
      console.warn("Logo không tìm thấy, bỏ qua hiển thị logo.");
    }

    // --- Quốc hiệu ---
    doc.fontSize(14).text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", {
      align: "center",
      lineGap: 6,
    });
    doc.fontSize(12);
    doc.text("Độc lập - Tự do - Hạnh phúc", { align: "center" });
    doc
      .moveTo(pageWidth / 2 - 80, doc.y + 5)
      .lineTo(pageWidth / 2 + 80, doc.y + 5)
      .stroke();
    doc.moveDown(2);

    // --- Tiêu đề ---
    doc.fontSize(20).text("HỢP ĐỒNG TUYỂN DỤNG GIA SƯ", { align: "center" });
    doc.moveDown(1.5);

    // --- Thông tin chung ---
    doc.fontSize(12);
    doc.text(`Mã hợp đồng: ${contract._id}`, { width: pageWidth - margin * 2 });
    doc.text(
      `Ngày tạo: ${moment(contract.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY")}`,
      { width: pageWidth - margin * 2 }
    );
    doc.moveDown(1);

    //hàm tạo dấu dots và khoảng cách
    const drawLabelWithDots = (label = "", value = "") => {
      const base = `${label}: ${value}`;
      const remainingWidth = pageWidth - margin * 2 - doc.widthOfString(base);
      const dotString = ".".repeat(
        Math.floor(remainingWidth / doc.widthOfString("."))
      );

      doc.text(base + dotString, { width: pageWidth - margin * 2 });
      doc.moveDown(0.8);
    };

    // --- BÊN A ---
    doc.fontSize(14).text("BÊN A (Người tạo hợp đồng):", {
      underline: true,
      width: pageWidth - margin * 2,
    });
    doc.moveDown(0.5);

    doc.fontSize(12);
    drawLabelWithDots("Họ và tên", contract.partyA.name || "");
    drawLabelWithDots("Email", contract.partyA.email || "");
    drawLabelWithDots("Số điện thoại", contract.partyA.phone || "");
    drawLabelWithDots(
      "Địa chỉ",
      `${contract.partyA.district || ""}, ${contract.partyA.province || ""}`
    );
    drawLabelWithDots(
      "Vai trò",
      "Người sử dụng dịch vụ (phụ huynh / người tuyển dụng)"
    );
    doc.moveDown(1);

    // --- BÊN B ---
    doc.fontSize(14).text("BÊN B (Gia sư):", {
      underline: true,
      width: pageWidth - margin * 2,
    });
    doc.moveDown(0.5);
    doc.fontSize(12);
    ["Họ và tên", "Email", "Số điện thoại", "Địa chỉ"].forEach((field) =>
      drawLabelWithDots(field)
    );

    doc.moveDown(1.2);

    // --- Bài tuyển dụng ---
    if (contract.postId) {
      // Tiêu đề
      doc.fontSize(14).text("Thông tin bài tuyển dụng:", {
        underline: true,
        width: pageWidth - margin * 2,
      });
      doc.moveDown(0.5);

      const { title, description, salary, workingType, district, province } =
        contract.postId;

      const lines = [
        { label: "Tiêu đề", value: title },
        { label: "Mô tả", value: description },
        { label: "Lương", value: salary },
        { label: "Hình thức làm việc", value: workingType },
        { label: "Địa điểm", value: `${district || ""}, ${province || ""}` },
      ];

      const pageContentWidth = pageWidth - margin * 2;

      lines.forEach(({ label, value }) => {
        if (!value) return;

        doc.fontSize(12).text(`${label}: ${value}`, {
          width: pageContentWidth,
          lineGap: 6, // tương đương khoảng 1.5 line spacing
        });

        doc.moveDown(0.5);
      });

      doc.moveDown(1);
    } else {
      doc.fontSize(14).text("Thông tin trao đổi:", {
        underline: true,
        width: pageWidth - margin * 2,
      });
      doc.moveDown(0.5);
      // Hàm vẽ dòng dots trơn
      const drawDotsOnly = (length = 80) => {
        const dots = ".".repeat(length);
        doc.text(dots, {
          width: pageWidth - margin * 2,
          align: "left",
          lineGap: 6,
        });
        doc.moveDown(0.8);
      };

      for (let i = 0; i < 5; i++) {
        drawDotsOnly(120);
      }
      doc.moveDown(0.5);
    }

    // --- Điều khoản ---
    doc.fontSize(14).text("Điều khoản thỏa thuận:", {
      underline: true,
      width: pageWidth - margin * 2,
    });
    doc.moveDown(0.5);
    doc.fontSize(12);

    const terms = [
      "1. Bên B có trách nhiệm thực hiện công việc gia sư theo đúng nội dung, yêu cầu và thời gian đã thỏa thuận trong bài tuyển dụng.",
      "2. Bên B phải đảm bảo phương pháp giảng dạy phù hợp, giữ gìn đạo đức nghề nghiệp và tôn trọng học viên trong suốt quá trình làm việc.",
      "3. Bên A có nghĩa vụ cung cấp thông tin đầy đủ, chính xác về yêu cầu tuyển dụng và tạo điều kiện thuận lợi để Bên B hoàn thành công việc.",
      "4. Bên A có trách nhiệm thanh toán đầy đủ và đúng hạn tiền công theo mức lương đã thống nhất trong hợp đồng.",
      "5. Hai bên cam kết bảo mật thông tin cá nhân và nội dung thỏa thuận, không được tiết lộ cho bên thứ ba nếu không có sự đồng ý của bên còn lại.",
      "6. Thời gian hợp đồng bắt đầu có hiệu lực kể từ ngày ký và kéo dài đến khi hoàn thành công việc hoặc có thỏa thuận chấm dứt bằng văn bản.",
      "7. Trong trường hợp một trong hai bên muốn chấm dứt hợp đồng trước thời hạn, phải thông báo bằng văn bản cho bên còn lại ít nhất 07 ngày.",
      "8. Nếu phát sinh tranh chấp, hai bên ưu tiên giải quyết bằng thương lượng. Trường hợp không đạt thỏa thuận, tranh chấp sẽ được đưa ra cơ quan có thẩm quyền giải quyết.",
      "9. Mọi hành vi gian lận, cung cấp thông tin sai lệch hoặc vi phạm cam kết trong hợp đồng đều dẫn đến việc hợp đồng bị chấm dứt ngay lập tức và bên vi phạm phải chịu trách nhiệm pháp lý.",
      "10. Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để thực hiện.",
    ];
    terms.forEach((line) =>
      doc.text(line, {
        lineGap: 6, // giãn dòng 1.5
        width: pageWidth - margin * 2,
        align: "justify", // dàn đều
      })
    );
    doc.moveDown(2);

    // --- Ngày tháng năm ---
    const today = new Date();
    doc.text(`Ngày .... tháng .... năm ${today.getFullYear()}`, {
      align: "right",
      width: pageWidth - margin * 2,
    });
    doc.moveDown(1);

    // --- Ký tên ---
    const signatureY = doc.y;
    const offsetXA = 25; //  lùi 50px
    doc.text("ĐẠI DIỆN BÊN A", margin, signatureY);
    const benBWidth = doc.widthOfString("ĐẠI DIỆN BÊN B");
    doc.text(
      "ĐẠI DIỆN BÊN B",
      pageWidth - margin - benBWidth - offsetXA,
      signatureY
    );

    doc.moveDown(2);
    const signLineY = doc.y;

    doc.text("(Ký và ghi rõ họ tên)", margin, signLineY + 30);
    const benBSignWidth = doc.widthOfString("(Ký và ghi rõ họ tên)");
    const offsetXB = 5;
    doc.text(
      "(Ký và ghi rõ họ tên)",
      pageWidth - margin - benBSignWidth - offsetXB,
      signLineY + 30
    );

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
  downloadContract,
};
