const express = require("express");
const app = express();
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
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

//route
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
module.exports = app;
