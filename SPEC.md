# TripWetter – Vollständige Spezifikation

**Version:** 1.0
**Stand:** März 2026
**Live-Demo:** https://tripwetter.vercel.app
**Repository:** https://github.com/DrPiet/TripWetter

---

## 1. Systemübersicht

TripWetter ist eine clientseitige Web-App zur Reiseplanung. Benutzer legen Reiseetappen (Ort + Zeitraum) an und erhalten automatisch passende Wetterdaten – ohne Backend, ohne Account, ohne API-Key.

### Systemgrenzen

| Komponente | Technologie | Beschreibung |
|---|---|---|
| Frontend | Next.js 15, React, Tailwind CSS v4 | Einzige Schicht, läuft vollständig im Browser |
| Karte | react-leaflet, OpenStreetMap | Interaktive Weltkarte |
| Wetterdaten | Open-Meteo API | Externer Dienst, kostenlos, kein Key nötig |
| Geocoding | Open-Meteo Geocoding API | Ortssuche und Reverse-Geocoding |
| Persistenz | localStorage | Etappen werden lokal gespeichert |
| Deployment | Vercel | Automatisch bei Push auf `main` |

---

## 2. Akteure

| Akteur | Beschreibung |
|---|---|
| **Reisender** | Einziger Nutzer der App – plant Reiseetappen und betrachtet Wetterdaten |
| **Open-Meteo API** | Externer Dienst – liefert Forecast, Archiv- und Klimadaten |

---

## 3. Use Cases – Übersicht

| ID | Name | Kategorie |
|---|---|---|
| UC-01 | Etappe per Kartenklick hinzufügen | Etappenverwaltung |
| UC-02 | Etappe per Ortssuche hinzufügen | Etappenverwaltung |
| UC-03 | Etappendatum bearbeiten | Etappenverwaltung |
| UC-04 | Einzelne Etappe löschen | Etappenverwaltung |
| UC-05 | Alle Etappen löschen | Etappenverwaltung |
| UC-06 | Etappe auf Karte markieren | Navigation |
| UC-07 | Wetterdaten abrufen (Forecast) | Wetter |
| UC-08 | Wetterdaten abrufen (Archiv) | Wetter |
| UC-09 | Historische Klimadaten anzeigen | Wetter |
| UC-10 | Tagesweise Wetterdetails anzeigen | Wetter |
| UC-11 | Reiseplan exportieren | Datenverwaltung |
| UC-12 | Reiseplan importieren | Datenverwaltung |
| UC-13 | Dark/Light Mode umschalten | Einstellungen |
| UC-14 | Etappen persistent speichern | System |

---

## 4. Use Cases – Detailbeschreibungen

---

### UC-01 · Etappe per Kartenklick hinzufügen

**Akteur:** Reisender
**Ziel:** Eine neue Reiseetappe an einem selbst gewählten Ort auf der Karte anlegen.

**Vorbedingungen:**
- App ist geöffnet, Karte ist sichtbar

**Hauptablauf:**
1. Reisender klickt auf einen beliebigen Punkt der Weltkarte
2. System speichert die GPS-Koordinaten (Lat/Lng) als `pendingCoordinates`
3. Das Etappen-Formular öffnet sich in der Sidebar
4. System führt automatisch ein Reverse-Geocoding durch → Ortsname wird im Formularfeld vorausgefüllt
5. Reisender prüft / korrigiert den Ortsnamen
6. Reisender wählt Ankunfts- und Abreisedatum über den DateRangePicker
7. Reisender klickt auf „Etappe speichern"
8. System validiert die Eingaben
9. System fügt die Etappe zur Liste hinzu, Formular schließt sich
10. Auf der Karte erscheint ein Marker an der gewählten Position
11. Wetterdaten werden automatisch im Hintergrund geladen (→ UC-07/08/09)
12. System speichert Etappe in localStorage

**Alternativablauf A – Reverse-Geocoding schlägt fehl:**
- Im Schritt 4 erscheint eine Warnmeldung „Ort nicht erkannt"
- Koordinaten werden als vorausgefüllter Name verwendet (z.B. `48.8566, 2.3522`)
- Ein „Retry"-Button ermöglicht einen erneuten Versuch
- Reisender kann den Namen manuell eingeben oder die Ortssuche nutzen

**Alternativablauf B – Validierungsfehler:**
- Fehlendes Pflichtfeld: Fehlermeldung wird angezeigt, Formular bleibt offen
- Abreisedatum liegt vor Ankunftsdatum: Fehlermeldung „Abreise muss nach Ankunft liegen"

