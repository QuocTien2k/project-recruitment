const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Cho phép CORS từ frontend React
const allowedOrigins = [
  "http://localhost:5173",
  "https://project-recruitment-ten.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép Postman hoặc các request không có origin
      if (!origin) return callback(null, true);

      // Chỉ cho phép những domain nằm trong danh sách
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, //cho phép cookies kèm theo
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
const blogRoute = require("./Routes/blogRoute");
const dashboardRoute = require("./Routes/dashboardRoute");

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
app.use("/api/blog", blogRoute);
app.use("/api/dashboard", dashboardRoute);

module.exports = app;
