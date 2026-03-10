export interface WeatherCodeInfo {
  label: string;
  lucideIcon: string;
}

export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0:  { label: 'Klarer Himmel',          lucideIcon: 'Sun' },
  1:  { label: 'Überwiegend klar',        lucideIcon: 'Sun' },
  2:  { label: 'Teilweise bewölkt',       lucideIcon: 'CloudSun' },
  3:  { label: 'Bedeckt',                lucideIcon: 'Cloud' },
  45: { label: 'Nebel',                  lucideIcon: 'CloudFog' },
  48: { label: 'Gefrierender Nebel',     lucideIcon: 'CloudFog' },
  51: { label: 'Leichter Nieselregen',   lucideIcon: 'CloudDrizzle' },
  53: { label: 'Nieselregen',            lucideIcon: 'CloudDrizzle' },
  55: { label: 'Starker Nieselregen',    lucideIcon: 'CloudDrizzle' },
  56: { label: 'Gefrierender Nieselregen', lucideIcon: 'CloudDrizzle' },
  57: { label: 'Starker gefrierender Nieselregen', lucideIcon: 'CloudDrizzle' },
  61: { label: 'Leichter Regen',         lucideIcon: 'CloudRain' },
  63: { label: 'Regen',                  lucideIcon: 'CloudRain' },
  65: { label: 'Starker Regen',          lucideIcon: 'CloudRain' },
  66: { label: 'Gefrierender Regen',     lucideIcon: 'CloudRain' },
  67: { label: 'Starker gefrierender Regen', lucideIcon: 'CloudRain' },
  71: { label: 'Leichter Schneefall',    lucideIcon: 'CloudSnow' },
  73: { label: 'Schneefall',             lucideIcon: 'CloudSnow' },
  75: { label: 'Starker Schneefall',     lucideIcon: 'CloudSnow' },
  77: { label: 'Schneekörner',           lucideIcon: 'CloudSnow' },
  80: { label: 'Leichte Regenschauer',   lucideIcon: 'CloudRain' },
  81: { label: 'Regenschauer',           lucideIcon: 'CloudRain' },
  82: { label: 'Starke Regenschauer',    lucideIcon: 'CloudRain' },
  85: { label: 'Leichte Schneeschauer',  lucideIcon: 'CloudSnow' },
  86: { label: 'Starke Schneeschauer',   lucideIcon: 'CloudSnow' },
  95: { label: 'Gewitter',               lucideIcon: 'CloudLightning' },
  96: { label: 'Gewitter mit Hagel',     lucideIcon: 'CloudLightning' },
  99: { label: 'Schweres Gewitter',      lucideIcon: 'CloudLightning' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WMO_CODES[code] ?? { label: `Wettercode ${code}`, lucideIcon: 'HelpCircle' };
}
