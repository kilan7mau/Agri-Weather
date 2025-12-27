import { Cloud, Sun, CloudRain } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';

export default function HourlyWeather() {
  const { selectedCity } = useCity();
  const hourlyData = [
    { time: 'Now', hour: '01:00', temp: 22, condition: 'Clear', icon: Sun, humidity: 10, wind: 4, precipitation: 10 },
    { time: '02:00', hour: '02:00', temp: 23, condition: 'Partly Cloudy', icon: Cloud, humidity: 18, wind: 3, precipitation: 18 },
    { time: '03:00', hour: '03:00', temp: 24, condition: 'Clear', icon: Sun, humidity: 15, wind: 9, precipitation: 15 },
    { time: '04:00', hour: '04:00', temp: 25, condition: 'Light Rain', icon: CloudRain, humidity: 17, wind: 9, precipitation: 17 },
    { time: '05:00', hour: '05:00', temp: 25, condition: 'Partly Cloudy', icon: Cloud, humidity: 3, wind: 7, precipitation: 3 },
    { time: '06:00', hour: '06:00', temp: 26, condition: 'Clear', icon: Sun, humidity: 13, wind: 9, precipitation: 13 },
    { time: '07:00', hour: '07:00', temp: 26, condition: 'Partly Cloudy', icon: Cloud, humidity: 23, wind: 7, precipitation: 23 },
    { time: '08:00', hour: '08:00', temp: 26, condition: 'Clear', icon: Sun, humidity: 17, wind: 10, precipitation: 17 },
    { time: '09:00', hour: '09:00', temp: 25, condition: 'Cloudy', icon: Cloud, humidity: 8, wind: 7, precipitation: 8 },
    { time: '10:00', hour: '10:00', temp: 25, condition: 'Cloudy', icon: Cloud, humidity: 26, wind: 3, precipitation: 26 },
  ];

  const temperatureData = [22, 23, 24, 25, 25, 26, 26, 26, 25, 25, 24, 23];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {hourlyData.map((hour, index) => {
              const Icon = hour.icon;
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
                    {hour.time}
                  </p>
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${index === 0 ? 'text-white' : 'text-gray-400'}`} />
                  <p className={`text-2xl font-bold mb-1 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>
                    {hour.temp}°
                  </p>
                  <p className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>{hour.condition}</p>
                  <p className={`text-xs mt-1 ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
                    💧 {hour.humidity}%
                  </p>
                  <p className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
                    💨 {hour.wind}km/h
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
            {hourlyData.slice(0, 7).map((hour, index) => (
              <div key={index} className="flex items-center gap-3">
                <p className="text-sm font-medium text-gray-700 w-12">{hour.hour}</p>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full flex items-center justify-center transition-all"
                    style={{ width: `${hour.precipitation * 3.33}%` }}
                  >
                    {hour.precipitation > 15 && (
                      <span className="text-xs font-semibold text-white">{hour.precipitation}%</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 w-8 text-right">{hour.precipitation}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
