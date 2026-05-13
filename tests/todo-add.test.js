// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadTodos, saveTodos, initApp } from '../app.js';

describe('todo-add: form submit with non-empty title', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="add-form">
        <input type="text" id="todo-input" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
    `;
    localStorage.clear();
    initApp();
  });

  it('appends a new todo to LocalStorage and re-renders the list', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = 'Buy milk';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const todos = loadTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Buy milk');
    expect(todos[0].completed).toBe(false);
    expect(typeof todos[0].id).toBe('string');

    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Buy milk');
  });
});

describe('todo-add: input cleared and focused after successful add', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="add-form">
        <input type="text" id="todo-input" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
    `;
    localStorage.clear();
    initApp();
  });

  it('clears the input after a successful add', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = 'Buy milk';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(input.value).toBe('');
  });

  it('focuses the input after a successful add', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = 'Buy milk';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(input);
  });
});

describe('todo-add: form submit with empty/whitespace title', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="add-form">
        <input type="text" id="todo-input" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
    `;
    localStorage.clear();
    initApp();
  });

  it('does NOT create a todo when title is empty', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = '';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(loadTodos().length).toBe(0);
  });

  it('does NOT create a todo when title is whitespace only', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = '   ';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(loadTodos().length).toBe(0);
  });

  it('adds .input-error class to the input when title is empty', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = '';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(input.classList.contains('input-error')).toBe(true);
  });

  it('adds .input-error class to the input when title is whitespace only', () => {
    const input = document.getElementById('todo-input');
    const form = document.getElementById('add-form');

    input.value = '   ';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(input.classList.contains('input-error')).toBe(true);
  });
});
