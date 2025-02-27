import { app, BrowserWindow } from 'electron'
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ipcMain } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the index.html from the root directory
  win.loadFile(path.join(__dirname,'..' ,'index.html'))
    .catch(err => console.error('Error loading the app:', err));

  // Listen for window control requests from renderer process
  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  });
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

const deleteTodo = async (id: number) => {
  const db = await dbPromise;
  await db.run('DELETE FROM todos WHERE id = ?', [id]);
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

ipcMain.handle('delete-todo', async (_, id: number) => {
  await deleteTodo(id);
});
