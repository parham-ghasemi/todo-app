// Declare a global variable on the `Window` object
declare global {
  interface Window {
    electron: {
      getTodos: () => Promise<any[]>;
      addTodo: (task: string) => Promise<void>;
      toggleTodo: (id: number) => Promise<void>;
      deleteTodo: (id: number) => Promise<void>;
      editTodo: (id: number, newTask: string) => Promise<void>;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

// Ensure this file is treated as a global type declaration
export { };
