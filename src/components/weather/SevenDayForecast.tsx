import { Cloud, CloudRain, Sun, Droplets, Wind } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';

export default function SevenDayForecast() {
  const { selectedCity } = useCity();
  const forecast = [
    {
      day: 'Today',
      date: 'Thu, 25',
      icon: CloudRain,
      condition: 'Partly Cloudy',
      high: 26,
      low: 22,
      rain: 11.8,
      humidity: 89,
      wind: 20,
      windDir: 'NE',
    },
    {
      day: 'Friday',
      date: 'Fri, 26',
      icon: CloudRain,
      condition: 'Rain',
      high: 23,
      low: 20,
      rain: 25.7,
      humidity: 92,
      wind: 15,
      windDir: 'E',
    },
    {
      day: 'Saturday',
      date: 'Sat, 27',
      icon: Cloud,
      condition: 'Partly Cloudy',
      high: 24,
      low: 19,
      rain: 0.1,
      humidity: 85,
      wind: 12,
      windDir: 'SE',
    },
    {
      day: 'Sunday',
      date: 'Sun, 28',
      icon: Sun,
      condition: 'Clear',
      high: 27,
      low: 21,
      rain: 0,
      humidity: 78,
      wind: 8,
      windDir: 'W',
    },
    {
      day: 'Monday',
      date: 'Mon, 29',
      icon: Cloud,
      condition: 'Partly Cloudy',
      high: 26,
      low: 20,
      rain: 2,
      humidity: 82,
      wind: 10,
      windDir: 'SW',
    },
    {
      day: 'Tuesday',
      date: 'Tue, 30',
      icon: Sun,
      condition: 'Clear',
      high: 28,
      low: 22,
      rain: 0,
      humidity: 75,
      wind: 6,
      windDir: 'W',
    },
    {
      day: 'Wednesday',
      date: 'Wed, 31',
      icon: Cloud,
      condition: 'Partly Cloudy',
      high: 25,
      low: 21,
      rain: 5,
      humidity: 80,
      wind: 9,
      windDir: 'NW',
    },
    {
      day: 'Thursday',
      date: 'Thu, 1',
      icon: Cloud,
      condition: 'Partly Cloudy',
      high: 25,
      low: 21,
      rain: 5,
      humidity: 80,
      wind: 9,
      windDir: 'NW',
    }  
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CloudRain className="w-16 h-16 mb-4 opacity-80" />
            <p className="text-5xl font-bold mb-2">26 / 22°C</p>
            <p className="text-xl opacity-90">Partly Cloudy</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="opacity-75 text-sm">Feels Like:</p>
              <p className="text-2xl font-semibold">24°C</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Humidity:</p>
              <p className="text-2xl font-semibold">89%</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Precipitation:</p>
              <p className="text-2xl font-semibold">Rain: 11.8mm</p>
            </div>
            <div>
              <p className="opacity-75 text-sm">Wind:</p>
              <p className="text-2xl font-semibold">20 km/h NE</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Extended Forecast</h3>
        <div className="space-y-3">
          {forecast.map((day, index) => {
            const Icon = day.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  index === 0 ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="min-w-fit">
                  <p className={`font-semibold ${index === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day.day}
                  </p>
                  <p className="text-sm text-gray-600">{day.date}</p>
                </div>

                <Icon className="w-8 h-8 text-gray-400 mx-2" />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{day.condition}</p>
                </div>

                <div className="flex items-center gap-2 min-w-fit">
                  <div className="flex gap-1 w-24">
                    <div className="flex-1 h-2 rounded-full" style={{
                      background: `linear-gradient(to right, #fbbf24 0%, #f59e0b ${((day.low - 15) / 15) * 100}%, #000 100%)`
                    }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{day.high}°</span>
                  <span className="text-sm text-gray-600 w-12">{day.low}°</span>
                </div>

                <div className="flex items-center gap-4 min-w-fit pl-4 border-l border-gray-200">
                  <div className="text-center text-sm">
                    <Droplets className="w-4 h-4 inline mr-1 text-blue-500" />
                    <span className="text-gray-600">{day.rain}mm</span>
                  </div>
                  <div className="text-center text-sm">
                    <Droplets className="w-4 h-4 inline mr-1 text-cyan-500" />
                    <span className="text-gray-600">{day.humidity}%</span>
                  </div>
                  <div className="text-center text-sm">
                    <Wind className="w-4 h-4 inline mr-1 text-gray-500" />
                    <span className="text-gray-600">{day.wind} km/h {day.windDir}</span>
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
