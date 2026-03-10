# 🌤️ TripWetter

Reiseplanung mit automatischen Wetterdaten – für jede Etappe deiner Reise.

**Live-Demo**: [tripwetter.vercel.app](https://tripwetter.vercel.app)

---

## Was ist TripWetter?

TripWetter ist eine Web-App, mit der du Reiseetappen auf einer interaktiven Karte einträgst und automatisch passende Wetterdaten bekommst – egal ob die Etappe in der Vergangenheit liegt, heute stattfindet oder weit in der Zukunft geplant ist.

Die App läuft vollständig im Browser, braucht kein Backend und keinen API-Key.

---

## Features

- **Interaktive Weltkarte** – Klick auf die Karte, um eine neue Etappe hinzuzufügen
- **Ortssuche** – Geocoding-Suche mit Autovervollständigung
- **Automatische Wetterdaten** je nach Zeitraum:
  - 🔮 **Forecast** – bis 16 Tage in die Zukunft
  - 🗃️ **Archiv** – historische Wetterdaten für vergangene Etappen
  - 📊 **Klimadurchschnitte** – für Etappen weit in der Zukunft (> 16 Tage): Ø der letzten 5 Jahre mit Hinweis-Banner
- **Datum bearbeiten** – Ankunfts- und Abreisedatum bestehender Etappen inline ändern (Bleistift-Icon)
- **Tagesweise Detailansicht** – Temperatur, Niederschlag, Windgeschwindigkeit, Wettericon
- **🌙 Dark Mode** – Schalter in der Sidebar, Präferenz wird gespeichert (System-Einstellung als Fallback)
- **Lokale Persistenz** – Etappen bleiben nach dem Neuladen erhalten (localStorage)
- **Export / Import** – Reiseplan als JSON sichern und wiederherstellen
- **Kein Account nötig** – alles läuft im Browser

---

## Screenshots

| Hell-Modus | Dunkel-Modus |
|---|---|
| Sidebar mit Etappen, Wetterdaten und Karte | Identische Ansicht im Dark Mode |

---

## Tech-Stack

| Technologie | Zweck |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework (App Router, TypeScript) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling inkl. Dark Mode |
| [react-leaflet](https://react-leaflet.js.org/) | Interaktive Karte |
| [Open-Meteo API](https://open-meteo.com/) | Wetterdaten (kostenlos, kein API-Key) |
| [Zustand](https://zustand-demo.pmnd.rs/) | State Management + localStorage |
| [@tanstack/react-query](https://tanstack.com/query) | Wetter-Fetching & Caching |
| [lucide-react](https://lucide.dev/) | Icons |

---

## Lokale Installation

```bash
# Repository klonen
git clone https://github.com/DrPiet/TripWetter.git
cd TripWetter

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## Wie funktioniert die Wetter-Logik?

TripWetter wählt automatisch den optimalen Datenpfad je nach Etappenzeitraum:

```
Etappe > 16 Tage in Zukunft   →  📊 Klimadurchschnitte (Ø 5 Jahre, 7 Tage gecacht)
Etappe innerhalb 16 Tage      →  🔮 Open-Meteo Forecast-API
Etappe in letzten 6 Tagen     →  🔮 Forecast-API (Archiv hat ~5 Tage Verzögerung)
Etappe weiter in Vergangenheit →  🗃️ Open-Meteo Archive-API
Gemischt (Übergang)           →  🔀 Beide APIs kombiniert & dedupliziert
```

Forecast- und Archivdaten werden **1 Stunde** gecacht, Klimadurchschnitte **7 Tage**.

---

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css         # Tailwind + Leaflet CSS + Dark Mode Variant
├── components/
│   ├── map/                # Leaflet-Karte (SSR-sicher via dynamic import)
│   ├── trip/               # Sidebar, StageCard (mit Inline-Edit), StageForm
│   ├── weather/            # WeatherSummary, WeatherDetail, Icons, Badge
│   └── ui/                 # DateRangePicker, LocationSearch, LoadingSpinner
├── hooks/
│   ├── useTrip.ts          # Zustand Store (stages, pendingCoords, selectedId)
│   ├── useWeather.ts       # React Query + automatische Datenquellen-Auswahl
│   ├── useTheme.ts         # Dark/Light Mode mit localStorage-Persistenz
│   └── useGeocoding.ts     # Ortssuche mit Debounce
├── lib/
│   ├── api/
│   │   ├── openmeteo.ts    # Forecast, Archive & fetchHistoricalAverageForStage()
│   │   ├── geocoding.ts    # Ortssuche + Reverse Geocoding
│   │   └── weatherCodes.ts # WMO-Code → Label/Icon Mapping
│   └── utils/
│       ├── dateUtils.ts    # determineWeatherSource(), formatDate, etc.
│       └── weatherUtils.ts # Aggregation (dominantCode, Mittelwerte)
└── types/
    ├── trip.ts             # TripStage, DailyWeather, StageWeather
    └── weather.ts          # Open-Meteo API Response Typen
```

---

## Deployment

Die App ist mit [Vercel](https://vercel.com/) verbunden. Jeder Push auf `main` löst automatisch ein neues Deployment aus.

---

## Lizenz

MIT
