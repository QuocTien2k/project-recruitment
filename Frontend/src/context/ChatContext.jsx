import { createNewChat, getAllChats } from "@/apiCalls/chat";
import { setAllChats, setSelectedChat } from "@/redux/currentUserSlice";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // const socket = io("http://localhost:5000"); // Dùng sau khi bật socket
  const dispatch = useDispatch();
  const { user, allChats } = useSelector((state) => state.currentUser);
  const [onlineUser, setOnlineUser] = useState([]);

  // Kết nối socket sau này (đã note sẵn)
  // useEffect(() => {
  //   if (user) {
  //     socket.emit("join-room", user._id);
  //     socket.emit("user-login", user._id);

  //     socket.on("online-users", setOnlineUser);
  //     socket.on("online-users-updated", setOnlineUser);

  //     return () => {
  //       socket.off("online-users");
  //       socket.off("online-users-updated");
  //     };
  //   }
  // }, [user]);

  // Tự động gọi danh sách chat khi login
  useEffect(() => {
    if (user?._id) {
      fetchAllChats();
    }
  }, [user]);

  const fetchAllChats = async () => {
    try {
      const res = await getAllChats();
      if (res?.success) {
        dispatch(setAllChats(res.data));
      }
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Không thể lấy danh sách chat!");
    }
  };

  //tạo chat
  const startNewChat = async (targetUserId) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để bắt đầu trò chuyện!");
      return null;
    }

    const members = [user._id, targetUserId];
    console.log("🔵 Đang gửi members lên server:", members);

    try {
      const res = await createNewChat([user._id, targetUserId]);
      if (res?.success) {
        const newChat = res.data;
        const exists = allChats.some((chat) => chat._id === newChat._id);
        if (!exists) {
          dispatch(setAllChats([...allChats, newChat]));
        }
        dispatch(setSelectedChat(newChat));
        return newChat;
      }
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Không thể tạo chat mới!");
      return null;
    }
  };

  //mở chat
  const openChat = async (selectedUserId) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để trò chuyện!");
      return;
    }

    if (user._id === selectedUserId) {
      toast.error("Không thể trò chuyện với chính mình!");
      return;
    }

    //kiểm tra tồn tại giữa user và teacher
    const existingChat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === user._id) &&
        chat.members.some((m) => m._id === selectedUserId)
    );

    if (existingChat) {
      const otherUser = existingChat.members.find(
        (m) => m._id === selectedUserId
      );
      //trạng thái hoạt động
      if (otherUser && otherUser.isActive === false) {
        toast.error("Tài khoản này đã bị khóa, không thể trò chuyện.");
        return;
      }
      dispatch(setSelectedChat(existingChat));
    } else {
      await startNewChat(selectedUserId);
    }

    //console.log("Đã set selectedChat: ", selectedUserId);
  };

  //lấy tin nhắn
  const getLastMessage = (targetUserId, targetUserName) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(targetUserId)
    );

    if (!chat || !chat.lastMessage) return "";

    const isSender = chat.lastMessage.sender === user._id;
    const prefix = isSender ? "Bạn: " : `Từ ${targetUserName}: `;

    const content = chat.lastMessage.text?.trim();
    return content
      ? prefix + content.slice(0, 20)
      : prefix + "[Không có nội dung]";
  };

  //số tin chưa đọc
  const getUnreadMessageCount = (targetUserId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(targetUserId)
    );
    if (!chat) return 0;
    if (chat.lastMessage?.sender !== user._id) {
      return chat.unreadMessageCount || 0;
    }
    return 0;
  };

  return (
    <ChatContext.Provider
      value={{
        // socket,
        onlineUser,
        fetchAllChats,
        startNewChat,
        openChat,
        getLastMessage,
        getUnreadMessageCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook
export const useChatContext = () => useContext(ChatContext);
