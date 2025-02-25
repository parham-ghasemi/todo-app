import { app, BrowserWindow } from 'electron'
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ipcMain } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../dist/preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Open or create the SQLite database
const dbPromise = open({
  filename: './todos.db',
  driver: sqlite3.Database,
});

// Create the todos table if it doesn't exist
const createTable = async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      completed BOOLEAN
    )
  `);
};
createTable();

const addTodo = async (task: string) => {
  const db = await dbPromise;
  await db.run('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, false]);
};
const getTodos = async () => {
  const db = await dbPromise;
  const todos = await db.all('SELECT * FROM todos');
  return todos;
};
const toggleTodoCompletion = async (id: number) => {
  const db = await dbPromise;
  await db.run('UPDATE todos SET completed = NOT completed WHERE id = ?', [id]);
};

ipcMain.handle('get-todos', async () => {
  return await getTodos();
});

ipcMain.handle('add-todo', async (_, task: string) => {
  await addTodo(task);
});

ipcMain.handle('toggle-todo', async (_, id: number) => {
  await toggleTodoCompletion(id);
});