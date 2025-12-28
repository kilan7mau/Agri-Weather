import { Cloud, CloudRain, Sun, Droplets, Wind, CloudDrizzle, CloudSnow } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';
import { useState, useEffect } from 'react';
import { getSevenDayWeather, getWindDirection, type SevenDayWeatherResponse } from '../../lib/weatherApi';

export default function SevenDayForecast() {
  const { selectedCity } = useCity();
  const [weatherData, setWeatherData] = useState<SevenDayWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSevenDayWeather(selectedCity);
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

  const getWeatherIcon = (temp: number, precipitation: number) => {
    if (precipitation > 20) return CloudRain;
    if (precipitation > 5) return CloudDrizzle;
    if (temp < 0) return CloudSnow;
    if (temp > 30) return Sun;
    if (precipitation > 0) return Cloud;
    return Sun;
  };

  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const forecast = weatherData.predictions;
  const today = forecast[0];
  const todayIcon = getWeatherIcon(today.temperature_2m_max, today.precipitation_sum);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {(() => {
              const Icon = todayIcon;
              return <Icon className="w-16 h-16 mb-4 opacity-80" />;
            })()}
            <p className="text-5xl font-bold mb-2">
              {Math.round(today.temperature_2m_max)} / {Math.round(today.temperature_2m_min)}°C
            </p>
            <p className="text-xl opacity-90">
              {today.precipitation_sum > 20 ? 'Rainy' : today.precipitation_sum > 5 ? 'Partly Cloudy' : 'Clear'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="opacity-75 text-sm">Feels Like:</p>
              <p className="text-2xl font-semibold">{Math.round(today.apparent_temperature_max)}°C</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Wind Gust:</p>
              <p className="text-2xl font-semibold">{Math.round(today.wind_gusts_10m_max)} km/h</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Precipitation:</p>
              <p className="text-2xl font-semibold">Rain: {today.precipitation_sum.toFixed(1)}mm</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Wind:</p>
              <p className="text-2xl font-semibold">
                {Math.round(today.wind_speed_10m_max)} km/h {getWindDirection(today.wind_direction_10m_dominant)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Extended Forecast</h3>
        <div className="space-y-3">
          {forecast.map((day, index) => {
            const Icon = getWeatherIcon(day.temperature_2m_max, day.precipitation_sum);
            const dayName = getDayName(day.date, index);
            const dateFormatted = formatDate(day.date);
            const condition = day.precipitation_sum > 20 ? 'Rain' : day.precipitation_sum > 5 ? 'Partly Cloudy' : day.temperature_2m_max > 30 ? 'Hot & Clear' : 'Clear';
            const windDir = getWindDirection(day.wind_direction_10m_dominant);
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  index === 0 ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="min-w-fit">
                  <p className={`font-semibold ${index === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {dayName}
                  </p>
                  <p className="text-sm text-gray-600">{dateFormatted}</p>
                </div>

                <Icon className="w-8 h-8 text-gray-400 mx-2" />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{condition}</p>
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
                    <Droplets className="w-4 h-4 inline mr-1 text-blue-500" />
                    <span className="text-gray-600">{day.precipitation_sum.toFixed(1)}mm</span>
                  </div>
                  <div className="text-center text-sm">
                    <Wind className="w-4 h-4 inline mr-1 text-gray-500" />
                    <span className="text-gray-600">{Math.round(day.wind_speed_10m_max)} km/h {windDir}</span>
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
