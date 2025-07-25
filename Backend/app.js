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

// Routes
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const postRoute = require("./Routes/postRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const adminRoute = require("./Routes/adminRoute");
const publicRoute = require("./Routes/publicRoute");
const viewerRoute = require("./Routes/viewerRoute");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/admin", adminRoute);
app.use("/api/public", publicRoute);
app.use("/api/view", viewerRoute);

module.exports = app;
