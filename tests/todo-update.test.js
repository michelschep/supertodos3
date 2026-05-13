// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos, renderTodos, enterEditMode, saveEdit } from '../app.js';

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

describe('todo-update: pressing Enter saves the new title', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('pressing Enter saves the new title to LocalStorage and reverts to text display', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const span = document.querySelector('#todo-list .todo-title');
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const input = document.querySelector('#todo-list .edit-input');
    input.value = 'Buy oat milk';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const todos = loadTodos();
    expect(todos[0].title).toBe('Buy oat milk');

    const titleSpan = document.querySelector('#todo-list .todo-title');
    expect(titleSpan).not.toBeNull();
    expect(titleSpan.textContent).toBe('Buy oat milk');

    const editInput = document.querySelector('#todo-list .edit-input');
    expect(editInput).toBeNull();
  });
});

describe('todo-update: empty title on save restores original', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('saving an empty title restores the original title and does not persist the empty value', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const span = document.querySelector('#todo-list .todo-title');
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const input = document.querySelector('#todo-list .edit-input');
    input.value = '   ';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const todos = loadTodos();
    expect(todos[0].title).toBe('Buy milk');

    const titleSpan = document.querySelector('#todo-list .todo-title');
    expect(titleSpan).not.toBeNull();
    expect(titleSpan.textContent).toBe('Buy milk');
  });
});

describe('todo-update: blur saves the new title', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('moving focus away (blur) saves the new title to LocalStorage and reverts to text display', () => {
    saveTodos([{ id: 'abc', title: 'Buy milk', completed: false }]);
    renderTodos();

    const span = document.querySelector('#todo-list .todo-title');
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const input = document.querySelector('#todo-list .edit-input');
    input.value = 'Buy oat milk';
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    const todos = loadTodos();
    expect(todos[0].title).toBe('Buy oat milk');

    const titleSpan = document.querySelector('#todo-list .todo-title');
    expect(titleSpan).not.toBeNull();
    expect(titleSpan.textContent).toBe('Buy oat milk');

    const editInput = document.querySelector('#todo-list .edit-input');
    expect(editInput).toBeNull();
  });
});
