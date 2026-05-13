---
name: openspec-propose
description: Propose a new change with all artifacts generated in one step. Use when the user wants to quickly describe what they want to build and get a complete proposal with design, specs, and tasks ready for implementation.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.2.0"
---

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, run /opsx:apply

---

**Input**: The user's request should include a change name (kebab-case) OR a description of what they want to build.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

3. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `outputPath`: Where to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

   b. **Continue until all `applyRequires` artifacts are complete**
      - After creating each artifact, re-run `openspec status --change "<name>" --json`
      - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
      - Stop when all `applyRequires` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

6. **Update the Ubiquitous Language**

   Read `openspec/specs/ubiquitous-language.md` (create it if it does not exist yet using the template below).

   From the artifacts just created (proposal.md, specs/, design.md), extract every meaningful domain term:
   - **Entity / AggregateRoot** — identifiable things that have a lifecycle (e.g. `Order`, `Invoice`)
   - **ValueObject** — immutable descriptors without identity (e.g. `Money`, `Address`)
   - **DomainEvent** — something that happened in the domain (e.g. `OrderPlaced`, `PaymentReceived`)
   - **Command** — an actor's intention (e.g. `PlaceOrder`, `CancelShipment`)
   - **Role** — who acts (e.g. `Customer`, `WarehouseManager`)
   - **Concept** — any other ubiquitous term that must be named consistently (e.g. `Backorder`, `LeadTime`)

   For each **new** term (not already present in the file): append a row to the Terms table:

   | Term | Type | Definition | Introduced by |
   |------|------|-----------|---------------|

   **Rules:**
   - Do NOT remove or modify existing rows — they are authoritative
   - Use PascalCase for all term names (matches C# naming)
   - `Introduced by` = the change name (kebab-case)
   - Keep definitions concise (one sentence max)

   **Template for new file:**
   ```markdown
   # Ubiquitous Language

   > The canonical domain vocabulary for this project.
   > Extended automatically during each `/openspec-propose` session.
   > **Never rename or redefine existing terms without explicit team agreement.**

   | Term | Type | Definition | Introduced by |
   |------|------|-----------|---------------|
   ```

7. **Add a Domain Events section to design.md**

   Identify all domain events from the specs and proposal. For each event determine:
   - Who **publishes** it (aggregate/service)
   - Who **handles** it (one or more handlers/consumers)
   - What **triggers** it
   - What **side effects** it produces

   Append the following section to `design.md`:

   ```markdown
   ## Domain Events

   | Event | Published by | Handled by | Trigger | Side effects |
   |-------|-------------|-----------|---------|--------------|
   | ...   | ...         | ...       | ...     | ...          |

   ```mermaid
   graph LR
       Publisher -->|"EventName"| Handler1["HandlerName"]
       Publisher -->|"EventName"| Handler2["HandlerName"]
   ```
   ```

   If no domain events apply to this change (e.g. a pure CRUD feature with no cross-boundary reactions),
   add a brief note instead of the table:
   ```markdown
   ## Domain Events

   _No domain events — this change performs direct CRUD operations with no cross-boundary side effects._
   ```

8. **Structure all tasks in tasks.md as TDD pairs**

   Review the generated `tasks.md`. Every implementation item must be preceded by a test item.
   Rewrite or add tasks so that each unit of work is a **Test → Implement** pair:

   ```
   - [ ] Test: <what the test verifies — concrete and specific>
   - [ ] Implement: <what gets built to make the test pass>
   ```

   For domain event handlers identified in step 7, add them to the spec section that owns the
   **handler** (not the publisher), also as a Test → Implement pair:

   ```
   - [ ] Test: <HandlerName> reacts to <EventName> → <expected outcome>
   - [ ] Implement: <HandlerName> — <side effect description>
   ```

   If the handler belongs to a spec that does not yet have a section in `tasks.md`, create it.

   **Rules:**
   - `Test:` always comes **before** its matching `Implement:` — never after
   - Each task is one commit in the loop — Ralph writes the test, commits, then next iteration implements
   - Keep task descriptions concrete: name the class/method/endpoint being tested or built
   - Avoid vague tasks like "Set up infrastructure" — split into Test + Implement pairs

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- Domain events found (or "none — CRUD only")
- New ubiquitous language terms added (count + list)
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run `/opsx:apply` or ask me to implement to start working on the tasks."

**Artifact Creation Guidelines**

- Follow the `instruction` field from `openspec instructions` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output file - fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file
  - Do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact
  - These guide what you write, but should never appear in the output

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next
- **Every task in tasks.md must be part of a Test → Implement pair. No naked Implement tasks.**
