import Database from 'better-sqlite3';

const db = new Database('./database.db');
const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
const user = stmt.get(username, password);