import { Cloud, CloudRain, Sun, CloudSun, CloudFog, CloudSnow, CloudLightning, CloudDrizzle, Wind, Umbrella, Droplets, Gauge, Clock, LucideIcon } from 'lucide-react';
import { getWindDirection, getWeatherIcon, type SevenDayItem, type WeatherRawData } from '../../lib/weatherApi';
import { useState } from 'react';

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
  // State to track selected day (null = today, 0-6 = forecast days)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Get the currently selected day data
  const selectedDay = selectedDayIndex === null 
    ? todayData 
    : {
        time: forecastData[selectedDayIndex].time,
        weather_code: forecastData[selectedDayIndex].weather_code,
        weather_description: forecastData[selectedDayIndex].weather_description,
        raw_data: {
          temperature_2m_max: forecastData[selectedDayIndex].temperature_2m_max,
          temperature_2m_min: forecastData[selectedDayIndex].temperature_2m_min,
          temperature_2m_mean: forecastData[selectedDayIndex].temperature_2m_mean,
          apparent_temperature_max: forecastData[selectedDayIndex].apparent_temperature_max,
          apparent_temperature_min: forecastData[selectedDayIndex].apparent_temperature_min,
          apparent_temperature_mean: forecastData[selectedDayIndex].apparent_temperature_mean,
          wind_gusts_10m_mean: forecastData[selectedDayIndex].wind_gusts_10m_mean,
          precipitation_sum: forecastData[selectedDayIndex].precipitation_sum,
          wind_speed_10m_mean: forecastData[selectedDayIndex].wind_speed_10m_mean,
          winddirection_10m_dominant: forecastData[selectedDayIndex].winddirection_10m_dominant,
          dew_point_2m_mean: forecastData[selectedDayIndex].dew_point_2m_mean,
          cloud_cover_mean: forecastData[selectedDayIndex].cloud_cover_mean,
          relative_humidity_2m_mean: forecastData[selectedDayIndex].relative_humidity_2m_mean,
          surface_pressure_mean: forecastData[selectedDayIndex].surface_pressure_mean,
          pressure_msl_mean: forecastData[selectedDayIndex].pressure_msl_mean,
          daylight_duration: forecastData[selectedDayIndex].daylight_duration,
          sunshine_duration: forecastData[selectedDayIndex].sunshine_duration,
        } as WeatherRawData
      };

  // ...existing code...
  // Icon map for converting icon name to component
  const iconMap: Record<string, LucideIcon> = {
    Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning
  };

  // Get icon component based on weather_code (now available for all days!)
  const getIconComponent = (weatherCode: number): LucideIcon => {
    const iconName = getWeatherIcon(weatherCode);
    return iconMap[iconName] || Cloud;
  };

  // Helper function to generate temperature gradient bar based on actual temp
  const getTempGradient = (tempMax: number, tempMin: number) => {
    // Define color stops based on temperature
    const getColorForTemp = (temp: number) => {
      if (temp >= 35) return '#dc2626'; // red-600 (very hot)
      if (temp >= 30) return '#f59e0b'; // amber-500 (hot)
      if (temp >= 25) return '#fbbf24'; // yellow-400 (warm)
      if (temp >= 20) return '#10b981'; // emerald-500 (comfortable)
      if (temp >= 15) return '#3b82f6'; // blue-500 (cool)
      return '#6366f1'; // indigo-500 (cold)
    };

    const maxColor = getColorForTemp(tempMax);
    const minColor = getColorForTemp(tempMin);

    return `linear-gradient(to right, ${minColor} 0%, ${maxColor} 100%)`;
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

  const TodayIcon = getIconComponent(selectedDay.weather_code);

  return (
    <div className="space-y-6">
      {/* Selected Day Card - Dynamic based on selection */}
      <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <TodayIcon className="w-16 h-16 mb-4 opacity-80" />
            <p className="text-5xl font-bold mb-2">
              {Math.round(selectedDay.raw_data.temperature_2m_max || 0)} / {Math.round(selectedDay.raw_data.temperature_2m_min || 0)}°C
            </p>
            <p className="text-xl opacity-90">
              {selectedDay.weather_description}
            </p>
            {selectedDayIndex === null ? (
              <p className="text-sm opacity-75 mt-2">Today</p>
            ) : (
              <p className="text-sm opacity-75 mt-2">{getDayName(selectedDay.time, selectedDayIndex)}</p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <CloudSun className="w-4 h-4" />
                Feels Like:
              </p>
              <p className="text-2xl font-semibold">{Math.round(selectedDay.raw_data.apparent_temperature_max || 0)} / {Math.round(selectedDay.raw_data.apparent_temperature_min || 0)}°C</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Wind className="w-4 h-4" />
                Wind Gust:
              </p>
              <p className="text-2xl font-semibold">{Math.round(selectedDay.raw_data.wind_gusts_10m_mean || 0)} km/h</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Umbrella className="w-4 h-4" />
                Precipitation:
              </p>
              <p className="text-2xl font-semibold">{(selectedDay.raw_data.precipitation_sum || 0).toFixed(1)}mm</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Wind className="w-4 h-4" />
                Wind Speed:
              </p>
              <p className="text-2xl font-semibold">
                {Math.round(selectedDay.raw_data.wind_speed_10m_mean || 0)} km/h {getWindDirection(selectedDay.raw_data.winddirection_10m_dominant || 0)}
              </p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Cloud className="w-4 h-4" />
                Cloud Cover:
              </p>
              <p className="text-2xl font-semibold">{Math.round(selectedDay.raw_data.cloud_cover_mean || 0)}%</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Droplets className="w-4 h-4" />
                Humidity:
              </p>
              <p className="text-2xl font-semibold">{Math.round(selectedDay.raw_data.relative_humidity_2m_mean || 0)}%</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Gauge className="w-4 h-4" />
                Pressure:
              </p>
              <p className="text-2xl font-semibold">{Math.round(selectedDay.raw_data.surface_pressure_mean || 0)} mb</p>
            </div>
            <div>
              <p className="opacity-75 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Daylight:
              </p>
              <p className="text-2xl font-semibold">{((selectedDay.raw_data.daylight_duration || 0) / 3600).toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Day Forecast List - Today + 7 next days */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">8-Day Extended Forecast</h3>
        <div className="space-y-3">
          {/* Today Row */}
          <div 
            onClick={() => setSelectedDayIndex(null)}
            className={`grid grid-cols-[120px_40px_1fr_140px_200px] items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
              selectedDayIndex === null 
                ? 'bg-blue-100 border-l-4 border-blue-600 shadow-md' 
                : 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100'
            }`}
          >
            <div>
              <p className="font-semibold text-blue-600">Today</p>
              <p className="text-sm text-gray-600">{formatDate(todayData.time)}</p>
            </div>

            <TodayIcon className="w-8 h-8 text-gray-400" />

            <div>
              <p className="font-medium text-gray-900">{todayData.weather_description}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 w-24">
                <div 
                  className="flex-1 h-2 rounded-full" 
                  style={{ background: getTempGradient(todayData.raw_data.temperature_2m_max || 0, todayData.raw_data.temperature_2m_min || 0) }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-12">{Math.round(todayData.raw_data.temperature_2m_mean || 0)}°</span>
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex items-center text-sm">
                <Umbrella className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-gray-600">{(todayData.raw_data.precipitation_sum || 0).toFixed(1)}mm</span>
              </div>
              <div className="flex items-center text-sm">
                <Wind className="w-4 h-4 mr-1 text-gray-500" />
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
            const isSelected = selectedDayIndex === index;
            
            return (
              <div
                key={index}
                onClick={() => setSelectedDayIndex(index)}
                className={`grid grid-cols-[120px_40px_1fr_140px_200px] items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gray-100 shadow-md scale-[1.02]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{dayName}</p>
                  <p className="text-sm text-gray-600">{dateFormatted}</p>
                </div>

                <Icon className="w-8 h-8 text-gray-400" />

                <div>
                  <p className="font-medium text-gray-900">{day.weather_description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1 w-24">
                    <div 
                      className="flex-1 h-2 rounded-full" 
                      style={{ background: getTempGradient(day.temperature_2m_max, day.temperature_2m_min) }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{Math.round(day.temperature_2m_mean)}°</span>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center text-sm">
                    <Umbrella className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="text-gray-600">{day.precipitation_sum.toFixed(1)}mm</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Wind className="w-4 h-4 mr-1 text-gray-500" />
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

