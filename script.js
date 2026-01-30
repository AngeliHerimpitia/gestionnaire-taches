const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

const datePicker = document.getElementById("datePicker");
const prevDay = document.getElementById("prevDay");
const nextDay = document.getElementById("nextDay");

const totalTasksEl = document.getElementById("totalTasks");
const doneTasksEl = document.getElementById("doneTasks");
const totalTimeEl = document.getElementById("totalTime");
const doneTimeEl = document.getElementById("doneTime");

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let currentDate = new Date();

/* ---------- DATE ---------- */
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

datePicker.value = formatDate(currentDate);

prevDay.onclick = () => {
  currentDate.setDate(currentDate.getDate() - 1);
  datePicker.value = formatDate(currentDate);
  render();
};

nextDay.onclick = () => {
  currentDate.setDate(currentDate.getDate() + 1);
  datePicker.value = formatDate(currentDate);
  render();
};

datePicker.onchange = () => {
  currentDate = new Date(datePicker.value);
  render();
};

/* ---------- TASKS ---------- */
addBtn.onclick = () => {
  if (!taskInput.value.trim()) return;

  const dateKey = formatDate(currentDate);
  if (!tasks[dateKey]) tasks[dateKey] = [];

  tasks[dateKey].push({
    text: taskInput.value,
    time: parseInt(timeInput.value) || 0,
    done: false
  });

  taskInput.value = "";
  timeInput.value = "";
  save();
  render();
};

function render() {
  list.innerHTML = "";
  const dateKey = formatDate(currentDate);
  const dayTasks = tasks[dateKey] || [];

  dayTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "completed" : "";

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${task.time} min</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleDone('${dateKey}', ${index})">✅</button>
        <button onclick="editTask('${dateKey}', ${index})">✏️</button>
        <button onclick="deleteTask('${dateKey}', ${index})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateStats(dayTasks);
}

/* ---------- ACTIONS ---------- */
function toggleDone(date, index) {
  tasks[date][index].done = !tasks[date][index].done;
  save();
  render();
}

function editTask(date, index) {
  const newText = prompt("Modifier la tâche :", tasks[date][index].text);
  if (newText) {
    tasks[date][index].text = newText;
    save();
    render();
  }
}

function deleteTask(date, index) {
  tasks[date].splice(index, 1);
  save();
  render();
}

/* ---------- STATS ---------- */
function updateStats(dayTasks) {
  let total = dayTasks.length;
  let done = 0;
  let totalTime = 0;
  let doneTime = 0;

  dayTasks.forEach(t => {
    totalTime += t.time;
    if (t.done) {
      done++;
      doneTime += t.time;
    }
  });

  totalTasksEl.textContent = total;
  doneTasksEl.textContent = done;
  totalTimeEl.textContent = totalTime;
  doneTimeEl.textContent = doneTime;
}

/* ---------- STORAGE ---------- */
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

render();
