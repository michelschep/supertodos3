// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { showError, clearError } from '../app.js';

function setupDOM() {
  document.body.innerHTML = `
    <div id="status-box" class="status-box" role="alert" aria-live="polite"></div>
    <form id="add-form">
      <input type="text" id="todo-input" autocomplete="off" />
      <button type="submit">Add</button>
    </form>
    <ul id="todo-list"></ul>
  `;
}

describe('showError', () => {
  beforeEach(setupDOM);

  it('adds class status-box--visible to the status box', () => {
    showError('Voer een titel in');
    const box = document.getElementById('status-box');
    expect(box.classList.contains('status-box--visible')).toBe(true);
  });

  it('sets the text content to the given message', () => {
    showError('Voer een titel in');
    const box = document.getElementById('status-box');
    expect(box.textContent).toBe('Voer een titel in');
  });
});

describe('clearError', () => {
  beforeEach(setupDOM);

  it('removes class status-box--visible from the status box', () => {
    const box = document.getElementById('status-box');
    box.classList.add('status-box--visible');
    box.textContent = 'Some error';
    clearError();
    expect(box.classList.contains('status-box--visible')).toBe(false);
  });

  it('clears the text content of the status box', () => {
    const box = document.getElementById('status-box');
    box.classList.add('status-box--visible');
    box.textContent = 'Some error';
    clearError();
    expect(box.textContent).toBe('');
  });
});
