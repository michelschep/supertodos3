## Context

A single-page vanilla JS todo app with no backend. State is persisted in LocalStorage. The UI follows Neo Brutalism design principles: thick black borders, stark drop shadows, high-contrast colours, chunky buttons, and bold sans-serif typography.

## Goals / Non-Goals

**Goals:**
- Display the full list of todos
- Add a new todo by entering a title and submitting
- Toggle a todo's completion status
- Edit an existing todo's title inline
- Delete a todo
- Persist all changes to LocalStorage automatically
- Ship a single self-contained `index.html` + `style.css` + `app.js`

**Non-Goals:**
- Backend, database, or user authentication
- Multi-user or sync across devices
- Categories, labels, priorities, or due dates
- Drag-and-drop reordering

## Decisions

### Vanilla JS over a framework
**Decision:** Plain JavaScript with no build step.  
**Rationale:** Project scope is small; zero dependencies keeps it simple and instantly runnable with `npx serve .`.  
**Alternatives considered:** React/Vue — overkill for a single-page CRUD app with no routing.

### LocalStorage for persistence
**Decision:** Serialize the todos array as JSON and store in `localStorage['todos']`.  
**Rationale:** No server required; state survives page refresh; trivial API.  
**Alternatives considered:** IndexedDB — unnecessarily complex for a flat list.

### Inline editing (no modal)
**Decision:** Clicking a todo title transforms it into an `<input>` in place; pressing Enter or blurring saves.  
**Rationale:** Keeps the UI minimal and interaction snappy.  
**Alternatives considered:** Modal dialog — adds visual noise.

### Neo Brutalism CSS approach
**Decision:** Global CSS variables define the palette (`--black`, `--white`, `--yellow`). Components share a `.brutal-card` utility class with `border: 3px solid var(--black)` and `box-shadow: 4px 4px 0 var(--black)`.  
**Rationale:** Consistent look with minimal CSS duplication.

## Risks / Trade-offs

- **LocalStorage limit (~5 MB)** → Mitigation: todos are small text objects; limit is irrelevant in practice.
- **No undo** → Mitigation: deletes are immediate and permanent; clearly communicate this in the UI (confirm on delete).
- **Inline editing UX** → Mitigation: provide visible affordances (pencil icon, clear focus ring) so the editable state is obvious.

## Domain Events

_No domain events — this change performs direct CRUD operations with no cross-boundary side effects._
