import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeAll } from 'vitest';

describe('App shell (index.html)', () => {
  let document;

  beforeAll(() => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('renders a header element', () => {
    expect(document.querySelector('header')).not.toBeNull();
  });

  it('renders an add-todo form', () => {
    expect(document.querySelector('form')).not.toBeNull();
  });

  it('renders the #todo-list container', () => {
    expect(document.querySelector('#todo-list')).not.toBeNull();
  });
});
