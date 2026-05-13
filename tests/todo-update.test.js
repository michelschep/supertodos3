// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos, renderTodos, enterEditMode } from '../app.js';

describe('todo-update: checkbox toggles completed state', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('toggles completed from false to true in LocalStorage and re-renders', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const checkbox = document.querySelector('#todo-list input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    const todos = loadTodos();
    expect(todos[0].completed).toBe(true);

    const span = document.querySelector('#todo-list .todo-title');
    expect(span.classList.contains('completed')).toBe(true);
  });

  it('toggles completed from true to false in LocalStorage and re-renders', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: true }]);
    renderTodos();

    const checkbox = document.querySelector('#todo-list input[type="checkbox"]');
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    const todos = loadTodos();
    expect(todos[0].completed).toBe(false);

    const span = document.querySelector('#todo-list .todo-title');
    expect(span.classList.contains('completed')).toBe(false);
  });
});

describe('todo-update: click title enters edit mode', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('clicking the todo title replaces it with an input pre-filled with the current title', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const span = document.querySelector('#todo-list .todo-title');
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const input = document.querySelector('#todo-list .edit-input');
    expect(input).not.toBeNull();
    expect(input.tagName).toBe('INPUT');
    expect(input.value).toBe('Buy milk');

    const remainingSpan = document.querySelector('#todo-list .todo-title');
    expect(remainingSpan).toBeNull();
  });
});
