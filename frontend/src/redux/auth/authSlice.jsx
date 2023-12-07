import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
};

// create the authSlice for authentication purpose  and make reducer function to save the token in the store so that all rtk query can be call
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  registerFailure,
  registerSuccess,
  logoutSuccess,
} = authSlice.actions;
export default authSlice.reducer;
