## Why

Users need a simple, visually striking todo app to manage their daily tasks. The Neo Brutalism aesthetic makes the UI bold and memorable while keeping interactions straightforward.

## What Changes

- Introduce a full-page todo list showing all todos
- Add capability to create a new todo with a title
- Add capability to mark a todo as done / toggle completion
- Add capability to edit an existing todo's title inline
- Add capability to delete a todo

## Capabilities

### New Capabilities

- `todo-list`: Display all todos with their completion state
- `todo-add`: Create a new todo by entering a title
- `todo-update`: Edit an existing todo's title inline and toggle completion
- `todo-delete`: Remove a todo permanently

### Modified Capabilities

<!-- none -->

## Impact

- New `index.html` (or single-page app) with vanilla JS + p5.js-free DOM approach
- Neo Brutalism CSS: thick black borders, bold typography, offset drop shadows, high-contrast colours (black, white, yellow accent)
- LocalStorage used for persistence (no backend required)
- All CRUD operations handled client-side
