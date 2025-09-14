// ###############################################
// # Component for interaction with the server  #
// ###############################################
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setUserId } from "../features/authSlice";
import { setChats, setChatMembers } from "../features/chatsSlice";
import { setMessages } from "../features/messagesSlice";
import { setFoundUsers } from "../features/uiSlice";

export const useSocket = () => {
  function isNumber(val) {
    return val === +val;
}
  const dispatch = useDispatch();

  //redux
  const choosedChat = useSelector((state) => state.chats.choosedChat);
  const addedUsers = useSelector((state) => state.ui.addedUsers);
  const userId = useSelector((state) => state.auth.userId);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    // listen
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
      alert("There is already a user with this email!");
    });

    socket.current.on("messanges", (messanges) => {
      dispatch(setMessages(messanges));
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
  }, [choosedChat]);

  // emits
  const sendMessage = (content, chat_id) => {
    socket.current.emit("sendMessage", { content, chat_id, userId });
  };

  const findUser = (username) => {
    socket.current.emit("findUser", username);
  };

  const createChatFunc = (chatName, imgUrl) => {
    socket.current.emit("createChat", {
      currentUser: userId,
      addedUsers,
      imgUrl,
      chatName,
    });
  };

  const register = (login, password) => {
    socket.current.emit("register", { login, password });
  };

  const auth = (login, password) => {
    socket.current.emit("auth", { login, password });
  };

  const getMembers = (chatId) => {
    socket.current.emit("getMembers", chatId);
  };

  const kickUser = (kickUserId) => {
    socket.current.emit("kickUser", { choosedChat, userId: kickUserId });
  };

  const changeChatName = (id, name) => {
    socket.current.emit("changeChatName", { id, name, userId });
  };

  const changeChatImage = (id, image) => {
    socket.current.emit("changeChatImage", { id, image, userId });
  };
  const getObjectOfChat = (id, array) => {
    return array.find(chat => chat.chat_id === id);
  };
  useEffect(() => {
  if (isNumber(choosedChat)) {
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
    getObjectOfChat
  };
};
export default useSocket;