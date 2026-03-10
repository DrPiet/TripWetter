export interface OpenMeteoDailyResponse {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weather_code: number[];
  windspeed_10m_max: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  daily: OpenMeteoDailyResponse;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface OpenMeteoGeocodingResponse {
  results?: GeocodingResult[];
}
