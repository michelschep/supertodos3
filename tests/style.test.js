import { readFileSync } from 'fs';
import { describe, it, expect, beforeAll } from 'vitest';

describe('style.css — Neo Brutalism design tokens', () => {
  let css;

  beforeAll(() => {
    css = readFileSync(new URL('../style.css', import.meta.url), 'utf8');
  });

  it('defines the --black CSS variable', () => {
    expect(css).toMatch(/--black\s*:/);
  });

  it('defines the --white CSS variable', () => {
    expect(css).toMatch(/--white\s*:/);
  });

  it('defines the --yellow CSS variable', () => {
    expect(css).toMatch(/--yellow\s*:/);
  });

  it('defines a .brutal-card class', () => {
    expect(css).toMatch(/\.brutal-card\s*\{/);
  });

  it('.brutal-card has a thick border using --black', () => {
    // Expect something like: border: 3px solid var(--black)
    expect(css).toMatch(/border\s*:\s*\d+px\s+solid\s+var\(--black\)/);
  });

  it('.brutal-card has an offset box-shadow using --black', () => {
    // Expect something like: box-shadow: 4px 4px 0 var(--black)
    expect(css).toMatch(/box-shadow\s*:\s*\d+px\s+\d+px\s+\d+(?:px)?\s+var\(--black\)/);
  });
});
