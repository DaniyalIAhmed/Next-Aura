"use client";
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  property: null,  // Store only one property
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    // Action to set a single property
    setProperty(state, action) {
      state.property = action.payload;  // Set the property data
    },

    // Action to delete the property (set it to null)
    deleteProperty(state) {
      state.property = null;  // Remove the property from the state
    },
  },
});

// Export the actions to be used in components
export const { setProperty, deleteProperty } = propertySlice.actions;

// Export the reducer to be used in the store
export default propertySlice.reducer;
