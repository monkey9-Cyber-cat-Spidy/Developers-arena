// Main application logic for the Interactive Task Manager

(function (global) {
    var Utils = global.Utils;
    var Storage = global.Storage;
    var UI = global.UI;

    var state = {
        tasks: [],
        filter: "all", // all | active | completed
        search: ""
    };

    var dom = {};
    var dragState = { draggingId: null };

    function initDomRefs() {
        dom.form = Utils.$("#taskForm");
        dom.taskInput = Utils.$("#taskInput");
        dom.prioritySelect = Utils.$("#prioritySelect");
        dom.dueDateInput = Utils.$("#dueDateInput");
        dom.formError = Utils.$("#formError");
        dom.taskList = Utils.$("#taskList");
        dom.searchInput = Utils.$("#searchInput");
        dom.filterButtons = Utils.$all(".filters .chip");
        dom.clearCompletedBtn = Utils.$("#clearCompletedBtn");
        dom.backupBtn = Utils.$("#backupBtn");
        dom.restoreBtn = Utils.$("#restoreBtn");
        dom.themeToggle = Utils.$("#themeToggle");
    }

    function normalizeTask(raw) {
        return {
            id: raw.id || Utils.createId(),
            text: (raw.text || "").toString(),
            completed: !!raw.completed,
            createdAt: raw.createdAt || new Date().toISOString(),
            priority: raw.priority || "medium",
            dueDate: raw.dueDate || "",
            order: typeof raw.order === "number" ? raw.order : Date.now()
        };
    }

    function loadInitialData() {
        var stored = Storage.loadTasks();
        state.tasks = stored.map(normalizeTask);
        state.tasks.sort(function (a, b) { return a.order - b.order; });
        var theme = Storage.loadTheme();
        UI.setTheme(theme);
    }

    function getVisibleTasks() {
        return state.tasks.filter(function (task) {
            if (state.filter === "active" && task.completed) return false;
            if (state.filter === "completed" && !task.completed) return false;

            if (state.search) {
                var text = task.text.toLowerCase();
                var q = state.search.toLowerCase();
                if (text.indexOf(q) === -1) return false;
            }
            return true;
        });
    }

    function render() {
        UI.renderTasks(getVisibleTasks(), { filter: state.filter });
        UI.updateStats(state.tasks);
    }

    function showFormError(msg) {
        if (dom.formError) dom.formError.textContent = msg || "";
        if (dom.taskInput) dom.taskInput.classList.add("input-error");
    }

    function clearFormError() {
        if (dom.formError) dom.formError.textContent = "";
        if (dom.taskInput) dom.taskInput.classList.remove("input-error");
    }

    function handleAddTask(e) {
        e.preventDefault();
        if (!dom.taskInput) return;

        var text = dom.taskInput.value.trim();
        if (!text) {
            showFormError("Task cannot be empty.");
            return;
        }
        if (text.length > 150) {
            showFormError("Keep task text under 150 characters.");
            return;
        }

        clearFormError();

        var task = {
            id: Utils.createId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: dom.prioritySelect ? dom.prioritySelect.value : "medium",
            dueDate: dom.dueDateInput ? dom.dueDateInput.value : "",
            order: Date.now()
        };

        state.tasks.push(task);
        Storage.saveTasks(state.tasks);
        dom.taskInput.value = "";
        if (dom.dueDateInput) dom.dueDateInput.value = "";
        render();
    }

    function findTaskIndexFromEventTarget(target) {
        var li = target.closest(".task-item");
        if (!li) return -1;
        var id = li.getAttribute("data-id");
        return state.tasks.findIndex(function (t) { return t.id === id; });
    }

    function handleTaskListClick(e) {
        var target = e.target;
        if (target.classList.contains("task-toggle")) {
            var idx = findTaskIndexFromEventTarget(target);
            if (idx === -1) return;
            state.tasks[idx].completed = !state.tasks[idx].completed;
            Storage.saveTasks(state.tasks);
            render();
            return;
        }

        if (target.classList.contains("delete-btn")) {
            var index = findTaskIndexFromEventTarget(target);
            if (index === -1) return;
            state.tasks.splice(index, 1);
            Storage.saveTasks(state.tasks);
            render();
            return;
        }
    }

    function startInlineEdit(spanEl) {
        var index = findTaskIndexFromEventTarget(spanEl);
        if (index === -1) return;
        var task = state.tasks[index];

        var input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.className = "input";
        input.style.margin = "0";

        function finish(save) {
            spanEl.parentNode.replaceChild(spanEl, input);
            if (save) {
                var newText = input.value.trim();
                if (newText) {
                    task.text = newText;
                    Storage.saveTasks(state.tasks);
                    render();
                }
            }
        }

        input.addEventListener("blur", function () { finish(true); });
        input.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter") {
                finish(true);
            } else if (ev.key === "Escape") {
                finish(false);
            }
        });

        spanEl.parentNode.replaceChild(input, spanEl);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }

    function handleTaskListDblClick(e) {
        var target = e.target;
        if (target.classList.contains("task-text")) {
            startInlineEdit(target);
        }
    }

    // Drag and drop ordering
    function handleDragStart(e) {
        var li = e.target.closest(".task-item");
        if (!li) return;
        dragState.draggingId = li.getAttribute("data-id");
        li.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(e) {
        e.preventDefault();
        var li = e.target.closest(".task-item");
        if (!li) return;
        $clearDragOver();
        li.classList.add("drag-over");
        e.dataTransfer.dropEffect = "move";
    }

    function handleDrop(e) {
        e.preventDefault();
        var targetLi = e.target.closest(".task-item");
        if (!targetLi || !dragState.draggingId) return;

        var sourceIdx = state.tasks.findIndex(function (t) { return t.id === dragState.draggingId; });
        var targetId = targetLi.getAttribute("data-id");
        var targetIdx = state.tasks.findIndex(function (t) { return t.id === targetId; });
        if (sourceIdx === -1 || targetIdx === -1) return;

        var moved = state.tasks.splice(sourceIdx, 1)[0];
        state.tasks.splice(targetIdx, 0, moved);
        state.tasks.forEach(function (t, i) { t.order = i; });

        Storage.saveTasks(state.tasks);
        dragState.draggingId = null;
        $clearDragOver();
        $clearDragging();
        render();
    }

    function handleDragEnd(e) {
        dragState.draggingId = null;
        $clearDragOver();
        $clearDragging();
    }

    function $clearDragOver() {
        Utils.$all(".task-item.drag-over").forEach(function (el) { el.classList.remove("drag-over"); });
    }

    function $clearDragging() {
        Utils.$all(".task-item.dragging").forEach(function (el) { el.classList.remove("dragging"); });
    }

    function handleSearchInput(e) {
        state.search = e.target.value || "";
        render();
    }

    function handleFilterClick(e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        var filter = btn.getAttribute("data-filter");
        if (!filter) return;
        state.filter = filter;

        dom.filterButtons.forEach(function (b) { b.classList.remove("chip-active"); });
        btn.classList.add("chip-active");
        render();
    }

    function handleClearCompleted() {
        state.tasks = Storage.clearCompleted(state.tasks);
        Storage.saveTasks(state.tasks);
        render();
    }

    function handleBackup() {
        var json = JSON.stringify(state.tasks, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(json).then(function () {
                alert("Backup JSON copied to clipboard.");
            }).catch(function () {
                prompt("Copy your backup JSON:", json);
            });
        } else {
            prompt("Copy your backup JSON:", json);
        }
    }

    function handleRestore() {
        var json = prompt("Paste backup JSON here:");
        if (!json) return;
        try {
            var parsed = JSON.parse(json);
            if (!Array.isArray(parsed)) throw new Error("Invalid backup format");
            state.tasks = parsed.map(normalizeTask);
            state.tasks.sort(function (a, b) { return a.order - b.order; });
            Storage.saveTasks(state.tasks);
            render();
        } catch (e) {
            alert("Could not restore backup: " + e.message);
        }
    }

    function handleThemeToggle() {
        var current = document.body.getAttribute("data-theme") || "light";
        var next = current === "light" ? "dark" : "light";
        UI.setTheme(next);
        Storage.saveTheme(next);
    }

    function handleGlobalKeydown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "/") {
            if (dom.taskInput) {
                e.preventDefault();
                dom.taskInput.focus();
            }
        }
    }

    function bindEvents() {
        if (dom.form) dom.form.addEventListener("submit", handleAddTask);
        if (dom.taskInput) dom.taskInput.addEventListener("input", clearFormError);
        if (dom.taskList) {
            dom.taskList.addEventListener("click", handleTaskListClick);
            dom.taskList.addEventListener("dblclick", handleTaskListDblClick);
            dom.taskList.addEventListener("dragstart", handleDragStart);
            dom.taskList.addEventListener("dragover", handleDragOver);
            dom.taskList.addEventListener("drop", handleDrop);
            dom.taskList.addEventListener("dragend", handleDragEnd);
        }
        if (dom.searchInput) dom.searchInput.addEventListener("input", handleSearchInput);
        if (dom.filterButtons) dom.filterButtons.forEach(function (btn) {
            btn.addEventListener("click", handleFilterClick);
        });
        if (dom.clearCompletedBtn) dom.clearCompletedBtn.addEventListener("click", handleClearCompleted);
        if (dom.backupBtn) dom.backupBtn.addEventListener("click", handleBackup);
        if (dom.restoreBtn) dom.restoreBtn.addEventListener("click", handleRestore);
        if (dom.themeToggle) dom.themeToggle.addEventListener("click", handleThemeToggle);

        document.addEventListener("keydown", handleGlobalKeydown);
    }

    function init() {
        initDomRefs();
        loadInitialData();
        bindEvents();
        render();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    global.App = { getVisibleTasks: getVisibleTasks };
})(window);
