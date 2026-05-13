import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeAll } from 'vitest';

describe('status-box HTML element', () => {
  let document;

  beforeAll(() => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('has an element with id "status-box"', () => {
    expect(document.getElementById('status-box')).not.toBeNull();
  });

  it('status-box is hidden on load (no status-box--visible class)', () => {
    const box = document.getElementById('status-box');
    expect(box.classList.contains('status-box--visible')).toBe(false);
  });

  it('status-box has role="alert" and aria-live="polite"', () => {
    const box = document.getElementById('status-box');
    expect(box.getAttribute('role')).toBe('alert');
    expect(box.getAttribute('aria-live')).toBe('polite');
  });

  it('status-box appears before the #todo-list element', () => {
    const box = document.getElementById('status-box');
    const list = document.getElementById('todo-list');
    // DOCUMENT_POSITION_FOLLOWING = 4: list comes after box
    expect(box.compareDocumentPosition(list) & 4).toBeTruthy();
  });
});
