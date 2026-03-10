export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isInPast(dateStr: string): boolean {
  return new Date(dateStr) < todayDate();
}

export function isWithinForecastRange(dateStr: string): boolean {
  const today = todayDate();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 16);
  const date = new Date(dateStr);
  return date >= today && date <= maxDate;
}

export function determineWeatherSource(
  arrivalDate: string,
  departureDate: string,
): 'forecast' | 'archive' | 'mixed' | 'out_of_range' {
  const today = todayDate();
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  const maxForecast = new Date(today);
  maxForecast.setDate(today.getDate() + 16);

  const allPast = departure < today;
  const allFuture = arrival >= today;
  const beyondForecast = arrival > maxForecast;

  if (allPast) return 'archive';
  if (allFuture && !beyondForecast) return 'forecast';
  if (allFuture && beyondForecast) return 'out_of_range';
  return 'mixed';
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

export function getDayCount(arrivalDate: string, departureDate: string): number {
  const a = new Date(arrivalDate);
  const d = new Date(departureDate);
  const diff = Math.ceil((d.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}
