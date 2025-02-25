// Access the methods exposed via contextBridge in preload.js
const addTodoButton = document.getElementById('add-todo');
const getTodosButton = document.getElementById('get-todos');
const toggleTodoButton = document.getElementById('toggle-todo');

// Get all todos when the button is clicked
getTodosButton?.addEventListener('click', () => {
  window.electron.getTodos().then((todos) => {
    console.log(todos); // Log todos to the console
  });
});

// Add a new todo when the button is clicked
addTodoButton?.addEventListener('click', () => {
  window.electron.addTodo('New Task').then(() => {
    console.log('New task added');
  });
});

// Toggle todo completion (example for todo with id 1)
toggleTodoButton?.addEventListener('click', () => {
  window.electron.toggleTodo(1).then(() => {
    console.log('Toggled completion for todo with ID 1');
  });
});
