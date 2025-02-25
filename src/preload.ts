import { contextBridge, ipcRenderer } from 'electron';

interface ElectronAPI {
  getTodos: () => Promise<any>;
  addTodo: (task: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
}

contextBridge.exposeInMainWorld('electron', {
  getTodos: (): Promise<any> => ipcRenderer.invoke('get-todos'),
  addTodo: (task: string): Promise<void> => ipcRenderer.invoke('add-todo', task),
  toggleTodo: (id: number): Promise<void> => ipcRenderer.invoke('toggle-todo', id),
});