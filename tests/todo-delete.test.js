// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos, renderTodos } from '../app.js';

describe('todo-delete: clicking delete button removes the todo', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('clicking the delete button removes the todo from LocalStorage and re-renders', () => {
    saveTodos([
      { id: 'abc', title: 'Buy milk', completed: false },
      { id: 'def', title: 'Walk dog', completed: false },
    ]);
    renderTodos();

    const deleteBtn = document.querySelector('#todo-list .delete-btn');
    deleteBtn.click();

    const todos = loadTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe('def');

    const items = document.querySelectorAll('#todo-list .todo-item');
    expect(items).toHaveLength(1);
  });

  it('deleting the last todo shows the empty-state message', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const deleteBtn = document.querySelector('#todo-list .delete-btn');
    deleteBtn.click();

    const todos = loadTodos();
    expect(todos).toHaveLength(0);

    const empty = document.querySelector('#todo-list .empty-state');
    expect(empty).not.toBeNull();
    expect(empty.textContent).toBe('No todos yet — add one above!');
  });
});
