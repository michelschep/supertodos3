## ADDED Requirements

### Requirement: Lege titel toont foutmelding in status box
Wanneer de gebruiker een lege todo probeert toe te voegen, SHALL de applicatie een foutmelding tonen in de status box in plaats van stil te falen.

#### Scenario: Lege submit toont status box fout
- **WHEN** de gebruiker het formulier indient met een leeg invoerveld
- **THEN** wordt de status box zichtbaar met de tekst "Voer een titel in"
- **THEN** wordt de klasse `input-error` toegevoegd aan het invoerveld
- **THEN** wordt er geen todo toegevoegd aan de lijst

#### Scenario: Succesvolle submit verbergt de status box
- **WHEN** de gebruiker een geldige titel invoert en het formulier indient
- **THEN** is de status box niet zichtbaar
- **THEN** wordt de todo toegevoegd aan de lijst
