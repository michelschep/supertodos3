## Why

Momenteel worden validatiefouten alleen visueel aangegeven door een rode rand op het inputveld (`input-error` klasse). Er is geen tekstuele uitleg, waardoor de gebruiker niet weet wat er fout is gegaan. Een aparte status box met een duidelijke foutmelding verbetert de toegankelijkheid en gebruikerservaring.

## What Changes

- Voeg een `<div id="status-box">` toe aan de HTML, zichtbaar als er een fout is.
- Toon een leesbare foutmelding in de status box wanneer validatie mislukt (bijv. lege titel).
- Verberg de status box automatisch zodra de gebruiker begint te typen of een nieuwe actie uitvoert.
- De `input-error` klasse op het inputveld blijft behouden als aanvullende visuele cue.

## Capabilities

### New Capabilities
- `error-status-box`: Een herbruikbare status box component die foutmeldingen weergeeft en automatisch verbergt wanneer de fout is opgelost.

### Modified Capabilities
- `todo-input-validation`: De huidige validatielogica in `addTodo`-flow wordt uitgebreid om de status box aan te sturen naast de bestaande `input-error` klasse.

## Impact

- `index.html`: nieuw `<div id="status-box">` element
- `app.js`: nieuwe functies `showError(message)` en `clearError()`, aangepaste `initApp` submit-handler
- `style.css`: styling voor de status box (neo-brutalism stijl, rood, verborgen by default)
- Geen externe dependencies of API-wijzigingen
