import { createNewChat, getAllChats } from "@api/chat";
import {
  addNotification,
  removeNotificationsByChatId,
  setAllChats,
  setSelectedChat,
} from "@redux/currentUserSlice";
import { addNotifiByAdmin } from "@redux/notifiByAdminSlice";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

export const ChatContext = createContext();
const socket = io(import.meta.env.VITE_API_URL); // bật socket

export const ChatProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, allChats, selectedChat } = useSelector(
    (state) => state.currentUser
  );
  const [onlineUser, setOnlineUser] = useState([]);
  const currentChatId = selectedChat?._id;
  const chatsRef = useRef(allChats);

  useEffect(() => {
    chatsRef.current = allChats;
  }, [allChats]);

  //Test socket
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Socket connected, ID:", socket.id);
  //   });

  //   return () => {
  //     socket.off("connect");
  //   };
  // }, []);

  // Kết nối socket
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("user-login", user._id);

      socket.on("online-users", setOnlineUser);
      socket.on("online-users-updated", setOnlineUser);

      return () => {
        socket.off("online-users");
        socket.off("online-users-updated");
      };
    }
  }, [user]);

  // Tự động gọi danh sách chat khi login
  useEffect(() => {
    if (user?._id) {
      fetchAllChats();
    }
  }, [user]);

  // Nhận tin nhắn realtime
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // Chặn nếu chính mình là người gửi
      if (message.sender === user._id || message.sender?._id === user._id)
        return;

      // Nếu đang mở đúng đoạn chat thì KHÔNG cần cập nhật gì
      if (message.chatId === currentChatId) {
        return; // Không cần cập nhật lastMessage hoặc unread count
      }

      const existingChats = chatsRef.current;
      const existingChatIndex = existingChats.findIndex(
        (chat) => chat._id === message.chatId
      );

      if (existingChatIndex !== -1) {
        const updatedChats = [...existingChats];
        const chatToUpdate = updatedChats[existingChatIndex];

        updatedChats[existingChatIndex] = {
          ...chatToUpdate,
          lastMessage: message,
          unreadMessageCount: (chatToUpdate.unreadMessageCount || 0) + 1,
        };

        dispatch(setAllChats(updatedChats));
      } else {
        fetchAllChats(); // nếu chưa có đoạn chat nào
      }

      //chỉ push vào notifications nếu chưa mở chat đó
      dispatch(addNotification(message));
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [user, currentChatId]);

  // Nhận thông báo realtime từ admin (duyệt bài, blog, ...)
  useEffect(() => {
    const handleReceiveNotification = (notification) => {
      // push vào redux notifiByAdmin
      //console.log("🔔 Realtime noti:", notification);
      dispatch(addNotifiByAdmin(notification));
    };

    socket.on("receive-notification", handleReceiveNotification);

    return () => {
      socket.off("receive-notification", handleReceiveNotification);
    };
  }, [dispatch]);

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

    //const members = [user._id, targetUserId];
    //console.log("🔵 Đang gửi members lên server:", members);

    try {
      const res = await createNewChat([user._id, targetUserId]);
      //console.log(res);
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
      const msg = err.response?.data?.message || "Không thể tạo chat mới!";
      toast.error(msg);
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

      //console.log("User hiện tại: ", user._id);
      //console.log("Trạng thái User được chọn: ", otherUser?.isActive);

      //trạng thái hoạt động
      if (otherUser && !otherUser.isActive) {
        toast.error("Tài khoản này đã bị khóa, không thể trò chuyện.");
        return;
      }
      dispatch(setSelectedChat(existingChat));

      // 👉 Clear số tin chưa đọc nếu có
      const updatedChats = allChats.map((chat) => {
        if (
          chat._id === existingChat._id &&
          chat.unreadMessageCount &&
          chat.lastMessage?.sender !== user._id
        ) {
          return { ...chat, unreadMessageCount: 0 };
        }
        return chat;
      });

      dispatch(setAllChats(updatedChats));
      dispatch(removeNotificationsByChatId(existingChat._id));
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
    if (chat.lastMessage?.sender !== user?._id) {
      return chat.unreadMessageCount || 0;
    }
    return 0;
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
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