**Alternativablauf C – Formular abbrechen:**
- Klick auf „Abbrechen" oder das ✕-Icon schließt das Formular
- `pendingCoordinates` wird gelöscht, kein Marker wird gesetzt

**Nachbedingungen:**
- Etappe erscheint in der Sidebar-Liste und als Marker auf der Karte
- Wetterdaten werden asynchron nachgeladen

---

### UC-02 · Etappe per Ortssuche hinzufügen

**Akteur:** Reisender
**Ziel:** Eine Etappe über eine Texteingabe suchen, ohne die Karte anzuklicken.

**Vorbedingungen:**
- Etappen-Formular ist geöffnet (z.B. durch vorherigen Kartenklick)

**Hauptablauf:**
1. Reisender tippt mindestens 2 Zeichen in das Ortssuche-Feld
2. System wartet 350 ms (Debounce), dann wird die Open-Meteo Geocoding API abgefragt
3. Ein Dropdown zeigt bis zu 5 Suchergebnisse (Name, Region, Land)
4. Reisender wählt einen Eintrag aus dem Dropdown
5. Ortsname und Koordinaten werden in das Formular übernommen
6. Reisender setzt Datum und speichert die Etappe (→ UC-01, Schritte 6–12)

**Alternativablauf – kein Ergebnis:**
- Dropdown zeigt „Kein Ort gefunden"

**Nachbedingungen:**
- Karte springt zum gewählten Ort (Marker wird gesetzt)

---

### UC-03 · Etappendatum bearbeiten

**Akteur:** Reisender
**Ziel:** Ankunfts- und/oder Abreisedatum einer bestehenden Etappe ändern.

**Vorbedingungen:**
- Mindestens eine Etappe existiert

**Hauptablauf:**
1. Reisender klickt auf das Bleistift-Icon (✏️) in der StageCard
2. Ein Inline-Edit-Panel öffnet sich unterhalb des Etappennamens
3. DateRangePicker zeigt aktuelle Werte vorausgefüllt
4. Reisender ändert Ankunfts- und/oder Abreisedatum
5. Reisender klickt auf ✓ (Speichern)
6. System validiert: Abreise ≥ Ankunft
7. System aktualisiert die Etappe im Store und in localStorage
8. Wetterdaten werden automatisch neu geladen (QueryKey hat sich geändert)
9. Edit-Panel schließt sich, neue Daten werden sofort angezeigt

**Alternativablauf A – Validierungsfehler:**
- Fehlermeldung erscheint direkt unter dem DateRangePicker
- Speichern wird blockiert bis der Fehler behoben ist

**Alternativablauf B – Abbrechen:**
- Klick auf ✗ verwirft Änderungen, Edit-Panel schließt sich
- Ursprüngliche Daten bleiben unverändert

**Alternativablauf C – Klick auf Karte während Edit:**
- Karten-Klick wird ignoriert (Propagation gestoppt)

**Nachbedingungen:**
- Etappe hat neue Daten, Wetterdaten entsprechen dem neuen Zeitraum

---

### UC-04 · Einzelne Etappe löschen

**Akteur:** Reisender
**Ziel:** Eine bestimmte Etappe dauerhaft entfernen.

**Vorbedingungen:**
- Mindestens eine Etappe existiert

**Hauptablauf:**
1. Reisender klickt auf das Papierkorb-Icon (🗑️) in der StageCard
2. System entfernt die Etappe sofort aus Store und localStorage
3. Marker auf der Karte verschwindet
4. Falls die Etappe ausgewählt war, wird die Auswahl aufgehoben

**Hinweis:** Kein Bestätigungs-Dialog – Aktion ist sofort wirksam.

**Nachbedingungen:**
- Etappe ist aus Liste und Karte entfernt

---

### UC-05 · Alle Etappen löschen

**Akteur:** Reisender
**Ziel:** Den gesamten Reiseplan zurücksetzen.

**Vorbedingungen:**
- Mindestens eine Etappe existiert (Button ist sonst deaktiviert)

**Hauptablauf:**
1. Reisender klickt auf den Löschen-Button (🗑️ in TripActions, oben in Sidebar)
2. System zeigt einen Browser-Bestätigungs-Dialog: „Alle N Etappe(n) löschen?"
3. Reisender bestätigt mit „OK"
4. Alle Etappen werden aus Store und localStorage entfernt
5. Alle Marker verschwinden von der Karte
6. Sidebar zeigt „Noch keine Etappen"

