import { useState } from 'react';
import { Download } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import WeatherToday from './weather/WeatherToday';
import HourlyWeather from './weather/HourlyWeather';
import SevenDayForecast from './weather/SevenDayForecast';

export default function WeatherTab() {
  const [activeWeatherTab, setActiveWeatherTab] = useState<'today' | 'hourly' | 'forecast'>('today');
  const { weatherData, loading, error } = useWeather();

  // Function to download weather data as JSON
  const downloadJSON = () => {
    if (!weatherData) return;

    const dataStr = JSON.stringify(weatherData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weather-data-${weatherData.city}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !weatherData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">⚠️ Error loading weather data</p>
          <p className="text-gray-600 text-sm">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-gray-200 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveWeatherTab('today')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeWeatherTab === 'today'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Weather Today
          </button>
          <button
            onClick={() => setActiveWeatherTab('hourly')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeWeatherTab === 'hourly'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Hourly Weather
          </button>
          <button
            onClick={() => setActiveWeatherTab('forecast')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeWeatherTab === 'forecast'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            7-Day Forecast
          </button>
        </div>

        {/* Download JSON Button */}
        <button
          onClick={downloadJSON}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          title="Download weather data as JSON for debugging"
        >
          <Download className="w-4 h-4" />
          <span>Debug JSON</span>
        </button>
      </div>

      {activeWeatherTab === 'today' && (
        <WeatherToday 
          data={{
            city: weatherData.city,
            ...weatherData.today_forecast
          }} 
        />
      )}
      {activeWeatherTab === 'hourly' && <HourlyWeather data={weatherData.hourly_forecast} />}
      {activeWeatherTab === 'forecast' && (
        <SevenDayForecast 
          todayData={weatherData.today_forecast}
          forecastData={weatherData.seven_day_forecast}
        />
      )}
    </div>
  );
}
