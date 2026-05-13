## 1. HTML — Status Box Element

- [x] 1.1 Test: status box element bestaat in de DOM met id `status-box` en is verborgen bij laden
- [x] 1.2 Implement: voeg `<div id="status-box" class="status-box" role="alert" aria-live="polite"></div>` toe aan `index.html` vóór de `<ul>`

## 2. CSS — Status Box Styling

- [x] 2.1 Test: status box heeft neo-brutalism stijl en is zichtbaar wanneer klasse `status-box--visible` aanwezig is
- [x] 2.2 Implement: voeg `.status-box` (verborgen, `display: none`) en `.status-box--visible` (zichtbaar, rood, dik border, offset shadow) toe aan `style.css`

## 3. JS — `showError` en `clearError` functies

- [x] 3.1 Test: `showError("Voer een titel in")` voegt klasse `status-box--visible` toe en zet de tekst
- [x] 3.2 Implement: exporteer functie `showError(message)` in `app.js` die de status box toont met de gegeven tekst
- [x] 3.3 Test: `clearError()` verwijdert klasse `status-box--visible` en maakt de tekst leeg
- [x] 3.4 Implement: exporteer functie `clearError()` in `app.js` die de status box verbergt en leeg maakt

## 4. JS — Validatie integratie in submit-handler

- [ ] 4.1 Test: lege submit toont status box met tekst "Voer een titel in" en voegt `input-error` toe aan het invoerveld
- [ ] 4.2 Implement: pas de submit-handler in `initApp` aan om `showError("Voer een titel in")` aan te roepen bij lege titel
- [ ] 4.3 Test: succesvolle submit verbergt de status box
- [ ] 4.4 Implement: roep `clearError()` aan bij succesvolle submit in `initApp`

## 5. JS — Auto-clear bij typen

- [ ] 5.1 Test: typen in het invoerveld terwijl een fout getoond wordt, verbergt de status box
- [ ] 5.2 Implement: voeg een `input` event listener toe aan het invoerveld in `initApp` die `clearError()` aanroept
