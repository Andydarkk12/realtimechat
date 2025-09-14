// src/services/socket.js
import { io } from "socket.io-client";
import { store } from "../store/store";
import { setAuth, setUserId } from "../features/authSlice";
import { setChats, setChatMembers } from "../features/chatsSlice";
import { setMessages, addMessage } from "../features/messagesSlice";
import { setFoundUsers } from "../features/uiSlice";

//###############################################

//#  component for interaction with the server  #

//###############################################


let socket = null;

export const initSocket = () => {
  socket = io("http://localhost:8080");

  //  \/ Subscribe to events \/
  socket.on("authTrue", (data) => {
    store.dispatch(setAuth(true));
    store.dispatch(setChats(data.chats));
    store.dispatch(setUserId(data.userId));
  });

  socket.on("registerTrue", (data) => {
    store.dispatch(setAuth(true));
    store.dispatch(setUserId(data.userId));
  });

  socket.on("authFalse", () => {
    alert(`Incorrect login or password`);
  });

  socket.on("registerFalse", () => {
    alert("There is already a user with this email!");
  });

  socket.on("messanges", (messages) => {
    store.dispatch(setMessages(messages));
  });

  socket.on("newMessage", (message) => {
    const choosedChat = store.getState().chats.choosedChat;
    if (message.chat_id === choosedChat) {
      store.dispatch(addMessage(message));
    }
  });

  socket.on("foundUsers", (users) => {
    store.dispatch(setFoundUsers(users));
  });

  socket.on("fetchMembers", (users) => {
    store.dispatch(setChatMembers(users));
  });

  socket.on("updateChats", (chats) => {
    store.dispatch(setChats(chats));
  });

  return socket;
};

export const getSocket = () => socket;

//   \/ emit-functions \/

export const selectChat = (chatId) => {
  socket.emit("chatSelected", chatId);
};

export const sendMessage = (content, chat_id, userId) => {
  socket.emit("sendMessage", { content, chat_id, userId });
};

export const findUser = (username) => {
  socket.emit("findUser", username);
};

export const createChat = (userId, addedUsers, chatName, imgUrl) => {
  socket.emit("createChat", { currentUser: userId, addedUsers, chatName, imgUrl });
};

export const register = (login, password) => {
  socket.emit("register", { login, password });
};

export const auth = (login, password) => {
  socket.emit("auth", { login, password });
};

export const getMembers = (choosedChat) => {
  socket.emit("getMembers", choosedChat);
};

export const kickUser = (choosedChat, userId) => {
  socket.emit("kickUser", { choosedChat, userId });
};

export const changeChatName = (id, name, userId) => {
  socket.emit("changeChatName", { id, name, userId });
};

export const changeChatImage = (id, image, userId) => {
  socket.emit("changeChatImage", { id, image, userId });
};
