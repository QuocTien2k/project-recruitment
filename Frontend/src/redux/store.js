import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@redux/currentUserSlice";
import loadingReducer from "@redux/loadingSlice";

const store = configureStore({
  reducer: { currentUser: currentUserReducer, loading: loadingReducer },
});
export default store;
