import { Server } from "socket.io";
import bcrypt from "bcrypt";
import http from "http";
import prisma from "./prismaClient.js";

const io = new Server(8080, {
  cors: {
    origin: "*",
  },
});

const checkUser = async (data) => {
  const user = await prisma.users.findUnique({
    where: { username: data.login },
  });
  if (!user) return false;

  const match = await bcrypt.compare(data.password, user.password);
  return match ? user : false;
};

const checkUsername = async (data) => {
  const user = await prisma.users.findUnique({
    where: { username: data.login },
  });
  return user || false;
};

const returnChats = async (id) => {
  const userChats = await prisma.users_chat.findMany({
    where: { user_id: id },
    select: { chat_id: true },
  });

  const chatIds = userChats.map((chat) => chat.chat_id);
  if (chatIds.length === 0) return [];

  const chats = await prisma.chats.findMany({
    where: { chat_id: { in: chatIds } },
  });

  return chats;
};

io.on("connection", (socket) => {
  console.log("✅ Клиент подключен");

  socket.on("auth", async (data) => {
    let user = await checkUser(data);
    if (user) {
      socket.emit("authTrue", {
        chats: await returnChats(user.user_id),
        userId: user.user_id,
      });
    } else {
      socket.emit("authFalse");
    }
  });

  socket.on("register", async (data) => {
    if (await checkUsername(data)) {
      socket.emit("registerFalse");
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const result = await prisma.users.create({
        data: {
          username: data.login,
          email: "empty",
          password: hashedPassword,
          user_img_URL: "empty",
        },
      });
      socket.emit("registerTrue", { userId: result.user_id });
    }
  });

  socket.on("chatSelected", async (id) => {
    const messages = await prisma.messages.findMany({
      where: { chat_id: id },
    });
    socket.emit("messanges", messages);

    const chat = await prisma.chats.findUnique({ where: { chat_id: id } });
    socket.emit("setChatObject", chat);
  });

  socket.on("sendMessage", async (data) => {
    const timestamp = new Date().toISOString();
    await prisma.messages.create({
      data: {
        content: data.content,
        chat_id: data.chat_id,
        user_id: data.userId,
        created_at: timestamp,
      },
    });

    const messages = await prisma.messages.findMany({
      where: { chat_id: data.chat_id },
    });
    io.emit("messanges", messages);
  });

  socket.on("findUser", async (username) => {
    const users = await prisma.users.findMany({
      where: { username: { contains: username } },
      take: 10,
    });
    socket.emit("foundUsers", users);
  });

  socket.on("createChat", async (data) => {
    const { currentUser, addedUsers, imgUrl, chatName } = data;

    const chat = await prisma.chats.create({
      data: {
        chat_name: chatName,
        chat_img_URL: imgUrl,
        creator_id: currentUser,
      },
    });

    const allUsers = [...addedUsers];
    const hasCreator = addedUsers.some((u) => u.user_id === currentUser);
    if (!hasCreator) allUsers.push({ user_id: currentUser });

    for (const user of allUsers) {
      await prisma.users_chat.create({
        data: { user_id: user.user_id, chat_id: chat.chat_id },
      });
    }

    socket.emit("updateChats", await returnChats(currentUser));
  });

  socket.on("getMembers", async (chatId) => {
    const rows = await prisma.users_chat.findMany({ where: { chat_id: chatId } });
    const usersIds = rows.map((r) => r.user_id);

    const users = await prisma.users.findMany({
      where: { user_id: { in: usersIds } },
    });

    socket.emit("fetchMembers", users);
  });

  socket.on("kickUser", async (data) => {
    await prisma.users_chat.deleteMany({
      where: { chat_id: data.choosedChat, user_id: data.userId },
    });

    const rows = await prisma.users_chat.findMany({ where: { chat_id: data.choosedChat } });
    const usersIds = rows.map((r) => r.user_id);

    const users = await prisma.users.findMany({
      where: { user_id: { in: usersIds } },
    });

    socket.emit("fetchMembers", users);
  });

  socket.on("changeChatName", async (data) => {
    await prisma.chats.update({
      where: { chat_id: data.id },
      data: { chat_name: data.name },
    });
    socket.emit("updateChats", await returnChats(data.userId));
  });

  socket.on("changeChatImage", async (data) => {
    await prisma.chats.update({
      where: { chat_id: data.id },
      data: { chat_img_URL: data.image },
    });
    socket.emit("updateChats", await returnChats(data.userId));
  });

  socket.on("disconnect", () => {
    console.log("Клиент отключился");
  });
});
