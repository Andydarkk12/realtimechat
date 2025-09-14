import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import chatsReducer from "./features/chatsSlice";
import messagesReducer from "./features/messagesSlice";
import uiReducer from "./features/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    messages: messagesReducer,
    ui: uiReducer,
  },
});
export default store;