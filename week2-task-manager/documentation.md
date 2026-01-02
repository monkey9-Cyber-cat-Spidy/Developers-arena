# Interactive Task Manager – Documentation

## 1. Project Overview

The Interactive Task Manager is a Week 2 JavaScript Fundamentals project that demonstrates how to build a feature-rich, single-page task management application using **vanilla JavaScript**, HTML, and CSS.

### Goals & Objectives

- Practice core JavaScript concepts: variables, functions, objects, arrays, and control structures.
- Learn **DOM manipulation**: creating, updating, and removing elements dynamically.
- Handle user interactions with **events**: `submit`, `click`, `dblclick`, `input`, keyboard shortcuts, and drag-and-drop.
- Use **array methods** to manage a collection of tasks (add, edit, delete, filter, reorder).
- Implement **data persistence** using `localStorage` so tasks and preferences survive page reloads.
- Apply **basic form validation** and error handling for better UX.
- Build a **responsive, user-friendly interface** with light/dark themes.

## 2. Setup Instructions

Follow these steps to run the project locally.

1. **Clone or copy the project folder**
   - Ensure you have the `week2-task-manager/` folder with all files.

2. **Open the project in a code editor**
   - Recommended: VS Code or any modern editor.

3. **Run the project in a browser**
   - Option A: Double-click `index.html` to open it directly in your default browser.
   - Option B: Serve the folder using a simple static server (recommended for real-world projects), for example:

     ```bash
     npx serve .
     ```

4. **Use the app**
   - Open `index.html` in a modern browser (Chrome, Edge, Firefox, etc.).
   - Start adding, editing, and managing tasks.

No build tools, frameworks, or backend are required. Everything runs in the browser.

## 3. Code Structure

Project file hierarchy:

```text
week2-task-manager/
│── index.html          # HTML layout and root containers
│── css/
│   ├── style.css       # Layout, components, and responsive styling
│   └── theme.css       # Theme variables (light/dark colors)
│── js/
│   ├── utils.js        # Small helper utilities
│   ├── storage.js      # localStorage read/write functions
│   ├── ui.js           # Pure UI rendering and theme updates
│   └── app.js          # Main application logic & event handlers
│── README.md           # High-level project overview
│── documentation.md    # Detailed technical documentation
└── .gitignore
```

### Responsibility of Each Module

- **index.html**
  - Defines the overall structure (form, task list, filters, stats bar, buttons).
  - Includes script tags to load `utils.js`, `storage.js`, `ui.js`, and `app.js`.

- **css/theme.css**
  - Declares CSS custom properties (`--color-bg`, `--color-text`, `--color-accent`, etc.).
  - Provides values for both **light** and **dark** themes using `body[data-theme]`.

- **css/style.css**
  - Global resets and typography.
  - Layout for header, main content grid, and cards.
  - Styles for form inputs, buttons, filters, badges, stats, and task list.
  - Responsive adjustments with media queries.

- **js/utils.js**
  - DOM helper functions `Utils.$` and `Utils.$all`.
  - `Utils.createId()` to generate unique task IDs.
  - `Utils.escapeHtml()` to avoid XSS when rendering text.
  - Date helpers: `formatDate()` and `isOverdue()`.

- **js/storage.js**
  - Encapsulates all `localStorage` access using keys:
    - `week2-task-manager-tasks` for the task array.
    - `week2-task-manager-theme` for the light/dark theme preference.
  - Functions: `loadTasks()`, `saveTasks(tasks)`, `clearCompleted(tasks)`, `loadTheme()`, `saveTheme(theme)`.

- **js/ui.js**
  - `UI.renderTasks(tasks)` builds `<li>` elements and injects them into `#taskList`.
  - `UI.updateStats(tasks)` updates total, active, and completed counts.
  - `UI.setTheme(theme)` updates `data-theme` on `<body>` and button label.
  - Contains **no state**; it only renders what it receives.

- **js/app.js**
  - Central state: `state.tasks`, `state.filter`, `state.search`.
  - Initialization: loads tasks & theme from `Storage`, sets up event listeners, and performs the first render.
  - Handles all user interactions:
    - Add, edit, delete, complete/uncomplete tasks.
    - Filter & search behavior.
    - Drag-and-drop reordering.
    - Backup/restore with JSON.
    - Theme toggling and keyboard shortcuts.

## 4. Technical Details

### 4.1 Data Structures

Each task is represented as a plain JavaScript object:

```js
{
  id: string,               // unique identifier
  text: string,             // task description
  completed: boolean,       // true if done
  createdAt: string,        // ISO timestamp
  priority: 'low' | 'medium' | 'high',
  dueDate: string,          // 'YYYY-MM-DD' or ''
  order: number             // numeric order for drag-and-drop
}
```

