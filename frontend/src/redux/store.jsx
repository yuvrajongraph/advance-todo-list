import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import todoSlice from "./todo/todoSlice";
import { authApi } from "./auth/authApi";
import { todoApi } from "./todo/todoApi";
import { appointmentApi } from "./appointment/appointmentApi";
import { userApi } from "./user/userApi";
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

// for persist the data even after reloading of the page in the rtk store
const persistConfig = {
  key: "root",
  storage,
};

// configure the slices  and rtk query in the store
const store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers({
    users: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    todos: todoSlice,
    [todoApi.reducerPath]: todoApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  })),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: true,
    }).concat(authApi.middleware, todoApi.middleware, appointmentApi.middleware, userApi.middleware),
  devTools: true,
});

const persistor = persistStore(store);
export default store;
export { persistor };
