"use client";
import { createSlice } from '@reduxjs/toolkit';

const saveUserToLocalStorage = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const initialState = {
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      saveUserToLocalStorage(action.payload);
    },
    clearUser(state) {
      state.user = null;
      saveUserToLocalStorage(null);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});
export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