All tasks are stored in an **array**: `state.tasks: Task[]`.

### 4.2 Algorithms & Array Methods

- **Adding a task**
  - Construct a task object with `Utils.createId()`.
  - Push it to `state.tasks` with `Array.prototype.push`.
  - Save array to `localStorage` and re-render.

- **Deleting a task**
  - Find the task index using `findIndex` on `state.tasks`.
  - Remove it with `splice(index, 1)`.

- **Toggling completion**
  - Find the task via `findIndex`.
  - Flip the `completed` boolean.

- **Filtering by status** (`all`, `active`, `completed`)
  - Use `filter` on `state.tasks` before rendering:
    - `active`: `!task.completed`
    - `completed`: `task.completed`

- **Text search**
  - Convert task text and search query to lowercase.
  - Keep only tasks where `text.includes(query)`.

- **Statistics**
  - `total`: `tasks.length`
  - `completed`: `tasks.filter(t => t.completed).length`
  - `active`: `total - completed`

- **Clearing completed tasks**
  - Use `filter` to keep only tasks where `!t.completed`.

- **Drag-and-drop ordering**
  - HTML5 drag events (`dragstart`, `dragover`, `drop`, `dragend`).
  - On drop:
    - Remove the dragged task from `state.tasks` using `splice`.
    - Insert it at the new index using `splice(targetIndex, 0, task)`.
    - Recompute `order` for all tasks (`tasks.forEach((t, i) => t.order = i)`).
    - Persist and re-render.

### 4.3 Architecture & Flow

1. **Initialization** (`init()` in `app.js`):
   - Cache DOM references.
   - Load tasks and theme from `Storage`.
   - Attach all event listeners.
   - Call `render()`.

2. **Render cycle**:
   - `getVisibleTasks()` applies filter + search to `state.tasks`.
   - `UI.renderTasks(visibleTasks)` rebuilds the `<li>` markup.
   - `UI.updateStats(state.tasks)` updates totals.

3. **Separation of concerns**:
   - `Storage` knows about persistence only.
   - `UI` knows about DOM rendering only.
   - `App` coordinates state changes and events.

## 5. Testing Evidence

Below are example test cases and validation scenarios you can run manually in the browser.

### 5.1 Task CRUD

1. **Create task**
   - Action: Type "Buy groceries" and click **Add task**.
   - Expected: Task appears in the list; total = 1, active = 1, completed = 0.

2. **Edit task**
   - Action: Double-click the task text, change to "Buy groceries and milk", press Enter.
   - Expected: Text updates in the list and persists after page reload.

3. **Delete task**
   - Action: Click the `×` button on the task.
   - Expected: Task disappears; counts update accordingly.

### 5.2 Completion & Filtering

4. **Mark complete**
   - Action: Check the checkbox on a task.
   - Expected: Task is styled as completed (line-through), active count decreases, completed count increases.

5. **Filter views**
   - Action: Add 3 tasks, mark 1 as complete, then click `Active` and `Completed` filters.
   - Expected:
     - `All`: shows all 3
     - `Active`: shows only 2 active tasks
     - `Completed`: shows only the 1 completed task

### 5.3 Search & Stats

6. **Search filter**
   - Action: Add tasks "Read book" and "Write code"; type "read" into search box.
   - Expected: Only "Read book" remains visible. Stats still reflect all tasks.

7. **Statistics accuracy**
   - Action: Add several tasks, mark some completed, delete one.
   - Expected: `total`, `active`, `completed` always match the tasks actually in the list.

### 5.4 Persistence & Theme

8. **Task persistence**
   - Action: Add tasks, refresh the browser.
   - Expected: All tasks, completion states, order, and priorities remain the same.

9. **Theme persistence**
   - Action: Switch to dark mode, refresh the browser.
   - Expected: Dark mode remains active after reload.

### 5.5 Drag-and-Drop Ordering

10. **Reorder tasks**
    - Action: Create three tasks A, B, C. Drag C above A.
    - Expected: Order becomes C, A, B and remains after reload.

### 5.6 Backup / Restore

11. **Backup JSON**
    - Action: Click **Copy backup JSON**.
    - Expected: JSON representation of current tasks can be pasted (e.g., into a text editor).

12. **Restore from JSON**
    - Action: Clear tasks, click **Restore from JSON**, paste the previously copied JSON.
    - Expected: All tasks are restored with correct text, completion status, priorities, and order.

13. **Invalid JSON handling**
    - Action: Click **Restore from JSON** and paste invalid text.
    - Expected: An error message is shown (alert) and existing tasks are unchanged.

---

This `documentation.md` file, together with `README.md`, fulfills the requirements for:

- Project Overview
- Setup Instructions
- Code Structure
- Technical Details
- Testing Evidence
