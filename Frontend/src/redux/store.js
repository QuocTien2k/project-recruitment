import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@/redux/currentUserSlice";

const store = configureStore({
  reducer: { currentUser: currentUserReducer },
});
export default store;
