# AGENTS.md

> Operational guide — loaded every session. Keep this under 60 lines.
> Conventions, architecture, and pitfalls live in `openspec/specs/conventions.md`.

---

## Stack

JavaScript (vanilla) + p5.js via CDN.
See `openspec/specs/conventions.md` for full conventions.

## Scope Discipline

- Only touch files stated in tasks.md for the active change
- Never rewrite existing working code to implement a new task

## Build & Test

```bash
npx serve .    # start local server at http://localhost:3000
```

Open browser console (F12) — no errors = ready to commit.

## Definition of Done

- [ ] Browser console shows zero errors
- [ ] p5 reserved names not used as variables
- [ ] Task marked `- [x]` in tasks.md
- [ ] Commit tagged `[task-N]`

---

## Operational Learnings

<!-- Format: "- [YYYY-MM-DD] <what you learned>" -->
