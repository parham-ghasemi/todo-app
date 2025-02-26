import { contextBridge, ipcRenderer } from 'electron';

interface ElectronAPI {
  getTodos: () => Promise<any>;
  addTodo: (task: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
}

contextBridge.exposeInMainWorld('electron', {
  getTodos: (): Promise<any> => ipcRenderer.invoke('get-todos'),
  addTodo: (task: string): Promise<void> => ipcRenderer.invoke('add-todo', task),
  deleteTodo: (id: number): Promise<void> => ipcRenderer.invoke('delete-todo', id),
  toggleTodo: (id: number): Promise<void> => ipcRenderer.invoke('toggle-todo', id),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
} as ElectronAPI);