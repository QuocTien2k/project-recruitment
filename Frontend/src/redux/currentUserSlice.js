import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    user: null, //thông tin user ban đầu
    allChats: [], // Danh sách toàn bộ cuộc trò chuyện
    userList: [], // Danh sách user chat
    selectedChat: null, // Cuộc trò chuyện đang được chọn để hiển thị
    notifications: [], //thông báo
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setAllChats: (state, action) => {
      state.allChats = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotificationsByChatId: (state, action) => {
      const chatId = action.payload;
      state.notifications = state.notifications.filter(
        (msg) => msg.chatId !== chatId
      );
    },
  },
});

export const {
  setUser,
  clearUser,
  setAllChats,
  setUserList,
  setSelectedChat,
  addNotification,
  clearNotifications,
  removeNotificationsByChatId,
} = currentUserSlice.actions;

export default currentUserSlice.reducer;
