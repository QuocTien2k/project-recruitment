const express = require("express");
const app = express();
const cors = require("cors");

// Cho phép CORS từ frontend React
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // cho phép cookie từ frontend
  })
);

// Giải mã JSON và form-urlencoded body
app.use(express.json()); // cho JSON (application/json)
app.use(express.urlencoded({ extended: true })); // cho form (application/x-www-form-urlencoded)

module.exports = app;
