import { Cloud, Sun, CloudRain, CloudDrizzle, CloudSnow, CloudLightning } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';
import { useState, useEffect } from 'react';
import { getHourlyWeather, type HourlyWeatherResponse } from '../../lib/weatherApi';

export default function HourlyWeather() {
  const { selectedCity } = useCity();
  const [weatherData, setWeatherData] = useState<HourlyWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHourlyWeather(selectedCity);
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading weather data</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code >= 1 && code <= 3) return Cloud;
    if (code >= 45 && code <= 48) return Cloud;
    if (code >= 51 && code <= 57) return CloudDrizzle;
    if (code >= 61 && code <= 67) return CloudRain;
    if (code >= 71 && code <= 77) return CloudSnow;
    if (code >= 80 && code <= 86) return CloudRain;
    if (code >= 95 && code <= 99) return CloudLightning;
    return Cloud;
  };

  const formatTime = (timeStr: string, index: number) => {
    if (index === 0) return 'Now';
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const hourlyData = weatherData.predictions.slice(0, 10);
  const temperatureData = weatherData.predictions.slice(0, 12).map(h => Math.round(h.raw_data.temperature_2m_mean || h.raw_data.temperature_2m_max || 0));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {hourlyData.map((hour, index) => {
              const Icon = getWeatherIcon(hour.weather_code);
              const temp = Math.round(hour.raw_data.temperature_2m_mean || hour.raw_data.temperature_2m || hour.raw_data.apparent_temperature || 0);
              const humidity = Math.round(hour.raw_data.relative_humidity_2m_mean || hour.raw_data.relative_humidity_2m || 0);
              const wind = Math.round(hour.raw_data.wind_speed_10m_mean || hour.raw_data.wind_speed_10m || 0);
              
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-24 rounded-lg p-3 text-center transition-all ${
                    index === 0
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-2 ${index === 0 ? 'text-white' : 'text-gray-600'}`}>
                    {formatTime(hour.time, index)}
                  </p>
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${index === 0 ? 'text-white' : 'text-gray-400'}`} />
                  <p className={`text-2xl font-bold mb-1 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>
                    {temp}°
                  </p>
                  <p className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                    {hour.weather_description.split(':')[0]}
                  </p>
                  <p className={`text-xs mt-1 ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
                    💧 {humidity}%
                  </p>
                  <p className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
                    💨 {wind}km/h
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend</h3>
          <div className="h-48 flex items-end justify-around gap-2">
            {temperatureData.map((temp, index) => {
              const maxTemp = Math.max(...temperatureData);
              const minTemp = Math.min(...temperatureData);
              const height = ((temp - minTemp) / (maxTemp - minTemp)) * 100 + 20;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{temp}°</p>
                  <p className="text-xs text-gray-500">{String(index).padStart(2, '0')}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitation Chance</h3>
          <div className="space-y-3">
            {hourlyData.slice(0, 7).map((hour, index) => {
              const precipitation = Math.round(hour.raw_data.precipitation_sum || hour.raw_data.precipitation || 0);
              const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-700 w-12">{time}</p>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full flex items-center justify-center transition-all"
                      style={{ width: `${Math.min(precipitation * 3, 100)}%` }}
                    >
                      {precipitation > 5 && (
                        <span className="text-xs font-semibold text-white">{precipitation}mm</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 w-12 text-right">{precipitation}mm</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
