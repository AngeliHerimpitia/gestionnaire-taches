const taskInput = document.getElementById("task-input");
const taskTime = document.getElementById("task-time");
const taskPriority = document.getElementById("task-priority");
const addTaskBtn = document.getElementById("add-task-btn");
const tasksContainer = document.getElementById("tasks-container");
const themeToggle = document.getElementById("theme-toggle");

// Récupérer les tâches depuis LocalStorage ou tableau vide
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Ajouter une tâche
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const time = taskTime.value;
  const priority = taskPriority.value;

  if (!text) {
    alert("Veuillez entrer une tâche !");
    return;
  }

  tasks.push({ text, time, priority, completed: false });
  saveTasks();
  taskInput.value = "";
  taskTime.value = "";
  taskPriority.value = "faible";
});

// Supprimer une tâche
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Éditer une tâche
function editTask(index) {
  const newText = prompt("Modifier la tâche :", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasks();
  }
}

// Marquer comme complétée
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

// Sauvegarder et afficher
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Afficher les tâches
function renderTasks() {
  tasksContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    if (task.completed) taskEl.classList.add("completed");

    taskEl.innerHTML = `
      <div class="task-info">
        <span class="task-text">${task.text}</span>
        ${task.time ? `<span class="task-time">${task.time}</span>` : ""}
        <span class="task-priority ${task.priority}">${task.priority}</span>
      </div>
      <div class="task-buttons">
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

    tasksContainer.appendChild(taskEl);
  });
}

// Dark / Light mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// Charger thème et tâches
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
renderTasks();
