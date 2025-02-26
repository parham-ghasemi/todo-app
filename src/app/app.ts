document.getElementById('minimize')?.addEventListener('click', () => {
  window.electron.minimizeWindow();
});

document.getElementById('maximize')?.addEventListener('click', () => {
  window.electron.maximizeWindow();
});

document.getElementById('close')?.addEventListener('click', () => {
  window.electron.closeWindow();
});



const tasksList = document.getElementById('tasks-list') as HTMLUListElement;

// Function to render tasks in the list
const renderTasks = async () => {
  try {
    const todos = await window.electron.getTodos();
    tasksList.innerHTML = ''; // Clear current tasks
    todos.forEach((task: { id: number; task: string; completed: boolean }) => {
      const taskItem = document.createElement('li');
      const taskText = document.createElement('div');
      taskText.classList.add('task-content')
      taskItem.classList.add('text-font');
      taskText.innerHTML = `<p>${task.task}</p>`; // Set the task text

      // If the task is completed, add the completion line
      if (task.completed) {
        const line = document.createElement('div');
        line.classList.add('complete-line'); // Corrected class name
        taskText.classList.add('completed'); // Add completed class for strike-through
        taskText.appendChild(line); // Append the line element
      }

      // Create a delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trashcan-icon"><path d="M3 6h18M19 6l-1 14H6L5 6M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M10 11h4M12 6h0"></path></svg>`
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from triggering task completion toggle
        deleteTask(task.id, taskItem);
      });

      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteBtn); // Append delete button to the task

      taskItem.addEventListener('click', () => toggleTaskCompletion(task.id, taskText));

      tasksList.appendChild(taskItem);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

document.addEventListener('DOMContentLoaded', renderTasks);

// Function to toggle the completion of a task
const toggleTaskCompletion = async (taskId: number, taskElement: HTMLDivElement) => {
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

// Function to delete a task
const deleteTask = async (taskId: number, taskElement: HTMLLIElement) => {
  try {
    await window.electron.deleteTodo(taskId); // Call the Electron function to delete the task
    taskElement.remove(); // Remove the task from the DOM
  } catch (error) {
    console.error('Error deleting task:', error);
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