**Alternativablauf – Abbrechen:**
- Reisender klickt „Abbrechen" im Dialog → keine Änderung

**Nachbedingungen:**
- Store ist leer, localStorage-Eintrag ist geleert

---

### UC-06 · Etappe auf Karte markieren

**Akteur:** Reisender
**Ziel:** Eine Etappe hervorheben, um sie auf der Karte und in der Sidebar visuell zu identifizieren.

**Vorbedingungen:**
- Mindestens eine Etappe existiert

**Hauptablauf:**
1. Reisender klickt auf eine StageCard in der Sidebar
2. Die Karte hebt den entsprechenden Marker hervor
3. Die StageCard erhält einen blauen Rahmen (`border-blue-400`) und blauen Hintergrund
4. Ein erneuter Klick auf dieselbe Karte hebt die Auswahl wieder auf

**Nachbedingungen:**
- Genau eine Etappe ist ausgewählt (oder keine)

---

### UC-07 · Wetterdaten abrufen (Forecast)

**Akteur:** System (automatisch nach UC-01/02/03)
**Ziel:** Aktuelle oder zukünftige Wetterdaten für eine Etappe laden.

**Vorbedingungen:**
- Etappe wurde angelegt oder aktualisiert
- Etappenzeitraum liegt innerhalb der letzten 6 Tage bis 16 Tage in der Zukunft

**Hauptablauf:**
1. System ruft `determineWeatherSource()` auf → Ergebnis: `forecast` oder `mixed`
2. React Query prüft Cache (QueryKey: Koordinaten + Datum)
3. Bei Cache-Miss: HTTP-Request an `api.open-meteo.com/v1/forecast`
4. Parameter: `temperature_2m_max`, `temperature_2m_min`, `precipitation_sum`, `weather_code`, `windspeed_10m_max`
5. Antwort wird geparst und als `DailyWeather[]` gespeichert
6. Wetterdaten werden in der StageCard angezeigt
7. Cache gilt 1 Stunde (`staleTime: 3600000`)

**Alternativablauf – Netzwerkfehler:**
- React Query wiederholt den Request bis zu 2× (`retry: 2`)
- Bei dauerhaftem Fehler: Fehlermeldung in der StageCard

**Datenquelle:** `api.open-meteo.com/v1/forecast`

---

### UC-08 · Wetterdaten abrufen (Archiv)

**Akteur:** System (automatisch nach UC-01/02/03)
**Ziel:** Historische Wetterdaten für vergangene Etappen laden.

**Vorbedingungen:**
- Etappenzeitraum liegt mehr als 6 Tage in der Vergangenheit

**Hauptablauf:**
1. System ruft `determineWeatherSource()` auf → Ergebnis: `archive`
2. HTTP-Request an `archive-api.open-meteo.com/v1/archive`
3. Verarbeitung identisch zu UC-07
4. Cache gilt 1 Stunde

**Technische Besonderheit:** Die Archiv-API hat eine Verzögerung von ~5 Tagen. Daten der letzten 6 Tage werden daher über die Forecast-API geladen (UC-07).

**Gemischter Zeitraum (mixed):** Liegt der Zeitraum einer Etappe teils in der Vergangenheit (> 6 Tage) und teils in der Zukunft (≤ 16 Tage), werden beide APIs parallel abgefragt. Überlappende Daten werden nach Datum dedupliziert und sortiert.

**Datenquelle:** `archive-api.open-meteo.com/v1/archive`

---

### UC-09 · Historische Klimadaten anzeigen

**Akteur:** System (automatisch nach UC-01/02/03)
**Ziel:** Typische Klimawerte als Orientierung für weit in der Zukunft liegende Etappen bereitstellen.

**Vorbedingungen:**
- Etappe liegt mehr als 16 Tage in der Zukunft (außerhalb Forecast-Reichweite)

**Hauptablauf:**
1. System ruft `determineWeatherSource()` auf → Ergebnis: `historical_avg`
2. System ruft `fetchHistoricalAverageForStage()` auf
3. Für die letzten 5 Jahre wird derselbe Datumsbereich parallel über die Archiv-API abgefragt (`Promise.all`)
4. Jahre ohne verfügbare Daten werden übersprungen
5. Für jeden Tag werden Mittelwerte berechnet:
   - Temperatur Max/Min: arithmetisches Mittel
   - Niederschlag: arithmetisches Mittel
   - Windgeschwindigkeit: arithmetisches Mittel
   - Wettercode: häufigster WMO-Code (`mostCommonCode()`)
