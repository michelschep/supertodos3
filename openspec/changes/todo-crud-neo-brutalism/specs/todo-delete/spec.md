## ADDED Requirements

### Requirement: Delete a todo
The system SHALL allow the user to delete a todo by clicking a delete button on the todo item. The todo SHALL be permanently removed from both the UI and LocalStorage.

#### Scenario: Delete a todo
- **WHEN** the user clicks the delete button on a todo
- **THEN** the todo is removed from the list and from LocalStorage immediately

#### Scenario: List updates after delete
- **WHEN** the last todo is deleted
- **THEN** the empty-state message "No todos yet — add one above!" is displayed
