import { createSlice } from "@reduxjs/toolkit";

const notifiByAdminSlice = createSlice({
  name: "notifiByAdmin",
  initialState: {
    list: [], // danh sách thông báo từ admin
    loading: false,
    error: null,
  },
  reducers: {
    setNotifiByAdmin: (state, action) => {
      state.list = action.payload;
    },
    addNotifiByAdmin: (state, action) => {
      state.list.unshift(action.payload); // mới nhất lên đầu
    },
    markReadNotifiByAdmin: (state, action) => {
      const id = action.payload;
      state.list = state.list.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
    },
    markAllReadNotifiByAdmin: (state) => {
      state.list = state.list.map((n) => ({ ...n, isRead: true }));
    },
    deleteNotifiByAdmin: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((n) => n._id !== id);
    },
    setLoadingNotifiByAdmin: (state, action) => {
      state.loading = action.payload;
    },
    setErrorNotifiByAdmin: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNotifiByAdmin,
  addNotifiByAdmin,
  markReadNotifiByAdmin,
  markAllReadNotifiByAdmin,
  deleteNotifiByAdmin,
  setLoadingNotifiByAdmin,
  setErrorNotifiByAdmin,
} = notifiByAdminSlice.actions;

export default notifiByAdminSlice.reducer;
