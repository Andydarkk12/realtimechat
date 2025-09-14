import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  foundUsers: [],
  addedUsers: [],
  chatCreating: false,
  editing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFoundUsers: (state, action) => {
      state.foundUsers = action.payload;
    },
    setAddedUsers: (state, action) => {
      state.addedUsers = action.payload;
    },
    addUser: (state, action) => {
      if (!state.addedUsers.some(u => u.user_id === action.payload.user_id)) {
        state.addedUsers.push(action.payload);
      }
    },
    removeUser: (state, action) => {
      state.addedUsers = state.addedUsers.filter(u => u.user_id !== action.payload);
    },
    setChatCreating: (state, action) => {
      state.chatCreating = action.payload;
    },
    setEditing: (state, action) => {
      state.editing = action.payload;
    },
  },
});

export const { setFoundUsers, setAddedUsers, setChatCreating, setEditing, addUser, removeUser } = uiSlice.actions;
export default uiSlice.reducer;