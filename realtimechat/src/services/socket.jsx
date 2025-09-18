// useSocket.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setUserId } from "../features/authSlice";
import { setChats, setChatMembers } from "../features/chatsSlice";
import { setMessages } from "../features/messagesSlice";
import { setFoundUsers } from "../features/uiSlice";

export const useSocket = () => {
  const dispatch = useDispatch();

  const choosedChat = useSelector((state) => state.chats.choosedChat);
  const addedUsers = useSelector((state) => state.ui.addedUsers);
  const userId = useSelector((state) => state.auth.userId);

  const socket = useRef(null);

  const isNumber = (val) => typeof val === "number" && !isNaN(val);

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    // ==================== LISTENERS ====================
    socket.current.on("authTrue", (data) => {
      dispatch(setAuth(true));
      dispatch(setChats(data.chats));
      dispatch(setUserId(data.userId));
    });

    socket.current.on("registerTrue", (data) => {
      dispatch(setAuth(true));
      dispatch(setUserId(data.userId));
    });

    socket.current.on("authFalse", () => {
      alert("Incorrect login or password");
    });

    socket.current.on("registerFalse", () => {
      alert("There is already a user with this username!");
    });

    socket.current.on("messanges", (messages) => {
      dispatch(setMessages(messages));
    });

    socket.current.on("newMessage", (message) => {
      if (message.chat_id === choosedChat) {
        dispatch(setMessages((prev) => [...prev, message]));
      }
    });

    socket.current.on("foundUsers", (users) => {
      dispatch(setFoundUsers(users));
    });

    socket.current.on("fetchMembers", (users) => {
      dispatch(setChatMembers(users));
    });

    socket.current.on("updateChats", (chats) => {
      dispatch(setChats(chats));
    });

    return () => {
      socket.current.disconnect();
    };
  }, []); 

  // ==================== EMITS ====================
  const sendMessage = (content, chat_id) => {
    if (!userId) return;
    socket.current.emit("sendMessage", { content, chat_id, userId });
  };

  const findUser = (username) => {
    if (!username || !socket.current) return;
    socket.current.emit("findUser", username);
  };

  const createChatFunc = (chatName, imgUrl) => {
    if (!userId) return;
    socket.current.emit("createChat", {
      currentUser: userId,
      addedUsers,
      imgUrl,
      chatName,
    });
  };

  const register = (login, password) => {
    if (!login || !password) return;
    socket.current.emit("register", { login, password });
  };

  const auth = (login, password) => {
    if (!login || !password) return;
    socket.current.emit("auth", { login, password });
  };

  const getMembers = (chatId) => {
    if (!chatId) return;
    socket.current.emit("getMembers", chatId);
  };

  const kickUser = (kickUserId) => {
    if (!choosedChat || !kickUserId) return;
    socket.current.emit("kickUser", { choosedChat, userId: kickUserId });
  };

  const changeChatName = (id, name) => {
    if (!id || !name) return;
    socket.current.emit("changeChatName", { id, name, userId });
  };

  const changeChatImage = (id, image) => {
    if (!id || !image) return;
    socket.current.emit("changeChatImage", { id, image, userId });
  };

  const getObjectOfChat = (id, array) => {
    return array.find((chat) => chat.chat_id === id);
  };

  // ==================== Выбор чата ====================
  useEffect(() => {
    if (isNumber(choosedChat) && socket.current) {
      socket.current.emit("chatSelected", choosedChat);
      getMembers(choosedChat);
    }
  }, [choosedChat]);

  return {
    sendMessage,
    findUser,
    createChatFunc,
    register,
    auth,
    getMembers,
    kickUser,
    changeChatName,
    changeChatImage,
    getObjectOfChat,
  };
};

export default useSocket;
