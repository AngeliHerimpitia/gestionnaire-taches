class TaskManager {
    constructor() {
        this.currentDate = new Date();
        this.tasks = this.loadTasks();
        this.initializeEventListeners();
        this.diplayTasks();
        this.updateDateDisplay();
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
    }

    getDatekey(date = this.currenDate) {
        return date.toISOString().spilt('T')[0];
    }

    initializeEventListeners() {
        // Pour Ajoyter Une tache 
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Navigation entre les jours 
        document.getElementById('prevDay').addEventListener('click', () => this.changeDay(-1));
        document.getElementById('nextDay').addEventListener('click', () => this.changeDay(1));

        // Metrre a jour status
        this.updateStats();
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (text) {
            const dateKey = this.getDatekey();

            if (!this.tasks[dateKey]) {
                this.tasks[dateKey] = [];
            }

            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks[dateKey].push(task);
            this.saveTasks();
            this.diplayTasks();
            input.value = '';
        }
    }

    deleteTask(dateKey, taskId) {
        if (this.tasks[dateKey]) {
            this.tasks[dateKey] = this.tasks[dateKey].filter(task => task.id !== taskId);
            if (this.tasks[dateKey].length === 0) {
                delete this.tasks[dateKey];
            }
            this.saveTasks();
            this.diplayTasks();
        }
    }

    toggleTask(dateKey, taskId) {
        if (this.tasks[dateKey]) {
            const task = this.tasks[dateKey].find(t => t.id === taskId);
            if(task) {
                task.completed = !task.completed;
                this.saveTasks();
                this.diplayTasks();
            }
        }
    }

    diplayTasks() {
        const dateKey = this.getDatekey();
        const tasksList = document.getElementById('tasksLisr');
        tasksList.innerHTML = '';

        if(this.tasks[dateKey] && this.tasks[dateKey].length > 0) {
            this.tasks[dateKey].forEach(task => {
                const taskElement = this.createTaskElement(task, dateKey);
                tasksList.appendChild(taskElement);
            });
        }else{
            tasksList.innerHTML= '<p style="text-align: center; color: #6c757d; padding: 20px;">Aucune tache pour ce jour </p>';
        }
    }

    createTaskElement(task, dateKey) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item $(task.completed ? 'completed' : ''}';

        const date = 
    }
}