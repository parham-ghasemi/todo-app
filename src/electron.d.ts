// Declare a global variable on the `Window` object
declare global {
  interface Window {
    electron: {
      getTodos: () => Promise<any[]>;
      addTodo: (task: string) => Promise<void>;
      toggleTodo: (id: number) => Promise<void>;
    };
  }
}

// Ensure this file is treated as a global type declaration
export {};
