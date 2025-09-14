import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.userId = null;
    },
  },
});

export const { setAuth, setUserId, logout } = authSlice.actions;
export default authSlice.reducer;