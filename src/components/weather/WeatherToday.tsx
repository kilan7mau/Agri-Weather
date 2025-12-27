import { Cloud, Wind, Droplets, Gauge, Eye } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';
import { getWeatherByCity } from '../../lib/weatherData';

export default function WeatherToday() {
  const { selectedCity } = useCity();
  const currentWeather = getWeatherByCity(selectedCity);
  const currentTime = new Date().toLocaleString();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-5xl font-bold mb-2">{currentWeather.temperature}°C</h2>
              <p className="text-xl opacity-90">{currentWeather.condition}</p>
            </div>
            <Cloud className="w-20 h-20 opacity-80" />
          </div>

          <div className="space-y-2 text-sm opacity-90">
            <p>Feels Like: {currentWeather.feelsLike}°C</p>
            <p>Forecast: {currentWeather.forecast.high} / {currentWeather.forecast.low}°C</p>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>Wind: {currentWeather.wind.speed} km/h from {currentWeather.wind.direction}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Location Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">{currentWeather.location}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium text-gray-900">{currentTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Latest Report:</span>
              <span className="font-medium text-gray-900">{currentTime}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Visibility:</span>
              <span className="font-medium text-gray-900">N/A</span>
            </div>
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
          <p className="text-2xl font-bold text-gray-900">{currentWeather.pressure} mbar</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentWeather.humidity}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Dew Point</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentWeather.dewPoint}°C</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Visibility</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">N/A</p>
        </div>
      </div>
    </div>
  );
}
