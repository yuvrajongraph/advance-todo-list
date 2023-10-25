import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import { authApi } from "./auth/authApi";

const store = configureStore({
  reducer: {
    users: authSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: true,
});

export default store;
