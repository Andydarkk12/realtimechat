import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  choosedChat: null,
  chatMembers: [],
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setChoosedChat: (state, action) => {
      state.choosedChat = action.payload;
    },
    setChatMembers: (state, action) => {
      state.chatMembers = action.payload;
    },
  },
});

export const { setChats, setChoosedChat, setChatMembers } = chatsSlice.actions;
export default chatsSlice.reducer;
