const express = require("express");
const app = express();
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const postRoute = require("./Routes/postRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const adminRoute = require("./Routes/adminRoute");
const publicRoute = require("./Routes/publicRoute");
const viewerRoute = require("./Routes/viewerRoute");

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

//config socket connect
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//route
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/admin", adminRoute);
app.use("/api/public", publicRoute);
app.use("/api/view", viewerRoute);

const onlineUsers = [];
//TEST socket connection from client
io.on("connection", (socket) => {
  //console.log("Connected with socket id: ", socket.id);

  //lắng nghe client khi user đăng nhập từ browser, tham gia chat
  socket.on("join-room", (userId) => {
    //console.log("User tham gia: " + userId);
    //console.log("Vào lúc: ", new Date().toLocaleString());
    socket.join(userId);
  });

  //lắng nghe gửi tin từ client và gửi lại tin để client nhận
  socket.on("send-message", (message) => {
    //console.log("message nhận được: ", message);
    //console.log("Nhận vào lúc: ", new Date().toLocaleString());
    io.to(message.members[0]) //người gửi
      .to(message.members[1]) //người nhận
      .emit("receive-message", message);
  });

  //lắng nghe gửi tin chưa đọc từ client và gửi lại tin khi đã đọc
  socket.on("clear-unread-messages", (data) => {
    //console.log("Tin nhắn chưa đọc: ", data);
    //console.log("Nhận vào lúc: ", new Date().toLocaleString());
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  //lắng nghe client có user online, gửi lên cho client array user online
  socket.on("user-login", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    //console.log("Danh sách user online: ", onlineUsers);
    //console.log("Vào lúc: ", new Date().toLocaleString());
    socket.emit("online-users", onlineUsers);
  });

  //lắng nghe khi user loggout
  socket.on("user-offline", (userId) => {
    //onlineUsers = onlineUsers.filter((user) => user._id !== userId); dùng khi mảng chứa object phức tạp
    onlineUsers.splice(onlineUsers.indexOf(userId), 1);
    console.log(
      "Danh sách user online đã cập nhật khi user offline hoặc reload trang: ",
      onlineUsers
    );
    //console.log("Vào lúc: ", new Date().toLocaleString());
    io.emit("online-users-updated", onlineUsers);
  });
});

module.exports = app;
