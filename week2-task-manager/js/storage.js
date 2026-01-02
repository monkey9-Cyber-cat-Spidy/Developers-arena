// Handles localStorage persistence for tasks and theme

(function (global) {
    const TASKS_KEY = "week2-task-manager-tasks";
    const THEME_KEY = "week2-task-manager-theme";

    function loadTasks() {
        try {
            const raw = localStorage.getItem(TASKS_KEY);
            if (!raw) return [];
            const tasks = JSON.parse(raw);
            if (!Array.isArray(tasks)) return [];
            return tasks;
        } catch (e) {
            console.error("Failed to load tasks", e);
            return [];
        }
    }

    function saveTasks(tasks) {
        try {
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error("Failed to save tasks", e);
        }
    }

    function clearCompleted(tasks) {
        return tasks.filter(function (t) { return !t.completed; });
    }

    function loadTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || "light";
        } catch (e) {
            return "light";
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
    }

    global.Storage = {
        loadTasks: loadTasks,
        saveTasks: saveTasks,
        clearCompleted: clearCompleted,
        loadTheme: loadTheme,
        saveTheme: saveTheme
    };
})(window);
