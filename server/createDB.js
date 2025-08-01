import Database from 'better-sqlite3';

const db = new Database('./database.db');

db.exec(`
  PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  username TEXT,
  email TEXT,
  password TEXT,
  user_img_URL TEXT
);

CREATE TABLE IF NOT EXISTS chats (
  chat_id INTEGER PRIMARY KEY,
  chat_name TEXT,
  chat_img_URL TEXT,
  creator_id INTEGER,
  FOREIGN KEY (creator_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY,
  chat_id INTEGER,
  user_id INTEGER,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
);

CREATE TABLE IF NOT EXISTS users_chat (
  users_chat_id INTEGER PRIMARY KEY,
  user_id INTEGER,
  chat_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_users_chat_user_id ON users_chat(user_id);
CREATE INDEX IF NOT EXISTS idx_users_chat_chat_id ON users_chat(chat_id);
  `)