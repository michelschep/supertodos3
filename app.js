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

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'brutal-card todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;

    const span = document.createElement('span');
    span.className = 'todo-title';
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
