import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@redux/currentUserSlice";
import loadingReducer from "@redux/loadingSlice";
import notifiByAdminReducer from "@redux/notifiByAdminSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    loading: loadingReducer,
    notifiByAdmin: notifiByAdminReducer,
  },
});
export default store;
