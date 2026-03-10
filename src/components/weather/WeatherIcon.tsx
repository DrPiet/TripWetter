import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle,
} from 'lucide-react';
import { getWeatherInfo } from '@/lib/api/weatherCodes';

const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle,
};

interface Props {
  code: number;
  size?: number;
  className?: string;
}

export function WeatherIcon({ code, size = 20, className = '' }: Props) {
  const info = getWeatherInfo(code);
  const IconComponent = ICON_MAP[info.lucideIcon] ?? HelpCircle;

  return (
    <IconComponent
      size={size}
      className={className}
      aria-label={info.label}
      title={info.label}
    />
  );
}
