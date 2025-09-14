import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messanges: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messanges = action.payload;
    },
    addMessage: (state, action) => {
      state.messanges.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;