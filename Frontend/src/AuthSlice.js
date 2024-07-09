// AuthSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  token: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
