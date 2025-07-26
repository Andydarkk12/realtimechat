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
    console.log("Получены данные авторизации:", data);
    let user = checkUser(data)
    user ? socket.emit('authTrue',{chats:returnChats(user.user_id),userId:user.user_id}) : socket.emit('authFalse')
  });

  socket.on('chatSelected',(id)=>{
    const stmt = db.prepare('SELECT * FROM messages WHERE chat_id = ?');
    const messanges = stmt.all(id);
    console.log(id)
    console.log(messanges)
    socket.emit('messanges',messanges)
  })

socket.on('sendMessage', (data) => {
  console.log(data);

  const stmt = db.prepare(`
    INSERT INTO messages (content, chat_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const timestamp = new Date().toISOString(); 

  stmt.run(data.content, data.chat_id, data.userId, timestamp);


  io.emit('newMessage', {
    content: data.content,
    chat_id: data.chat_id,
    user_id: data.userId,
    created_at: timestamp
  });
});

  socket.on("disconnect", () => {
    console.log("Клиент отключился");
  });
});