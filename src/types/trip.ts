export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  weatherCode: number;
  windspeedMax: number;
}

export interface StageWeather {
  dailyForecasts: DailyWeather[];
  fetchedAt: number;
  source: 'forecast' | 'archive' | 'mixed' | 'out_of_range';
}

export interface TripStage {
  id: string;
  name: string;
  coordinates: Coordinates;
  arrivalDate: string;   // "YYYY-MM-DD"
  departureDate: string; // "YYYY-MM-DD"
  weather?: StageWeather;
  createdAt: number;
}

export interface Trip {
  id: string;
  name: string;
  stages: TripStage[];
  updatedAt: number;
}
