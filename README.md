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
  - 📊 **Klimadurchschnitte** – für Etappen weit in der Zukunft (> 16 Tage): Durchschnitt der letzten 5 Jahre
- **Tagesweise Detailansicht** – Temperatur, Niederschlag, Windgeschwindigkeit, Wettericon
- **Lokale Persistenz** – Etappen bleiben nach dem Neuladen erhalten (localStorage)
- **Kein Account nötig** – alles läuft im Browser

---

## Tech-Stack

| Technologie | Zweck |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework (App Router, TypeScript) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
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
Etappe > 16 Tage in Zukunft  →  📊 Klimadurchschnitte (5 Jahre)
Etappe innerhalb 16 Tage     →  🔮 Open-Meteo Forecast-API
Etappe in letzten 6 Tagen    →  🔮 Forecast-API (Archiv hat ~5 Tage Delay)
Etappe weiter in Vergangenheit → 🗃️ Open-Meteo Archive-API
Gemischt (Übergang)          →  🔀 Beide APIs kombiniert
```

Alle Anfragen werden 1 Stunde gecacht (Klimadaten 7 Tage).

---

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── map/                # Leaflet-Karte (SSR-sicher)
│   ├── trip/               # Sidebar, StageCard, StageForm
│   ├── weather/            # WeatherSummary, WeatherDetail, Icons
│   └── ui/                 # DateRangePicker, LocationSearch, etc.
├── hooks/
│   ├── useTrip.ts          # Zustand Store
│   ├── useWeather.ts       # React Query + Datenquellen-Auswahl
│   └── useGeocoding.ts     # Ortssuche mit Debounce
├── lib/
│   ├── api/
│   │   ├── openmeteo.ts    # Forecast, Archive, Klimadurchschnitte
│   │   ├── geocoding.ts    # Ortssuche
│   │   └── weatherCodes.ts # WMO-Code → Label/Icon
│   └── utils/
│       ├── dateUtils.ts    # Datumshilfen, determineWeatherSource()
│       └── weatherUtils.ts # Aggregation
└── types/
    ├── trip.ts             # TripStage, DailyWeather, etc.
    └── weather.ts          # Open-Meteo API Response Typen
```

---

## Deployment

Die App ist mit [Vercel](https://vercel.com/) verbunden. Jeder Push auf `main` löst automatisch ein neues Deployment aus.

---

## Lizenz

MIT
