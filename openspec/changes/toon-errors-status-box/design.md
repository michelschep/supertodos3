## Context

SuperTodos is een vanilla JS todo-app met neo-brutalism styling. Validatiefouten worden momenteel enkel gesignaleerd via een rode rand op het inputveld (`input-error` CSS-klasse). Er is geen tekstuele foutmelding, wat slecht is voor toegankelijkheid en UX. De status box is een nieuw UI-element dat foutmeldingen expliciet toont.

## Goals / Non-Goals

**Goals:**
- Toon een leesbare foutmelding in een status box wanneer form-validatie mislukt.
- Verberg de status box automatisch bij nieuw gebruik (focus, input of succesvolle submit).
- Houd de bestaande `input-error` klasse als aanvullende visuele cue.
- Consistent neo-brutalism styling voor de status box.

**Non-Goals:**
- Geen succes-/info-meldingen in deze iteratie (alleen errors).
- Geen meerdere gelijktijdige foutmeldingen.
- Geen server-side validatie.

## Decisions

### 1. Aparte DOM-node vs. inline tekst bij input
**Keuze:** Aparte `<div id="status-box">` in de HTML, hidden by default.  
**Reden:** Scheidt presentatie van structuur, herbruikbaar voor toekomstige fouttypen.  
**Alternatief:** `aria-describedby` span naast input — te beperkt voor uitbreiding.

### 2. Verbergen via CSS-klasse vs. display toggle
**Keuze:** CSS-klasse `status-box--visible` toggelen (hidden = `display: none` by default).  
**Reden:** Makkelijk te testen op aanwezigheid van de klasse; animaties later eenvoudig toe te voegen.

### 3. Auto-clear trigger
**Keuze:** Status box verdwijnt bij `input` event op het tekstveld (gebruiker begint te typen).  
**Reden:** Directe feedback; logischer dan wachten tot submit.

### 4. `showError` / `clearError` als exporteerbare functies
**Keuze:** Twee dedicated functies exporteren uit `app.js`.  
**Reden:** Testbaar in isolatie, herbruikbaar voor toekomstige validatiescenario's.

## Risks / Trade-offs

- [Risico] Oude browsers zonder `classList` API → Mitigatie: niet van toepassing, project target moderne browsers.
- [Trade-off] Status box is globaal (één per pagina) → voldoende voor huidige single-form scope.

## Migration Plan

1. HTML: voeg `<div id="status-box" class="status-box" role="alert" aria-live="polite"></div>` toe vóór het `<ul>`.
2. CSS: voeg `.status-box` (verborgen) en `.status-box--visible` (zichtbaar, rood, neo-brutalism) toe.
3. JS: exporteer `showError(message)` en `clearError()`, pas `initApp` submit-handler aan.
4. Geen rollback nodig — wijziging is additief.

## Open Questions

_Geen openstaande vragen._

## Domain Events

_No domain events — this change performs direct CRUD operations with no cross-boundary side effects._
