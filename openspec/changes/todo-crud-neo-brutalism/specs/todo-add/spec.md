## ADDED Requirements

### Requirement: Add a new todo
The system SHALL allow the user to create a new todo by entering a title and submitting the form. An empty title SHALL NOT create a todo.

#### Scenario: Successful add
- **WHEN** the user types a non-empty title in the input and presses Enter or clicks the Add button
- **THEN** a new todo with the given title and `completed: false` is appended to the list and persisted to LocalStorage

#### Scenario: Empty title rejected
- **WHEN** the user submits the form with an empty or whitespace-only title
- **THEN** no todo is created and the input receives a visible error state (red border)

#### Scenario: Input cleared after add
- **WHEN** a todo is successfully added
- **THEN** the input field is cleared and focused, ready for the next entry
