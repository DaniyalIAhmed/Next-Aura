"use client";
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = searchSlice.actions;
export default searchSlice.reducer;
