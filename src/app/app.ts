const tasksList = document.getElementById('tasks-list') as HTMLUListElement;

// Function to render tasks in the list
const renderTasks = async () => {
  try {
    const todos = await window.electron.getTodos();
    tasksList.innerHTML = ''; // Clear current tasks
    todos.forEach((task: { id: number; task: string; completed: boolean }) => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('text-font');
      taskItem.textContent = task.task; // Set the task text

      // If the task is completed, add the completion line
      if (task.completed) {
        const line = document.createElement('div');
        line.classList.add('complete-line'); // Corrected class name
        taskItem.classList.add('completed'); // Add completed class for strike-through
        taskItem.appendChild(line); // Append the line element
      }

      taskItem.addEventListener('click', () => toggleTaskCompletion(task.id, taskItem));

      tasksList.appendChild(taskItem);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

document.addEventListener('DOMContentLoaded', renderTasks);

// Function to toggle the completion of a task
const toggleTaskCompletion = async (taskId: number, taskElement: HTMLLIElement) => {
  try {
    await window.electron.toggleTodo(taskId); // Toggle the task completion in DB

    // Toggle task completion UI
    if (taskElement.classList.contains('completed')) {
      taskElement.classList.remove('completed'); // Remove completed class
      const line = taskElement.querySelector('.complete-line');
      if (line) {
        taskElement.removeChild(line); // Remove the line if it's there
      }
    } else {
      taskElement.classList.add('completed'); // Add completed class for strike-through
      const line = document.createElement('div');
      line.classList.add('complete-line'); // Add the completion line
      taskElement.appendChild(line); // Append the line element to taskItem
    }
  } catch (error) {
    console.error('Error toggling task completion:', error);
  }
};



const inputForm = document.getElementById('task-form') as HTMLFormElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;

inputForm?.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission (page reload)
  const task = taskInput.value.trim(); // Trim any extra spaces

  if (task) {
    window.electron.addTodo(task).then(() => {
      console.log('New task added');
      taskInput.value = ''; // Clear the input after adding the task
      renderTasks();
    }).catch((error) => {
      console.error('Error adding task:', error); // Handle any errors
    });
  }
});


