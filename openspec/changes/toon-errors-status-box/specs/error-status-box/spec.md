## ADDED Requirements

### Requirement: Status box toont foutmeldingen
De applicatie SHALL een status box element (`<div id="status-box">`) bevatten dat foutmeldingen weergeeft. De status box is standaard verborgen en wordt zichtbaar wanneer een fout optreedt.

#### Scenario: Status box is verborgen bij opstarten
- **WHEN** de pagina geladen wordt zonder fout
- **THEN** heeft de status box NIET de klasse `status-box--visible`

#### Scenario: Status box toont een foutmelding
- **WHEN** `showError("Voer een titel in")` aangeroepen wordt
- **THEN** heeft de status box de klasse `status-box--visible` en bevat de tekst "Voer een titel in"

#### Scenario: Status box verbergt zichzelf
- **WHEN** `clearError()` aangeroepen wordt
- **THEN** heeft de status box NIET de klasse `status-box--visible` en is de tekst leeg

### Requirement: Auto-clear bij typen
De applicatie SHALL de status box automatisch verbergen zodra de gebruiker begint te typen in het invoerveld.

#### Scenario: Fout verdwijnt bij input
- **WHEN** een fout getoond wordt EN de gebruiker typt in het invoerveld
- **THEN** is de status box niet langer zichtbaar
