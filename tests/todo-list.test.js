// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderTodos, loadTodos, saveTodos } from '../app.js';

describe('todo-list: renderTodos()', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="todo-list"></ul>';
    localStorage.clear();
  });

  it('renders todos as <li> elements with title text', () => {
    const todos = [
      { id: '1', title: 'Buy milk', completed: false },
      { id: '2', title: 'Walk dog', completed: false },
    ];
    saveTodos(todos);

    renderTodos();

    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Buy milk');
    expect(items[1].textContent).toContain('Walk dog');
  });

  it('renders a checkbox per todo', () => {
    saveTodos([{ id: '1', title: 'Buy milk', completed: false }]);

    renderTodos();

    const checkbox = document.querySelector('#todo-list input[type="checkbox"]');
    expect(checkbox).not.toBeNull();
  });

  it('renders checkbox checked state matching todo.completed', () => {
    saveTodos([
      { id: '1', title: 'Done task', completed: true },
      { id: '2', title: 'Pending task', completed: false },
    ]);

    renderTodos();

    const checkboxes = document.querySelectorAll('#todo-list input[type="checkbox"]');
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('renders completed todo title with .completed CSS class', () => {
    saveTodos([
      { id: '1', title: 'Done task', completed: true },
      { id: '2', title: 'Pending task', completed: false },
    ]);

    renderTodos();

    const spans = document.querySelectorAll('#todo-list .todo-title');
    expect(spans[0].classList.contains('completed')).toBe(true);
    expect(spans[1].classList.contains('completed')).toBe(false);
  });

  it('shows empty-state message when todos array is empty', () => {
    renderTodos();

    const list = document.getElementById('todo-list');
    expect(list.textContent).toContain('No todos yet — add one above!');
    expect(list.querySelectorAll('li').length).toBe(0);
  });
});

describe('todo-list: loadTodos / saveTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadTodos returns empty array when localStorage is empty', () => {
    expect(loadTodos()).toEqual([]);
  });

  it('saveTodos persists todos; loadTodos retrieves them', () => {
    const todos = [{ id: '1', title: 'Test', completed: false }];
    saveTodos(todos);
    expect(loadTodos()).toEqual(todos);
  });
});
