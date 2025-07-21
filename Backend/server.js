const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const expressApp = require("./app");
const http = require("http");
const dbConfig = require("./config/dbConfig");
const socketIo = require("socket.io");

const server = http.createServer(expressApp); // Tạo HTTP server từ app
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;

// --- SOCKET LOGIC ---
const onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connected with socket id:", socket.id);

  socket.on("join-room", (userId) => {
    console.log("User tham gia:", userId);
    socket.join(userId);
  });

  socket.on("send-message", (message) => {
    console.log("Tin nhắn mới:", message);
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  socket.on("user-login", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    socket.emit("online-users", onlineUsers);
  });

  socket.on("user-offline", (userId) => {
    const index = onlineUsers.indexOf(userId);
    if (index !== -1) onlineUsers.splice(index, 1);
    io.emit("online-users-updated", onlineUsers);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
