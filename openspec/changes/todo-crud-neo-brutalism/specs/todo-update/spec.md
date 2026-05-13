## ADDED Requirements

### Requirement: Edit a todo's title inline
The system SHALL allow the user to edit a todo's title by clicking on the title text, which SHALL transform it into an editable input field. Pressing Enter or moving focus away SHALL save the change.

#### Scenario: Enter edit mode
- **WHEN** the user clicks a todo's title
- **THEN** the title text is replaced by an editable input pre-filled with the current title

#### Scenario: Save on Enter
- **WHEN** the user edits the title and presses Enter
- **THEN** the updated title is saved, the input reverts to text display, and LocalStorage is updated

#### Scenario: Save on blur
- **WHEN** the user edits the title and moves focus away from the input
- **THEN** the updated title is saved, the input reverts to text display, and LocalStorage is updated

#### Scenario: Empty title on save prevented
- **WHEN** the user clears the title and saves
- **THEN** the original title is restored (empty title is not persisted)

### Requirement: Toggle todo completion
The system SHALL allow the user to toggle a todo between completed and not-completed by clicking a checkbox.

#### Scenario: Mark complete
- **WHEN** the user clicks the checkbox of an incomplete todo
- **THEN** the todo is marked as `completed: true`, the title gains a strikethrough, and LocalStorage is updated

#### Scenario: Mark incomplete
- **WHEN** the user clicks the checkbox of a completed todo
- **THEN** the todo is marked as `completed: false`, the strikethrough is removed, and LocalStorage is updated
