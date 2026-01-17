import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Initialize SQLite database
const SQL = await initSqlJs();
const dbPath = join(__dirname, 'todos.db');

let dbData;
try {
    dbData = await fs.readFile(dbPath);
} catch {
    dbData = null;
}

const db = new SQL.Database(dbData);

// Create todos table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    dueDate TEXT,
    category TEXT DEFAULT 'general',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Save database helper
async function saveDatabase() {
    const data = db.export();
    await fs.writeFile(dbPath, data);
}

// Middleware
app.use(cors());
app.use(express.json());

// GET all todos
app.get('/api/todos', (req, res) => {
    try {
        const result = db.exec('SELECT * FROM todos ORDER BY createdAt DESC');
        const todos = result[0] ? result[0].values.map(row => ({
            id: row[0],
            title: row[1],
            description: row[2],
            completed: Boolean(row[3]),
            priority: row[4],
            dueDate: row[5],
            category: row[6],
            createdAt: row[7]
        })) : [];
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
    try {
        const result = db.exec('SELECT * FROM todos WHERE id = ?', [req.params.id]);
        if (!result[0] || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        const row = result[0].values[0];
        res.json({
            id: row[0],
            title: row[1],
            description: row[2],
            completed: Boolean(row[3]),
            priority: row[4],
            dueDate: row[5],
            category: row[6],
            createdAt: row[7]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, priority, dueDate, category } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        db.run(`
      INSERT INTO todos (title, description, priority, dueDate, category)
      VALUES (?, ?, ?, ?, ?)
    `, [title, description || '', priority || 'medium', dueDate || null, category || 'general']);

        const result = db.exec('SELECT * FROM todos WHERE id = last_insert_rowid()');
        const row = result[0].values[0];

        await saveDatabase();

        res.status(201).json({
            id: row[0],
            title: row[1],
            description: row[2],
            completed: Boolean(row[3]),
            priority: row[4],
            dueDate: row[5],
            category: row[6],
            createdAt: row[7]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { title, description, completed, priority, dueDate, category } = req.body;
        const id = req.params.id;

        db.run(`
      UPDATE todos 
      SET title = ?, description = ?, completed = ?, priority = ?, dueDate = ?, category = ?
      WHERE id = ?
    `, [
            title,
            description || '',
            completed ? 1 : 0,
            priority || 'medium',
            dueDate || null,
            category || 'general',
            id
        ]);

        const result = db.exec('SELECT * FROM todos WHERE id = ?', [id]);
        if (!result[0] || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await saveDatabase();

        const row = result[0].values[0];
        res.json({
            id: row[0],
            title: row[1],
            description: row[2],
            completed: Boolean(row[3]),
            priority: row[4],
            dueDate: row[5],
            category: row[6],
            createdAt: row[7]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const checkResult = db.exec('SELECT id FROM todos WHERE id = ?', [req.params.id]);
        if (!checkResult[0] || checkResult[0].values.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        db.run('DELETE FROM todos WHERE id = ?', [req.params.id]);
        await saveDatabase();

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE all completed todos
app.delete('/api/todos/completed/clear', async (req, res) => {
    try {
        const countResult = db.exec('SELECT COUNT(*) FROM todos WHERE completed = 1');
        const count = countResult[0] ? countResult[0].values[0][0] : 0;

        db.run('DELETE FROM todos WHERE completed = 1');
        await saveDatabase();

        res.json({ message: `Deleted ${count} completed todos` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
