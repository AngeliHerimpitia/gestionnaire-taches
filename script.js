class TaskManager {
    constructor() {
        this.currentDate = new Date();
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        this.loadTheme();
        this.init();
    }

    init() {
        this.updateDate();
        this.displayTasks();
        this.updateStats();
        this.updateClearButton();

        document.getElementById("addTaskBtn").onclick = () => this.addTask();
        document.getElementById("taskInput").onkeydown = e => {
            if (e.key === "Enter") this.addTask();
        };
        document.getElementById("prevDay").onclick = () => this.changeDay(-1);
        document.getElementById("nextDay").onclick = () => this.changeDay(1);
        document.getElementById("themeToggle").onclick = () => this.toggleTheme();
        document.getElementById("clearAllTasks").onclick = () => this.clearAllTasks();
    }

    getKey() {
        return this.currentDate.toISOString().split("T")[0];
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        this.updateStats();
        this.updateClearButton();
    }

    addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const time = timeInput.value || new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
        const key = this.getKey();
        if (!this.tasks[key]) this.tasks[key] = [];

        this.tasks[key].push({ id: Date.now(), text, time, completed: false });
        taskInput.value = ""; timeInput.value = "";
        this.save(); this.displayTasks();
    }

    displayTasks() {
        tasksList.innerHTML = "";
        const key = this.getKey();

        if (!this.tasks[key]) {
            tasksList.innerHTML = "<p style='text-align:center'>Aucune tâche</p>";
            return;
        }

        this.tasks[key].forEach(task => {
            const div = document.createElement("div");
            div.className = "task-item" + (task.completed ? " completed" : "");
            div.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text">${task.text}</span>
                <span class="task-time">⏰ ${task.time}</span>
                <div class="task-actions">
                    <button class="delete-btn">🗑</button>
                </div>
            `;

            div.querySelector("input").onclick = () => {
                task.completed = !task.completed;
                this.save(); this.displayTasks();
            };

            div.querySelector(".delete-btn").onclick = () => {
                this.tasks[key] = this.tasks[key].filter(t => t.id !== task.id);
                if (this.tasks[key].length === 0) delete this.tasks[key];
                this.save(); this.displayTasks();
            };

            tasksList.appendChild(div);
        });
    }

    changeDay(n) {
        this.currentDate.setDate(this.currentDate.getDate() + n);
        this.updateDate();
        this.displayTasks();
    }

    updateDate() {
        currentDate.textContent = this.currentDate.toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    }

    updateStats() {
        let total = 0, completed = 0;
        Object.values(this.tasks).forEach(day =>
            day.forEach(t => { total++; if (t.completed) completed++; })
        );
        totalTasks.textContent = total;
        completedTasks.textContent = completed;
    }

    toggleTheme() {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
        themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    }

    loadTheme() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
            themeToggle.textContent = "☀️";
        }
    }

    updateClearButton() {
        clearAllTasks.style.display = this.tasks[this.getKey()] ? "block" : "none";
    }

    clearAllTasks() {
        delete this.tasks[this.getKey()];
        this.save();
        this.displayTasks();
    }
}

document.addEventListener("DOMContentLoaded", () => new TaskManager());
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Empêche l’auto-popup
    deferredPrompt = e;
    installBtn.style.display = "block";
});

installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
        installBtn.style.display = "none";
    }

    deferredPrompt = null;
});

