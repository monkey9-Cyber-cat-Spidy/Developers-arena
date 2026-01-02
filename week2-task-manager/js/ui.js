// Pure UI helpers that render tasks and update stats

(function (global) {
    var Utils = global.Utils;

    function renderTasks(tasks, options) {
        options = options || {};
        var listEl = Utils.$("#taskList");
        var emptyState = Utils.$("#emptyState");

        if (!listEl) return;

        if (!tasks.length) {
            listEl.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        var html = tasks
            .map(function (task) {
                var text = Utils.escapeHtml(task.text || "");
                var priority = task.priority || "medium";
                var priorityClass = "badge-priority-" + priority;
                var due = Utils.formatDate(task.dueDate);
                var overdue = Utils.isOverdue(task.dueDate);

                return (
                    '<li class="task-item' + (task.completed ? " completed" : "") + '" ' +
                    'data-id="' + task.id + '" draggable="true">' +
                        '<div class="task-main">' +
                            '<input type="checkbox" class="checkbox task-toggle" ' + (task.completed ? "checked" : "") + ' />' +
                            '<span class="task-text ' + (task.completed ? "completed-text" : "") + '" tabindex="0">' + text + "</span>" +
                        "</div>" +
                        '<div class="task-meta">' +
                            '<span class="badge ' + priorityClass + '">Priority: ' + priority + "</span>" +
                            (task.dueDate
                                ? '<span class="badge ' + (overdue ? "badge-overdue" : "badge-due") + '">Due: ' + due + "</span>"
                                : "") +
                        "</div>" +
                        '<button class="delete-btn" aria-label="Delete task">&times;</button>' +
                    "</li>"
                );
            })
            .join("");

        listEl.innerHTML = html;
    }

    function updateStats(tasks) {
        var total = tasks.length;
        var completed = tasks.filter(function (t) { return t.completed; }).length;
        var active = total - completed;

        var totalEl = Utils.$("#totalTasks");
        var completedEl = Utils.$("#completedTasks");
        var activeEl = Utils.$("#activeTasks");

        if (totalEl) totalEl.textContent = total;
        if (completedEl) completedEl.textContent = completed;
        if (activeEl) activeEl.textContent = active;
    }

    function setTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        var btn = Utils.$("#themeToggle");
        if (!btn) return;
        if (theme === "dark") {
            btn.textContent = "☀️ Light mode";
        } else {
            btn.textContent = "🌙 Dark mode";
        }
    }

    global.UI = {
        renderTasks: renderTasks,
        updateStats: updateStats,
        setTheme: setTheme
    };
})(window);