6. Daten werden als normale `DailyWeather[]` in der StageCard angezeigt
7. Ein **Amber-Banner** erscheint oberhalb der Wetterdaten: „📊 Ø Klimadaten (letzte 5 Jahre) – kein Forecast für diesen Zeitraum verfügbar."
8. Cache gilt 7 Tage (`staleTime: 604800000`)

**Datenquelle:** `archive-api.open-meteo.com/v1/archive` (5× parallel)

---

### UC-10 · Tagesweise Wetterdetails anzeigen

**Akteur:** Reisender
**Ziel:** Detaillierte Wetterdaten für jeden einzelnen Tag einer Etappe einsehen.

**Vorbedingungen:**
- Wetterdaten wurden erfolgreich geladen (UC-07/08/09)

**Hauptablauf:**
1. In der StageCard wird eine Kurzübersicht angezeigt (dominanter Wettercode, Ø Temp. max/min, Gesamt-Niederschlag)
2. Reisender klickt auf „▼ Tagesdetails anzeigen"
3. Eine aufklappbare Detailansicht erscheint mit einer Zeile pro Tag:
   - Datum (kurz: „10. Mär")
   - Wettericon (WMO-Code → lucide-react Icon)
   - Wetterbeschreibung (z.B. „Leichter Regen")
   - Temperatur Max (orange) / Min (blau)
   - Niederschlag in mm (nur wenn > 0)
   - Windgeschwindigkeit in km/h (nur wenn > 0)
4. Klick auf „▲ Tagesdetails ausblenden" klappt die Ansicht wieder ein

**Nachbedingungen:**
- Expand-State wird nicht persistiert (bei Neuladen eingeklappt)

---

### UC-11 · Reiseplan exportieren

**Akteur:** Reisender
**Ziel:** Alle aktuellen Etappen als JSON-Datei lokal speichern.

**Vorbedingungen:**
- Mindestens eine Etappe existiert (Button ist sonst deaktiviert)

**Hauptablauf:**
1. Reisender klickt auf den Download-Button (↓) in der Sidebar
2. System erstellt ein JSON-Objekt mit:
   - `version: 1`
   - `exportedAt`: aktueller Timestamp
   - `stages`: alle Etappen ohne gecachte Wetterdaten
3. Browser-Download wird ausgelöst
4. Dateiname: `tripwetter-YYYY-MM-DD.json`

**Exportformat:**
```json
{
  "version": 1,
  "exportedAt": 1741600000000,
  "stages": [
    {
      "id": "uuid",
      "name": "Paris, Île-de-France, Frankreich",
      "coordinates": { "lat": 48.8566, "lng": 2.3522 },
      "arrivalDate": "2026-06-15",
      "departureDate": "2026-06-20",
      "createdAt": 1741600000000
    }
  ]
}
```

---

### UC-12 · Reiseplan importieren

**Akteur:** Reisender
**Ziel:** Einen zuvor exportierten Reiseplan wiederherstellen.

**Vorbedingungen:**
- Eine gültige TripWetter-JSON-Datei ist vorhanden

**Hauptablauf:**
1. Reisender klickt auf den Upload-Button (↑) in der Sidebar
2. Nativer Datei-Dialog öffnet sich (nur `.json` erlaubt)
3. Reisender wählt die Datei aus
4. System liest die Datei als Text und parst das JSON
5. System prüft: `data.stages` ist ein Array
6. Etappen werden in den Store importiert (bestehende Etappen werden ersetzt)
7. Karte aktualisiert sich mit den neuen Markern
8. Wetterdaten werden für alle importierten Etappen neu geladen

**Alternativablauf – ungültiges Dateiformat:**
- Browser-Alert: „Ungültiges Dateiformat."

**Alternativablauf – Lesefehler:**
- Browser-Alert: „Fehler beim Lesen der Datei."

---

### UC-13 · Dark/Light Mode umschalten

**Akteur:** Reisender
**Ziel:** Zwischen hellem und dunklem Farbschema wechseln.

**Vorbedingungen:**
- App ist geöffnet

**Hauptablauf:**
1. Reisender klickt auf den 🌙/☀️-Button oben rechts in der Sidebar
2. System wechselt den Modus:
   - Fügt `.dark`-Klasse zum `<html>`-Element hinzu (oder entfernt sie)
   - Speichert Präferenz in localStorage (`theme: 'dark'` oder `'light'`)
3. Alle Tailwind-`dark:`-Varianten werden sofort aktiv
4. Icon wechselt: 🌙 im Hellmodus → ☀️ im Dunkmodus

**Erstkonfiguration (System-Präferenz):**
- Beim ersten Öffnen der App wird geprüft: `window.matchMedia('(prefers-color-scheme: dark)')`
- Falls das Betriebssystem Dark Mode aktiv hat, startet die App im Dark Mode
- Sobald der Nutzer manuell umschaltet, überschreibt localStorage die Systemeinstellung

**Nachbedingungen:**
- Modus bleibt nach Neuladen und zwischen Sitzungen erhalten

---

### UC-14 · Etappen persistent speichern

**Akteur:** System (automatisch)
**Ziel:** Sicherstellen, dass Etappen nach einem Neuladen der Seite erhalten bleiben.

**Hauptablauf:**
1. Bei jeder Änderung des Zustand-Stores (Hinzufügen, Bearbeiten, Löschen) schreibt die Zustand-`persist`-Middleware automatisch den aktuellen State in localStorage
2. Key: `tripwetter-storage`
3. Beim nächsten Laden der App liest Zustand den gespeicherten State aus und initialisiert den Store damit
4. Wetterdaten werden nicht persistiert (nur Etappendaten) – sie werden bei Bedarf neu geladen

**Technischer Hinweis:**
- Zustand `persist` Middleware mit `version: 1`
- Gespeichert werden: `stages[]`, `selectedStageId`, `pendingCoordinates`, `isFormOpen`
- Nicht gespeichert: gecachte Wetterdaten (werden via React Query neu geladen)

---

## 5. Datenmodell

### TripStage
```typescript
interface TripStage {
  id: string;             // crypto.randomUUID()
  name: string;           // "Paris, Île-de-France, Frankreich"
  coordinates: {
    lat: number;          // 48.8566
    lng: number;          // 2.3522
  };
  arrivalDate: string;    // "YYYY-MM-DD"
  departureDate: string;  // "YYYY-MM-DD"
  weather?: StageWeather; // optional, gecacht
  createdAt: number;      // Unix-Timestamp ms
}
```

### StageWeather
```typescript
interface StageWeather {
  dailyForecasts: DailyWeather[];
  fetchedAt: number;
  source: 'forecast' | 'archive' | 'mixed' | 'historical_avg';
}
```

### DailyWeather
```typescript
interface DailyWeather {
  date: string;           // "YYYY-MM-DD"
  temperatureMax: number; // °C
  temperatureMin: number; // °C
  precipitationSum: number; // mm
  weatherCode: number;    // WMO-Code
  windspeedMax: number;   // km/h
}
```

---

## 6. Wetter-Datenquellen-Logik

```
determineWeatherSource(arrivalDate, departureDate):

  archiveCutoff  = heute − 6 Tage
  maxForecast    = heute + 16 Tage

  if arrival > maxForecast          → 'historical_avg'
  if departure < archiveCutoff      → 'archive'
  if arrival >= today               → 'forecast'
  else                              → 'mixed'
```

---

## 7. Nicht-funktionale Anforderungen

| Anforderung | Beschreibung |
|---|---|
| **Offline-Fähigkeit** | Nicht vorgesehen – Wetterdaten und Karte benötigen Internetverbindung |
| **Responsiveness** | Optimiert für Desktop-Browser (Sidebar + Karte nebeneinander) |
| **Performance** | Wetterdaten werden gecacht (1h / 7 Tage), Geocoding debounced (350ms) |
| **Datenschutz** | Keine Nutzerdaten werden an Server gesendet; Koordinaten gehen an Open-Meteo |
| **Barrierefreiheit** | Native HTML-Inputs, semantische Elemente, Tastatur-Navigation teilweise möglich |
| **Browser-Support** | Moderne Browser (Chrome, Firefox, Safari, Edge – aktuelle Versionen) |
| **SSR** | Leaflet-Karte ist SSR-deaktiviert (`dynamic import, ssr: false`) |

---

## 8. Bekannte Einschränkungen

| Einschränkung | Beschreibung |
|---|---|
| Forecast-Horizont | Maximal 16 Tage; darüber hinaus nur Klimadurchschnitte |
| Archiv-Verzögerung | Open-Meteo Archive-API hat ~5 Tage Verzögerung |
| Klimadaten-Qualität | Durchschnitt über 5 Jahre – keine Garantie für Einzeljahr-Extremwerte |
| Kein Multi-Trip | Aktuell wird nur eine Reise verwaltet |
| Keine Sortierung | Etappen werden nach Ankunftsdatum sortiert, nicht manuell verschiebbar |
| Kein Undo | Gelöschte Etappen können nicht wiederhergestellt werden (außer per Import) |
