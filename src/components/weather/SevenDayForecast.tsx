import { Cloud, CloudRain, Sun, CloudSun, CloudFog, CloudSnow, CloudLightning, CloudDrizzle, Wind, Umbrella, LucideIcon } from 'lucide-react';
import { getWindDirection, getWeatherIcon, type SevenDayItem, type WeatherRawData } from '../../lib/weatherApi';

interface SevenDayForecastProps {
  todayData: {
    time: string;
    weather_code: number;
    weather_description: string;
    raw_data: WeatherRawData;
  };
  forecastData: SevenDayItem[];
}

export default function SevenDayForecast({ todayData, forecastData }: SevenDayForecastProps) {
  // Icon map for converting icon name to component
  const iconMap: Record<string, LucideIcon> = {
    Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning
  };

  // Get icon component based on weather_code (now available for all days!)
  const getIconComponent = (weatherCode: number): LucideIcon => {
    const iconName = getWeatherIcon(weatherCode);
    return iconMap[iconName] || Cloud;
  };

  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Tomorrow';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const TodayIcon = getIconComponent(todayData.weather_code);

  return (
    <div className="space-y-6">
      {/* Today Card - Using today_forecast data */}
      <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <TodayIcon className="w-16 h-16 mb-4 opacity-80" />
            <p className="text-5xl font-bold mb-2">
              {Math.round(todayData.raw_data.temperature_2m_max || 0)} / {Math.round(todayData.raw_data.temperature_2m_min || 0)}°C
            </p>
            <p className="text-xl opacity-90">
              {todayData.weather_description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="opacity-75 text-sm">Feels Like:</p>
              <p className="text-2xl font-semibold">{Math.round(todayData.raw_data.apparent_temperature_max || 0)}°C</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Wind Gust:</p>
              <p className="text-2xl font-semibold">{Math.round(todayData.raw_data.wind_gusts_10m_mean || 0)} km/h</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Precipitation:</p>
              <p className="text-2xl font-semibold">Rain: {(todayData.raw_data.precipitation_sum || 0).toFixed(1)}mm</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Wind:</p>
              <p className="text-2xl font-semibold">
                {Math.round(todayData.raw_data.wind_speed_10m_mean || 0)} km/h {getWindDirection(todayData.raw_data.winddirection_10m_dominant || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Day Forecast List - Today + 7 next days */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">8-Day Extended Forecast</h3>
        <div className="space-y-3">
          {/* Today Row */}
          <div className="flex items-center gap-4 p-4 rounded-lg transition-colors bg-blue-50 border-l-4 border-blue-500">
            <div className="min-w-fit">
              <p className="font-semibold text-blue-600">Today</p>
              <p className="text-sm text-gray-600">{formatDate(todayData.time)}</p>
            </div>

            <TodayIcon className="w-8 h-8 text-gray-400 mx-2" />

            <div className="flex-1">
              <p className="font-medium text-gray-900">{todayData.weather_description}</p>
            </div>

            <div className="flex items-center gap-2 min-w-fit">
              <div className="flex gap-1 w-24">
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-12">{Math.round(todayData.raw_data.temperature_2m_max || 0)}°</span>
              <span className="text-sm text-gray-600 w-12">{Math.round(todayData.raw_data.temperature_2m_min || 0)}°</span>
            </div>

            <div className="flex items-center gap-4 min-w-fit pl-4 border-l border-gray-200">
              <div className="text-center text-sm">
                <Umbrella className="w-4 h-4 inline mr-1 text-blue-500" />
                <span className="text-gray-600">{(todayData.raw_data.precipitation_sum || 0).toFixed(1)}mm</span>
              </div>
              <div className="text-center text-sm">
                <Wind className="w-4 h-4 inline mr-1 text-gray-500" />
                <span className="text-gray-600">{Math.round(todayData.raw_data.wind_speed_10m_mean || 0)} km/h {getWindDirection(todayData.raw_data.winddirection_10m_dominant || 0)}</span>
              </div>
            </div>
          </div>

          {/* Next 7 Days */}
          {forecastData.map((day, index) => {
            const Icon = getIconComponent(day.weather_code);
            const dayName = getDayName(day.time, index);
            const dateFormatted = formatDate(day.time);
            const windDir = getWindDirection(day.winddirection_10m_dominant);
            
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50"
              >
                <div className="min-w-fit">
                  <p className="font-semibold text-gray-900">{dayName}</p>
                  <p className="text-sm text-gray-600">{dateFormatted}</p>
                </div>

                <Icon className="w-8 h-8 text-gray-400 mx-2" />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{day.weather_description}</p>
                </div>

                <div className="flex items-center gap-2 min-w-fit">
                  <div className="flex gap-1 w-24">
                    <div className="flex-1 h-2 rounded-full" style={{
                      background: `linear-gradient(to right, #fbbf24 0%, #f59e0b ${((day.temperature_2m_min - 15) / 15) * 100}%, #000 100%)`
                    }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{Math.round(day.temperature_2m_max)}°</span>
                  <span className="text-sm text-gray-600 w-12">{Math.round(day.temperature_2m_min)}°</span>
                </div>

                <div className="flex items-center gap-4 min-w-fit pl-4 border-l border-gray-200">
                  <div className="text-center text-sm">
                    <Umbrella className="w-4 h-4 inline mr-1 text-blue-500" />
                    <span className="text-gray-600">{day.precipitation_sum.toFixed(1)}mm</span>
                  </div>
                  <div className="text-center text-sm">
                    <Wind className="w-4 h-4 inline mr-1 text-gray-500" />
                    <span className="text-gray-600">{Math.round(day.wind_speed_10m_mean)} km/h {windDir}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

