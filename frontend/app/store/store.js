"use client";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import searchReducer from './searchSlice';
import propertyReducer from './propertyslice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    property: propertyReducer,
  },
});

export default store;
