import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import todoSlice from "./todo/todoSlice";
import { authApi } from "./auth/authApi";
import { todoApi } from "./todo/todoApi";
import { appointmentApi } from "./appointment/appointmentApi";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers({
    users: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    todos: todoSlice,
    [todoApi.reducerPath]: todoApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
  })),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: true,
    }).concat(authApi.middleware, todoApi.middleware,appointmentApi.middleware),
  devTools: true,
});

const persistor = persistStore(store);
export default store;
export { persistor };
