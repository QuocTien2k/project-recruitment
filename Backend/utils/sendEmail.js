const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  //create a transforter
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

//define email option
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"Tuyển Dụng Gia Sư Phát Tiến" <no-reply@phattiengiasu.com>', // tên và địa chỉ hiển thị
    to,
    subject,
    html,
  };
  //console.log("GMAIL_USER ở file app.js: ", process.env.GMAIL_USER);
  //console.log("Sending mail to:", to);
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
