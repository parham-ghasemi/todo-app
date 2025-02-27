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
// The id of the task that is going to be edited
let editTaskId:number = 0;

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

      // Create a delete & edit button
      const taskButtons = document.createElement('div');
      const deleteButton = document.createElement('button');
      const editButton = document.createElement('button');

      taskButtons.classList.add('task-buttons')

      deleteButton.classList.add('delete-btn');
      deleteButton.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trashcan-icon"><path d="M3 6h18M19 6l-1 14H6L5 6M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M10 11h4M12 6h0"></path></svg> `
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from triggering task completion toggle
        deleteTask(task.id, taskItem);
      });

      editButton.classList.add('edit-btn');
      editButton.innerHTML = ` <svg class="edit-icon" viewBox="0 0 576 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="2"> <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/> </svg>`
      editButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from triggering task completion toggle
        // editTask(task.id, 'EDITED TASK');
        document.getElementById('edit-window-container')?.classList.remove('d-none');
        editTaskId = task.id;
      });

      taskButtons.appendChild(editButton)
      taskButtons.appendChild(deleteButton)

      taskItem.appendChild(taskText);
      taskItem.appendChild(taskButtons); // Append delete button to the task

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

// Function to delete a task
const editTask = async (taskId: number, newTask: string) => {
  try {
    await window.electron.editTodo(taskId, newTask);
    renderTasks();
  } catch (error) {
    console.error('Error editing task:', error)
  }
}


const inputForm = document.getElementById('task-form') as HTMLFormElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;

inputForm?.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission (page reload)
  const task = taskInput.value.trim(); // Trim any extra spaces

  if (task) {
    window.electron.addTodo(task).then(() => {
      taskInput.value = ''; // Clear the input after adding the task
      renderTasks();
    }).catch((error) => {
      console.error('Error adding task:', error); // Handle any errors
    });
  }
});


const editTaskForm = document.getElementById('edit-task-form') as HTMLFormElement;
const editTaskInput = document.getElementById('edit-task-input') as HTMLInputElement
const editCloseBtn = document.getElementById('edit-close') as HTMLButtonElement;

const handleClose = (e: MouseEvent) => {
  e.preventDefault();
  document.getElementById('edit-window-container')?.classList.add('d-none')
}
editCloseBtn.addEventListener('click', handleClose)

const handleEditTask = () => {
  editTask(editTaskId, editTaskInput?.value);
  document.getElementById('edit-window-container')?.classList.add('d-none')
}
editTaskForm.addEventListener('submit', handleEditTask)
