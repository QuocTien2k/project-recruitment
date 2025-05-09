const express = require("express");
const app = express();
const cors = require("cors");

// Cho phép CORS với frontend (React) middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Chỉ cho phép React frontend
    credentials: true, // Nếu có gửi cookies hoặc token
  })
);
app.use(cors());

// giải mã urlencoded body từ client gửi lên (dạng form)
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Nếu là multipart/form-data (upload file), bỏ qua express.json
  if (req.is("multipart/form-data")) return next();
  express.json()(req, res, next); // giải mã JSON body từ client gửi lên => req.body
});

// Export app để server.js dùng
module.exports = app;
