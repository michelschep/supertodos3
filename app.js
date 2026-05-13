export function loadTodos() {
  const raw = localStorage.getItem('todos');
  return raw ? JSON.parse(raw) : [];
}

export function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function renderTodos() {
  const list = document.getElementById('todo-list');
  const todos = loadTodos();
  list.innerHTML = '';

  if (todos.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No todos yet — add one above!';
    list.appendChild(empty);
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'brutal-card todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;

    const span = document.createElement('span');
    span.className = todo.completed ? 'todo-title completed' : 'todo-title';
    span.textContent = todo.title;

    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);
  });
}

// Auto-initialize in browser (skipped when module is imported in test environments)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('todo-list')) renderTodos();
  });
}
