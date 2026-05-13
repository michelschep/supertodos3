# Ubiquitous Language

> The canonical domain vocabulary for this project.
> Extended automatically during each `/openspec-propose` session.
> **Never rename or redefine existing terms without explicit team agreement.**

| Term | Type | Definition | Introduced by |
|------|------|-----------|---------------|
| Todo | Entity | A single task item with a title and a completion state, owned by the user. | todo-crud-neo-brutalism |
| TodoTitle | ValueObject | The immutable text label of a Todo; must be non-empty. | todo-crud-neo-brutalism |
| CompletionState | ValueObject | Boolean flag (`completed: true/false`) indicating whether a Todo has been finished. | todo-crud-neo-brutalism |
| TodoList | Concept | The ordered collection of all Todos persisted for the current user. | todo-crud-neo-brutalism |
| EmptyState | Concept | The UI state shown when the TodoList contains no items. | todo-crud-neo-brutalism |
| NeoBrutalism | Concept | The visual design language used across the app: thick borders, offset drop shadows, high-contrast colours, bold typography. | todo-crud-neo-brutalism |
