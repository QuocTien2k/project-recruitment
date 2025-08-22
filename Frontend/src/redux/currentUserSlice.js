import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    user: null, //thông tin user ban đầu
    allChats: [], // Danh sách toàn bộ cuộc trò chuyện
    userList: [], // Danh sách user chat
    selectedChat: null, // Cuộc trò chuyện đang được chọn để hiển thị
    notifications: [], //thông báo
    // __debugBump: 0, // 👈 debug
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
    updateUserStatusInChats: (state, action) => {
      const { userId, isActive } = action.payload;
      let touched = false;

      state.allChats = state.allChats.map((chat) => {
        let memberTouched = false;
        const members =
          chat.members?.map((m) => {
            if (m._id === userId) {
              memberTouched = true;
              return { ...m, isActive: !!isActive };
            }
            return m;
          }) || [];
        if (memberTouched) touched = true;
        return { ...chat, members };
      });

      // if (touched) state.__debugBump += 1;
    },

    removeUserFromChats: (state, action) => {
      const userId = action.payload;
      state.allChats = state.allChats
        .map((chat) => ({
          ...chat,
          members: chat.members.filter((m) => m._id !== userId),
        }))
        .filter((chat) =>
          // giữ lại chat nếu còn ít nhất 2 thành viên (hoặc ít nhất 1 khác currentUser)
          chat.members.some((m) => m._id !== state.user?._id)
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
  updateUserStatusInChats,
  removeUserFromChats,
} = currentUserSlice.actions;

export default currentUserSlice.reducer;
