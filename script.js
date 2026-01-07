class TaskManager {
    constructor() {
        this.currentDate = new Date();
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        this.loadTheme();
        this.init();
    }

    init() {
        this.updateDate();
        this.displayTasks();
        this.updateStats();
        this.updateClearButton();

        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this.addTask(); }
        });
        document.getElementById('prevDay').onclick = () => this.changeDay(-1);
        document.getElementById('nextDay').onclick = () => this.changeDay(1);
        document.getElementById('themeToggle').onclick = () => this.toggleTheme();
        document.getElementById('clearAllTasks').onclick = () => this.clearAllTasks();
    }

    getKey() { return this.currentDate.toISOString().split('T')[0]; }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
        this.updateClearButton();
    }

    addTask() {
        const textInput = document.getElementById('taskInput');
        const timeInput = document.getElementById('timeInput');
        const text = textInput.value.trim();
        if (!text) return textInput.focus();

        const time = timeInput.value || new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
        const key = this.getKey();
        if (!this.tasks[key]) this.tasks[key] = [];

        this.tasks[key].push({id: Date.now(), text, time, completed:false});
        textInput.value = ''; timeInput.value = '';
        this.save(); this.displayTasks();
    }

    displayTasks() {
        const list = document.getElementById('tasksList');
        list.innerHTML = '';
        const key = this.getKey();
        if (!this.tasks[key] || this.tasks[key].length === 0) {
            list.innerHTML = '<p style="text-align:center;">Aucune tâche</p>'; return;
        }

        this.tasks[key].forEach(task => {
            const div = document.createElement('div');
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text" contenteditable="false">${task.text}</span>
                <span class="task-time">⏰ ${task.time}</span>
                <div class="task-actions">
                    <button class="edit-btn">✏</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;
            const textEl = div.querySelector('.task-text');
            div.querySelector('input').onclick = () => { task.completed = !task.completed; this.save(); this.displayTasks(); };
            div.querySelector('.edit-btn').onclick = () => {
                if (textEl.isContentEditable) { task.text = textEl.textContent.trim(); textEl.contentEditable = false; this.save(); } 
                else { textEl.contentEditable = true; textEl.focus(); }
            };
            div.querySelector('.delete-btn').onclick = () => { this.tasks[key] = this.tasks[key].filter(t => t.id!==task.id); if(this.tasks[key].length===0) delete this.tasks[key]; this.save(); this.displayTasks(); };

            list.appendChild(div);
        });
    }

    changeDay(n) { this.currentDate.setDate(this.currentDate.getDate() + n); this.updateDate(); this.displayTasks(); }
    updateDate() { document.getElementById('currentDate').textContent = this.currentDate.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }

    updateStats() {
        let total = 0, completed = 0;
        Object.values(this.tasks).forEach(day => day.forEach(t=>{total++; if(t.completed) completed++;}));
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
        document.getElementById('themeToggle').textContent = document.body.classList.contains('dark')?'☀️':'🌙';
    }

    loadTheme() { if(localStorage.getItem('theme')==='dark'){document.body.classList.add('dark');document.getElementById('themeToggle').textContent='☀️';} }

    updateClearButton() { document.getElementById('clearAllTasks').style.display = (this.tasks[this.getKey()] && this.tasks[this.getKey()].length>0)?'block':'none'; }
    clearAllTasks() { this.tasks[this.getKey()] = []; this.save(); this.displayTasks(); }
}

document.addEventListener('DOMContentLoaded', ()=> new TaskManager());

