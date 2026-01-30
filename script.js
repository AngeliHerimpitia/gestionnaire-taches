const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const toggleTheme = document.getElementById("toggleTheme");
const currentDayEl = document.getElementById("currentDay");

let currentDate = new Date();
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let theme = localStorage.getItem("theme") || "light";

/* ---------- THEME ---------- */
if (theme === "dark") document.body.classList.add("dark");

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
};

/* ---------- DATE ---------- */
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function updateDay() {
  currentDayEl.textContent = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  renderTasks();
}

document.getElementById("prevDay").onclick = () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDay();
};

document.getElementById("nextDay").onclick = () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDay();
};

/* ---------- TASKS ---------- */
addTaskBtn.onclick = () => {
  if (!taskInput.value.trim()) return;

  const dateKey = formatDate(currentDate);
  if (!tasks[dateKey]) tasks[dateKey] = [];

  tasks[dateKey].push({
    text: taskInput.value,
    time: timeInput.value || new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
    done: false
  });

  taskInput.value = "";
  timeInput.value = "";
  save();
  renderTasks();
};

function renderTasks() {
  taskList.innerHTML = "";
  const dateKey = formatDate(currentDate);
  const dayTasks = tasks[dateKey] || [];

  dayTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong><br>
        <small>⏰ ${task.time}</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleDone('${dateKey}', ${index})">✅</button>
        <button onclick="editTask('${dateKey}', ${index})">✏️</button>
        <button onclick="deleteTask('${dateKey}', ${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleDone(date, index) {
  tasks[date][index].done = !tasks[date][index].done;
  save();
  renderTasks();
}

function deleteTask(date, index) {
  tasks[date].splice(index, 1);
  save();
  renderTasks();
}

function editTask(date, index) {
  const newText = prompt("Modifier la tâche :", tasks[date][index].text);
  if (newText) {
    tasks[date][index].text = newText;
    save();
    renderTasks();
  }
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

updateDay();

