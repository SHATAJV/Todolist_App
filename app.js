// Initialize tasks array
let tasks = [];

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to display tasks sorted by due date and filter based on search
function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    // Sort tasks by due date (if available) and priority
    tasks.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.dueDate) {
            return -1;
        } else if (b.dueDate) {
            return 1;
        } else {
            // If due dates are not available, sort by priority
            const priorityOrder = { 'low': 0, 'normal': 1, 'high': 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
    });

    // Get the search input value
    const searchValue = document.getElementById('search').value.toLowerCase();

    tasks.forEach((task, index) => {
        // Check if the task matches the search criteria
        const matchesSearch = task.title.toLowerCase().includes(searchValue) ||
                             (task.dueDate && task.dueDate.includes(searchValue));

        if (matchesSearch) {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span>${task.title}</span>
                <span class="${getPriorityClass(task.priority)}">${task.priority}</span>
                <span>${task.dueDate || ''}</span>
                <span>${task.description || ''}</span>
                <input type="checkbox" ${task.completed ? 'checked' : ''} id="task-${index}">
                <button onclick="deleteTask(${index})">Delete</button>
            `;

            // Add appropriate classes based on priority and completion status
            taskItem.classList.add(getPriorityClass(task.priority));
            if (task.completed) {
                taskItem.classList.add('completed-task');
            }

            // Add event listener for marking tasks as completed
            taskItem.querySelector('input').addEventListener('change', function () {
                task.completed = !task.completed;
                displayTasks();
                saveTasksToLocalStorage();
            });

            taskList.appendChild(taskItem);
        }
    });
}

// Function to get priority class
function getPriorityClass(priority) {
    switch (priority) {
        case 'high':
            return 'high-priority';
        case 'normal':
            return 'normal-priority';
        case 'low':
            return 'low-priority';
        default:
            return '';
    }
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
    saveTasksToLocalStorage();
}

// Event listener for form submission
const addTaskForm = document.getElementById('add-task-form');
addTaskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('due-date').value;
    const description = document.getElementById('task-description').value;

    tasks.push({ title, priority, dueDate, description, completed: false });
    displayTasks();
    addTaskForm.reset();
    saveTasksToLocalStorage();
});

// Event listener for deleting completed tasks
const deleteCompletedTasksButton = document.getElementById('delete-completed-tasks');
deleteCompletedTasksButton.addEventListener('click', function () {
    tasks = tasks.filter(task => !task.completed);
    displayTasks();
    saveTasksToLocalStorage();
});

// Event listener to load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadTasksFromLocalStorage();
});

// Function to search and display tasks based on search input
function searchTasks() {
    displayTasks();
}
// Function to calculate and display progress based on date range
function calculateProgress() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Please select valid start and end dates.');
        return;
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed && isDateInRange(task.dueDate, startDate, endDate)).length;
    const notCompletedTasks = totalTasks - completedTasks;

    const completedPercentage = (completedTasks / totalTasks) * 100;
    const notCompletedPercentage = (notCompletedTasks / totalTasks) * 100;

    document.getElementById('completed-percentage').textContent = `Completed Percentage: ${completedPercentage.toFixed(2)}%`;
    document.getElementById('not-completed-percentage').textContent = `Not Completed Percentage: ${notCompletedPercentage.toFixed(2)}%`;
}

// Function to check if a date is within a specified range
function isDateInRange(dateString, startDate, endDate) {
    const taskDate = dateString ? new Date(dateString) : null;
    return taskDate && taskDate >= startDate && taskDate <= endDate;
}
