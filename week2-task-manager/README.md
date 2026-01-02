# Week 2: Interactive Task Manager

A feature-rich task management application built with **vanilla JavaScript** as part of Week 2: JavaScript Fundamentals.

The app demonstrates DOM manipulation, events, array methods, localStorage persistence, basic validation, drag-and-drop ordering, and a dark/light mode toggle.

---

## Project Goals

- Practice JavaScript syntax, data types, variables, and functions
- Manipulate the DOM to create, update, and delete elements dynamically
- Handle user interactions via events (click, submit, input, keyboard)
- Use arrays and array methods to manage a list of tasks
- Persist data using `localStorage` so tasks remain after page reload
- Implement basic form validation and error handling
- Build a responsive and user-friendly interface

---

## Folder Structure

```text
week2-task-manager/
│── index.html
│── css/
│   ├── style.css
│   └── theme.css
│── js/
│   ├── app.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
│── README.md
└── .gitignore
```

---

## Running The Site

1. Open the folder of the Codebase
2. Run this command
```
 echo "Server running at http://localhost:8000"; python -m http.server 8000
```

## Setup & Usage

1. Open the project folder in your editor.
2. Open `index.html` in a browser (double-click or use a simple static server).
3. Start adding tasks using the "Task" input and **Add task** button.

### Basic Interactions

- **Add task**: Type into the input and press **Enter** or click **Add task**.
- **Complete task**: Click the checkbox next to a task.
- **Delete task**: Click the **×** button on the right.
- **Edit task**: Double-click the task text, edit, then press **Enter** or click away.
- **Filter**: Use the `All`, `Active`, `Completed` filter chips.
- **Search**: Use the search box to filter tasks by text.
- **Stats**: See total, active, and completed counts in the stats bar.
- **Keyboard shortcut**: Press `Ctrl + /` to focus the task input quickly.

### Drag & Drop Ordering

- Click and drag a task item to reorder it in the list.
- The new order is saved in `localStorage` so it persists after reload.

### Backup & Restore

- **Copy backup JSON**: Copies all tasks as JSON to your clipboard (or shows a prompt).
- **Restore from JSON**: Pastes JSON from a previous backup to restore tasks.

### Dark / Light Mode

- Use the **Dark mode / Light mode** button in the header.
- The chosen theme is saved and restored from `localStorage`.

---

## Technical Details

### Data Model

Each task is stored as an object in an array:

```js
{
  id: string,
  text: string,
  completed: boolean,
  createdAt: string (ISO date),
  priority: 'low' | 'medium' | 'high',
  dueDate: string (YYYY-MM-DD or empty),
  order: number 
}
```

The array is kept in memory in `state.tasks` and persisted to `localStorage` using the key `week2-task-manager-tasks`.

### Code Structure

- `js/utils.js` – Small helper functions (DOM shortcuts, ID creation, HTML escaping, date helpers).
- `js/storage.js` – Encapsulates reading/writing tasks and theme preference from `localStorage`.
- `js/ui.js` – Pure rendering functions for the task list, statistics, and theme toggle.
- `js/app.js` – Main application logic: state management, event handling, drag-and-drop, backup/restore.

### Algorithms & Array Methods

- `Array.prototype.filter` – Filtering tasks by status and search query, clearing completed tasks.
- `Array.prototype.map` – Normalizing tasks loaded from `localStorage`.
- `Array.prototype.findIndex` – Locating tasks for update/delete.
- `Array.prototype.splice` – Reordering tasks during drag-and-drop and removing tasks.
- Sorting by `order` field – Keeps the drag-and-drop order persistent.

### DOM Manipulation & Events

- **DOM selection** using `querySelector` and `querySelectorAll` wrappers.
- **Dynamic rendering** of `<li>` elements inside the `#taskList` container.
- **Event handling** for:
  - `submit` on the task form
  - `click` on checkboxes and delete buttons (event delegation)
  - `dblclick` on task text to enable inline editing
  - `input` events for live search and clearing validation errors
  - HTML5 drag-and-drop events (`dragstart`, `dragover`, `drop`, `dragend`)
  - Keyboard shortcuts via `keydown` on `document`

### Validation & Error Handling

- Prevents adding empty tasks or overly long task text.
- Shows an inline error message under the form with `aria-live="polite"`.
- Catches JSON parsing errors during backup restore and shows a friendly alert.

---




