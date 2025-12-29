import {
  Cloud,
  Wind,
  Droplets,
  Gauge,
  Umbrella,
  Sun,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LucideIcon,
} from 'lucide-react';

import { useCity } from '../../contexts/CityContext';
import { getWindDirection, getWeatherIcon, type DailyWeatherResponse } from '../../lib/weatherApi';

interface WeatherTodayProps {
  data: DailyWeatherResponse;
}

export default function WeatherToday({ data }: WeatherTodayProps) {
  const { selectedCity } = useCity();
  const currentTime = new Date().toLocaleString();

  const { raw_data, weather_description, weather_code } = data;
  const windDir = getWindDirection(raw_data.winddirection_10m_dominant || 0);
  
  // Get the appropriate weather icon component
  const iconName = getWeatherIcon(weather_code);
  const icons: Record<string, LucideIcon> = {
    Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning
  };
  const WeatherIcon = icons[iconName] || Cloud;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-5xl font-bold mb-2">{Math.round(raw_data.temperature_2m_mean || 0)}°C</h2>
              <p className="text-xl opacity-90">{weather_description}</p>
            </div>
            <WeatherIcon className="w-20 h-20 opacity-80" />
          </div>

          <div className="space-y-2 text-sm opacity-90">
            <p>Feels Like: {Math.round(raw_data.apparent_temperature_mean || 0)}°C</p>
            <p>Forecast: {Math.round(raw_data.temperature_2m_max || 0)} / {Math.round(raw_data.temperature_2m_min || 0)}°C</p>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>Wind: {Math.round(raw_data.wind_speed_10m_mean || 0)} km/h from {windDir}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Location Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">{selectedCity}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium text-gray-900">{currentTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Latest Report:</span>
              <span className="font-medium text-gray-900">{data.time}</span>
            </div>
            {/*<div className="flex justify-between py-2">*/}
            {/*  <span className="text-gray-600">Cloud Cover:</span>*/}
            {/*  <span className="font-medium text-gray-900">{Math.round(raw_data.cloud_cover_mean || 0)}%</span>*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Map Location</h3>
          <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M0,50 Q50,30 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"/>
                <path d="M0,60 Q50,40 100,60 T200,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"/>
              </svg>
            </div>
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Pressure</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.surface_pressure_mean || 0)} mbar</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.relative_humidity_2m_mean || 0)}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Dew Point</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.dew_point_2m_mean || 0)}°C</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Umbrella className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Precipitation</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(raw_data.precipitation_sum || 0).toFixed(1)} mm</p>
        </div>
      </div>
    </div>
  );
}
