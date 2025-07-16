import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    user: null, //thông tin user ban đầu
    allChats: [], // Danh sách toàn bộ cuộc trò chuyện
    selectedChat: null, // Cuộc trò chuyện đang được chọn để hiển thị
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
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setUser, clearUser, setAllChats, setSelectedChat } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
