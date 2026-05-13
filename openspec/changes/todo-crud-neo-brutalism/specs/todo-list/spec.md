## ADDED Requirements

### Requirement: Display all todos
The system SHALL render the complete list of todos on page load. Each todo SHALL show its title and completion status. If no todos exist, the system SHALL display an empty-state message.

#### Scenario: Page loads with existing todos
- **WHEN** the user opens the app and todos exist in LocalStorage
- **THEN** all todos are displayed in the list, each with its title and a checkbox reflecting completion state

#### Scenario: Empty state
- **WHEN** the user opens the app and no todos exist
- **THEN** an empty-state message "No todos yet — add one above!" is displayed instead of a list

#### Scenario: Completed todo visual distinction
- **WHEN** a todo has `completed: true`
- **THEN** its title is rendered with a strikethrough style
