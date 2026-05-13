import { readFileSync } from 'fs';
import { describe, it, expect, beforeAll } from 'vitest';

describe('style.css — status box', () => {
  let css;

  beforeAll(() => {
    css = readFileSync(new URL('../style.css', import.meta.url), 'utf8');
  });

  it('.status-box rule exists', () => {
    expect(css).toMatch(/\.status-box\s*\{/);
  });

  it('.status-box is hidden by default (display: none)', () => {
    // Extract .status-box block (not .status-box--visible)
    const match = css.match(/\.status-box\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/display\s*:\s*none/);
  });

  it('.status-box--visible rule exists', () => {
    expect(css).toMatch(/\.status-box--visible\s*\{/);
  });

  it('.status-box--visible has display: block (visible)', () => {
    const match = css.match(/\.status-box--visible\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/display\s*:\s*block/);
  });

  it('.status-box--visible has a red border (neo-brutalism)', () => {
    const match = css.match(/\.status-box--visible\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    // Expects border using red color (#cc0000 or similar)
    expect(match[1]).toMatch(/border\s*:/);
    expect(match[1]).toMatch(/#[cC][cC]0{4}|#[rR][eE][dD]|red|#[dD][cC]0{4}/);
  });

  it('.status-box--visible has an offset box-shadow (neo-brutalism)', () => {
    const match = css.match(/\.status-box--visible\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/box-shadow\s*:\s*\d+px\s+\d+px/);
  });
});
