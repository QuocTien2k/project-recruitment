const express = require("express");
const app = express();
const cors = require("cors");

// Cho phép CORS với frontend (React)
app.use(
  cors({
    origin: "http://localhost:5173", // Chỉ cho phép React frontend
    credentials: true, // Nếu có gửi cookies hoặc token
  })
);
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Export app để server.js dùng
module.exports = app;
