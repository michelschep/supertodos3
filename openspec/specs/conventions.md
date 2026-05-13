# Conventions & Architecture

> Global project conventions. Ralph reads this on every planning and build iteration.

---

## Tech Stack

- **Language:** JavaScript (vanilla)
- **Framework:** p5.js (via CDN)
- **Structure:** `index.html` + `sketch.js`
- **Serving:** `npx serve .` — never open directly via `file://`

---

## Project Structure

```
index.html     <- HTML shell + p5.js CDN import
sketch.js      <- all p5.js logic
```

---

## Architecture Diagrams

All technical diagrams use **Mermaid** in `openspec/changes/<feature>/design.md`.
Required diagrams per feature (as applicable):

- **Architecture** — `graph TD` / `graph LR` — component relationships
- **Sequence diagram** — `sequenceDiagram` — interaction flows between functions
- **Event model** — `graph TD` — user events, handlers, state changes

---

## Coding Conventions

- Always serve via HTTP (`npx serve .`) — never `file://`
- Never use `fill("#hex", alpha)` — use `fill(r, g, b, alpha)`
- Flex column layouts: add `flex-shrink: 0` to fixed-height elements

---

## p5.js Reserved Names — Never Use as Variables

`width`, `height`, `color`, `fill`, `stroke`, `random`, `map`, `text`, `key`, `image`,
`mouseX`, `mouseY`, `mouseIsPressed`, `frameCount`, `frameRate`, `focused`

Using these as variable names silently overrides p5 globals and causes hard-to-debug errors.

---

## Feature Scope

- Always start with the smallest working version (walking skeleton)
- Each change must be independently testable in the browser
- Prefer 3–5 tasks per change over 20+ tasks in one change
- When proposing: describe only what is needed NOW, not the full vision
- Enhancements and edge cases are separate changes added later

---

## Known Pitfalls

- `fetch()` fails on `file://` — always use `npx serve .`
- `fill('#hex', alpha)` silently does nothing — use RGB form
- Declaring `let width = ...` breaks canvas sizing globally
