const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Cho phép CORS từ frontend React
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // cho phép cookie từ frontend
  })
);

// Giải mã JSON và form-urlencoded body
app.use(express.json()); // cho JSON (application/json)
app.use(express.urlencoded({ extended: true })); // cho form (application/x-www-form-urlencoded)
app.use(cookieParser());

// Routes
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const postRoute = require("./Routes/postRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const adminRoute = require("./Routes/adminRoute");
const publicRoute = require("./Routes/publicRoute");
const viewerRoute = require("./Routes/viewerRoute");
const blockRoute = require("./Routes/blockRoute");
const notificationRoute = require("./Routes/notificationRoute");
const applicationRoute = require("./Routes/applicationRoute");
const contractRoute = require("./Routes/contractRoute");
const reportRoute = require("./Routes/reportRoute");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/admin", adminRoute);
app.use("/api/public", publicRoute);
app.use("/api/view", viewerRoute);
app.use("/api/block", blockRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/application", applicationRoute);
app.use("/api/contract", contractRoute);
app.use("/api/report", reportRoute);

module.exports = app;
