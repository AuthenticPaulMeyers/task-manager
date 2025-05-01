// tasks.js

const API_BASE_URL = 'https://your-backend-url.com/api'; // same base URL

// Fetch all tasks
async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const tasks = await response.json();
    if (response.ok) {
      renderTasks(tasks); // call a function to display tasks
    } else {
      alert('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Fetch tasks error:', error);
  }
}

// Create a new task
async function createTask(title, description, reminderTime) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, description, reminder_time: reminderTime })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Task created successfully!');
      fetchTasks(); // refresh task list
    } else {
      alert(data.message || 'Failed to create task');
    }
  } catch (error) {
    console.error('Create task error:', error);
  }
}

// Example of rendering tasks to the dashboard
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'p-4 mb-2 bg-white shadow rounded'; // Tailwind classes
    taskItem.innerHTML = `
      <h2 class="text-lg font-bold">${task.title}</h2>
      <p class="text-gray-600">${task.description || ''}</p>
      <p class="text-sm text-gray-400">Reminder: ${new Date(task.reminder_time).toLocaleString()}</p>
    `;
    taskList.appendChild(taskItem);
  });
}
