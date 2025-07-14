import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    global: false,
    teacher: false,
    user: false,
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.global = action.payload;
    },
    setTeacherLoading: (state, action) => {
      state.teacher = action.payload;
    },
    setUserLoading: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { setGlobalLoading, setTeacherLoading, setUserLoading } =
  loadingSlice.actions;

export default loadingSlice.reducer;
