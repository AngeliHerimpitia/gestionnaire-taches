class TaskManager {
    constructor() {
        this.currentDate = new Date();
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        this.loadTheme();
        this.init();
    }

    init() {
        this.updateDate();
        this.render();
        document.getElementById("addTaskBtn").onclick = () => this.addTask();
        document.getElementById("prevDay").onclick = () => this.changeDay(-1);
        document.getElementById("nextDay").onclick = () => this.changeDay(1);
        document.getElementById("themeToggle").onclick = () => this.toggleTheme();
        document.getElementById("clearAllTasks").onclick = () => this.clearAll();
    }

    getKey() {
        return this.currentDate.toISOString().split("T")[0];
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        this.render();
    }

    addTask() {
        const input = document.getElementById("taskInput");
        if (!input.value.trim()) return;

        const key = this.getKey();
        if (!this.tasks[key]) this.tasks[key] = [];

        this.tasks[key].push({
            id: Date.now(),
            text: input.value,
            done: false
        });

        input.value = "";
        this.save();
    }

    render() {
        const list = document.getElementById("tasksList");
        const key = this.getKey();
        list.innerHTML = "";

        if (!this.tasks[key] || this.tasks[key].length === 0) {
            list.innerHTML = "<p style='text-align:center'>Aucune tâche</p>";
            document.getElementById("clearAllTasks").style.display = "none";
        } else {
            document.getElementById("clearAllTasks").style.display = "block";
            this.tasks[key].forEach(task => {
                const div = document.createElement("div");
                div.className = "task-item" + (task.done ? " completed" : "");
                div.innerHTML = `
                    <input type="checkbox" ${task.done ? "checked" : ""}>
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn">🗑</button>
                `;
                div.querySelector("input").onclick = () => {
                    task.done = !task.done;
                    this.save();
                };
                div.querySelector(".delete-btn").onclick = () => {
                    this.tasks[key] = this.tasks[key].filter(t => t.id !== task.id);
                    this.save();
                };
                list.appendChild(div);
            });
        }

        this.updateStats();
    }

    updateStats() {
        let total = 0, done = 0;
        Object.values(this.tasks).forEach(day =>
            day.forEach(t => {
                total++;
                if (t.done) done++;
            })
        );
        document.getElementById("totalTasks").textContent = total;
        document.getElementById("completedTasks").textContent = done;
    }

    changeDay(n) {
        this.currentDate.setDate(this.currentDate.getDate() + n);
        this.updateDate();
        this.render();
    }

    updateDate() {
        document.getElementById("currentDate").textContent =
            this.currentDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long"
            });
    }

    clearAll() {
        delete this.tasks[this.getKey()];
        this.save();
    }

    toggleTheme() {
        document.body.classList.toggle("dark");
        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    }

    loadTheme() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => new TaskManager());

