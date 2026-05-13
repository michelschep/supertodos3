## 1. Project Scaffold

- [x] 1.1 Test: `index.html` loads without console errors and renders the app shell (header + add-form + list container)
- [x] 1.2 Implement: Create `index.html` with Neo Brutalism app shell — header, add-form section, `<ul id="todo-list">` container
- [x] 1.3 Test: `style.css` applies Neo Brutalism base styles — `--black`, `--white`, `--yellow` CSS variables, `.brutal-card` utility class with thick border and offset drop shadow
- [x] 1.4 Implement: Create `style.css` with Neo Brutalism design tokens and `.brutal-card` utility

## 2. Todo List (todo-list)

- [x] 2.1 Test: `renderTodos()` renders all todos from LocalStorage into `#todo-list` as `<li>` elements with title and checkbox
- [x] 2.2 Implement: Create `app.js` with `loadTodos()` / `saveTodos()` LocalStorage helpers and `renderTodos()` function
- [x] 2.3 Test: `renderTodos()` shows the empty-state message "No todos yet — add one above!" when the todos array is empty
- [x] 2.4 Implement: Add empty-state branch inside `renderTodos()`
- [x] 2.5 Test: A todo with `completed: true` renders its title with a strikethrough CSS class
- [x] 2.6 Implement: Apply `.completed` CSS class (strikethrough) to completed todo titles in `renderTodos()`

## 3. Add Todo (todo-add)

- [x] 3.1 Test: Submitting the add-form with a non-empty title appends a new todo to LocalStorage and re-renders the list
- [x] 3.2 Implement: Add `addTodo(title)` function and wire it to the form's `submit` event
- [x] 3.3 Test: Submitting with an empty/whitespace title does NOT create a todo and adds a red-border error class to the input
- [x] 3.4 Implement: Add validation guard in the submit handler; toggle `.input-error` class on empty input
- [x] 3.5 Test: After a successful add the input is cleared and focused
- [x] 3.6 Implement: Clear and re-focus the input field after `addTodo()` succeeds

## 4. Update Todo (todo-update)

- [x] 4.1 Test: Clicking a todo's checkbox toggles its `completed` state in LocalStorage and re-renders
- [x] 4.2 Implement: Add `toggleTodo(id)` and bind to checkbox `change` event in `renderTodos()`
- [ ] 4.3 Test: Clicking a todo title replaces it with an `<input>` pre-filled with the current title (edit mode)
- [ ] 4.4 Implement: Add `enterEditMode(id, element)` function that swaps the title span for an editable input
- [ ] 4.5 Test: Pressing Enter while editing saves the new title to LocalStorage and reverts to text display
- [ ] 4.6 Implement: Add `saveEdit(id, newTitle)` bound to the inline input's `keydown` (Enter) event
- [ ] 4.7 Test: Moving focus away (blur) while editing saves the new title
- [ ] 4.8 Implement: Also bind `saveEdit` to the inline input's `blur` event
- [ ] 4.9 Test: Saving an empty title restores the original title (empty title not persisted)
- [ ] 4.10 Implement: Guard inside `saveEdit` — if trimmed value is empty, restore original

## 5. Delete Todo (todo-delete)

- [ ] 5.1 Test: Clicking the delete button on a todo removes it from LocalStorage and re-renders the list
- [ ] 5.2 Implement: Add `deleteTodo(id)` and bind to a delete `<button>` rendered per todo in `renderTodos()`
- [ ] 5.3 Test: Deleting the last todo shows the empty-state message
- [ ] 5.4 Implement: Verify empty-state triggers correctly via the shared `renderTodos()` empty-state branch (no extra code needed — covered by task 2.4)
