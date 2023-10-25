import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import todoSlice from "./todo/todoSlice";
import { authApi } from "./auth/authApi";
import { todoApi } from "./todo/todoApi";

const store = configureStore({
  reducer: {
    users: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    todos:todoSlice,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, todoApi.middleware),
  devTools: true,
});

export default store;
