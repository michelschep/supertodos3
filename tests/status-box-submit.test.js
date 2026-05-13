// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { initApp, loadTodos } from '../app.js';

function setupDOM() {
  document.body.innerHTML = `
    <div id="status-box" class="status-box" role="alert" aria-live="polite"></div>
    <form id="add-form">
      <input type="text" id="todo-input" autocomplete="off" />
      <button type="submit">Add</button>
    </form>
    <ul id="todo-list"></ul>
  `;
  localStorage.clear();
  initApp();
}

describe('status-box: empty submit', () => {
  beforeEach(setupDOM);

  it('shows the status box with text "Voer een titel in" when title is empty', () => {
    const form = document.getElementById('add-form');
    document.getElementById('todo-input').value = '';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const box = document.getElementById('status-box');
    expect(box.classList.contains('status-box--visible')).toBe(true);
    expect(box.textContent).toBe('Voer een titel in');
  });

  it('adds .input-error class to the input when title is empty', () => {
    const form = document.getElementById('add-form');
    document.getElementById('todo-input').value = '';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.getElementById('todo-input').classList.contains('input-error')).toBe(true);
  });
});
