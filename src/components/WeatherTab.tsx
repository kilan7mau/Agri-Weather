import { useState } from 'react';
import WeatherToday from './weather/WeatherToday';
import HourlyWeather from './weather/HourlyWeather';
import SevenDayForecast from './weather/SevenDayForecast';

export default function WeatherTab() {
  const [activeWeatherTab, setActiveWeatherTab] = useState<'today' | 'hourly' | 'forecast'>('today');

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-gray-200">
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

      {activeWeatherTab === 'today' && <WeatherToday />}
      {activeWeatherTab === 'hourly' && <HourlyWeather />}
      {activeWeatherTab === 'forecast' && <SevenDayForecast />}
    </div>
  );
}
