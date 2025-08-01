import { Server } from "socket.io";
import Database from 'better-sqlite3';

const db = new Database('./database.db');


const io = new Server(8080, {
  cors: {
    origin: "*",
  },
});
const checkUser = (data)=>{
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
    const user = stmt.get(data.login, data.password)
    return user || false
}
const checkUsername = (data)=>{
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
  const user = stmt.get(data.login)
  return user || false
}
const returnChats = (id) => {
  const stmt = db.prepare('SELECT chat_id FROM users_chat WHERE user_id = ?');
  const userChats = stmt.all(id);
  const chatIds = userChats.map(chat => chat.chat_id);

  if (chatIds.length === 0) return [];


  const placeholders = chatIds.map(() => '?').join(', ');
  const chatStmt = db.prepare(`SELECT * FROM chats WHERE chat_id IN (${placeholders})`);

  const chats = chatStmt.all(...chatIds);
  return chats;
};

io.on("connection", (socket) => {
  console.log("✅ Клиент подключен");

  socket.on("auth", (data) => {
    let user = checkUser(data)
    user ? socket.emit('authTrue',{chats:returnChats(user.user_id),userId:user.user_id}) : socket.emit('authFalse')
    console.log(returnChats(user.user_id))
  });

  socket.on('register',(data)=>{
    if (checkUsername(data)){
      socket.emit('registerFalse')
    }
    else{
      const stmt = db.prepare(`
        INSERT INTO users (username, email, password, user_img_URL)
        VALUES (?, ?, ?, ?)
        `)
      const result=stmt.run(data.login,"emty",data.password,"empty")
      const userId=result.lastInsertRowid
      socket.emit('registerTrue',{userId})
    }
  })

  socket.on('chatSelected',(id)=>{
    console.log(id)
    const stmt = db.prepare('SELECT * FROM messages WHERE chat_id = ?');
    const messanges = stmt.all(id);
    socket.emit('messanges',messanges)
    const chatStmt = db.prepare('SELECT * FROM chats WHERE chat_id = ?')
    const chat = chatStmt.all(id);
    console.log(messanges)
    console.log(chat)
    socket.emit('setChatObject',chat)
  })

socket.on('sendMessage', (data) => {
  console.log(data)
  const stmt = db.prepare(`
    INSERT INTO messages (content, chat_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const timestamp = new Date().toISOString(); 

  stmt.run(data.content, data.chat_id, data.userId, timestamp);


  const messagestmt = db.prepare('SELECT * FROM messages WHERE chat_id = ?');
  const messanges = messagestmt.all(data.chat_id);
  io.emit('messanges',messanges)
});

  socket.on('findUser', (username) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE username LIKE ? LIMIT 10`);
  const users = stmt.all(`%${username}%`);
  socket.emit('foundUsers', users);
});

  socket.on('createChat',(data)=>{
    const { currentUser, addedUsers, imgUrl, chatName } = data;

    // Создаём чат
    const insertChatStmt = db.prepare(`
      INSERT INTO chats (chat_name, chat_img_URL, creator_id)
      VALUES (?, ?, ?)
    `);
    const result = insertChatStmt.run(chatName, imgUrl, currentUser);

    // Получаем ID созданного чата
    const chatId = result.lastInsertRowid;

    // Подготавливаем вставку пользователей в users_chat
    const insertUserChatStmt = db.prepare(`
      INSERT INTO users_chat (user_id, chat_id)
      VALUES (?, ?)
    `);

    // Вставляем всех пользователей, включая currentUser (если его ещё нет в списке)
    const allUsers = [...addedUsers];

    const hasCreator = addedUsers.some(u => u.user_id === currentUser);
    if (!hasCreator) {
      allUsers.push({ user_id: currentUser });
    }

    for (const user of allUsers) {
      insertUserChatStmt.run(user.user_id, chatId);
    }
    socket.emit('updateChats',returnChats(currentUser))
  })

  socket.on('getMembers',(chatId)=>{
    const stmt = db.prepare(`SELECT * FROM users_chat WHERE chat_id = ?`)
    console.log(chatId)
    const rows = stmt.all(chatId)
    const usersIds = rows.map((row)=>row.user_id)
    const placeholder = usersIds.map(()=>"?").join(', ')
    const usersStmt = db.prepare(`SELECT * FROM users WHERE user_id IN(${placeholder})`)
    const users = usersStmt.all(...usersIds)
    console.log(users)
    socket.emit('fetchMembers', users)
  })

  socket.on('kickUser',(data)=>{
    const stmt = db.prepare(`
      DELETE FROM users_chat 
      WHERE chat_id = ? AND user_id = ?
    `);
    stmt.run(data.choosedChat, data.userId);
    const stmt2 = db.prepare(`SELECT * FROM users_chat WHERE chat_id = ?`)
    const rows = stmt2.all(data.choosedChat)
    const usersIds = rows.map((row)=>row.user_id)
    const placeholder = usersIds.map(()=>"?").join(', ')
    const usersStmt = db.prepare(`SELECT * FROM users WHERE user_id IN(${placeholder})`)
    const users = usersStmt.all(...usersIds)
    console.log(users)
    socket.emit('fetchMembers', users)

  })

  socket.on("disconnect", () => {
    console.log("Клиент отключился");
  });


});