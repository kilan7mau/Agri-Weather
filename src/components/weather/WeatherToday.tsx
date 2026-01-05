import {
  Cloud,
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
  SunMedium,
  Tornado,
  LucideIcon,
} from 'lucide-react';

import { useCity } from '../../contexts/CityContext';
import { getWindDirection, getWeatherIcon, type DailyWeatherResponse } from '../../lib/weatherApi';

interface WeatherTodayProps {
  data: DailyWeatherResponse;
}

export default function WeatherToday({ data }: WeatherTodayProps) {
  const { selectedCity, coordinates } = useCity();
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
          <div className="space-y-2 text-base opacity-90">
            <p>Feels Like: {Math.round(raw_data.apparent_temperature_mean || 0)}°C</p>
            <p>Forecast: {Math.round(raw_data.temperature_2m_max || 0)} / {Math.round(raw_data.temperature_2m_min || 0)}°C</p>
            <p>Wind: {Math.round(raw_data.wind_speed_10m_mean || 0)} km/h from {windDir} </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Location Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">{selectedCity}</span>
            </div>
            {coordinates && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-medium text-gray-900">{coordinates.lat.toFixed(4)}°</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-medium text-gray-900">{coordinates.lon.toFixed(4)}°</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium text-gray-900">{currentTime}</span>
            </div>
            
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {coordinates ? (
            <iframe
              width="100%"
              height="100%"
              className="w-full h-full min-h-[280px]"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon-0.05},${coordinates.lat-0.05},${coordinates.lon+0.05},${coordinates.lat+0.05}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`}
              style={{ border: 0 }}
            ></iframe>
          ) : (
            <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M0,50 Q50,30 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"/>
                  <path d="M0,60 Q50,40 100,60 T200,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"/>
                </svg>
              </div>
              <div className="relative text-gray-500">Loading map...</div>
            </div>
          )}
        </div>
      </div>

      {/*Box Details*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/*Dew Point*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Dew Point</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.dew_point_2m_mean || 0)}°C</p>
        </div>
        {/*Precipitation*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Umbrella className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Precipitation</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(raw_data.precipitation_sum || 0).toFixed(1)} mm</p>
        </div>
        {/*Cloud Cover*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Cloud Cover</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(raw_data.cloud_cover_mean || 0).toFixed(1)} %</p>
        </div>
        {/*Humidity*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.relative_humidity_2m_mean || 0)}%</p>
        </div>
        {/*Wind Gust*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Tornado className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Wind Gust</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(raw_data.wind_gusts_10m_mean || 0).toFixed(1)} km/h</p>
        </div>
        {/*Pressure*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Pressure</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(raw_data.surface_pressure_mean || 0)} mbar</p>
        </div>
        {/*Daylight Duration*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CloudSun className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Daylight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{((raw_data.daylight_duration || 0) / 3600).toFixed(1)} h</p>
        </div>
        {/*Sunshine Duration*/}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <SunMedium className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Sunshine</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{((raw_data.sunshine_duration || 0) / 3600).toFixed(1)} h</p>
        </div>
      </div>
    </div>
  );
}
