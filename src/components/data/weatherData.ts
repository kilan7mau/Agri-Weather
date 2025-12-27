export const currentWeather = {
  temperature: 23,
  condition: 'Passing clouds',
  feelsLike: 22,
  forecastHigh: 26,
  forecastLow: 22,
  wind: {
    speed: 4,
    direction: 'North'
  },
  location: 'Da Nang Airport',
  currentTime: new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }),
  latestReport: new Date(Date.now() - 50 * 60000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  visibility: 'N/A',
  pressure: 1013,
  humidity: 89,
  dewPoint: 21
};

export const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
  const hour = (new Date().getHours() + i) % 24;
  const temp = 22 + Math.sin(i / 3.8) * 4;
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    temperature: Math.round(temp),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    precipitation: Math.floor(Math.random() * 30),
    wind: 3 + Math.floor(Math.random() * 8)
  };
});

export const sevenDayForecast = [
  {
    date: 'Thu, 25',
    dayName: 'Today',
    high: 26,
    low: 22,
    condition: 'Partly Cloudy',
    precipitation: 11.8,
    humidity: 89,
    wind: { speed: 20, direction: 'NE' }
  },
  {
    date: 'Fri, 26',
    dayName: 'Friday',
    high: 23,
    low: 20,
    condition: 'Rain',
    precipitation: 25.7,
    humidity: 92,
    wind: { speed: 11, direction: 'NE' }
  },
  {
    date: 'Sat, 27',
    dayName: 'Saturday',
    high: 24,
    low: 19,
    condition: 'Partly Cloudy',
    precipitation: 0.1,
    humidity: 85,
    wind: { speed: 10, direction: 'NE' }
  },
  {
    date: 'Sun, 28',
    dayName: 'Sunday',
    high: 24,
    low: 20,
    condition: 'Partly Cloudy',
    precipitation: 3.9,
    humidity: 87,
    wind: { speed: 12, direction: 'E' }
  },
  {
    date: 'Mon, 29',
    dayName: 'Monday',
    high: 25,
    low: 20,
    condition: 'Rain',
    precipitation: 2.9,
    humidity: 88,
    wind: { speed: 12, direction: 'E' }
  },
  {
    date: 'Tue, 30',
    dayName: 'Tuesday',
    high: 25,
    low: 21,
    condition: 'Rain',
    precipitation: 2.6,
    humidity: 86,
    wind: { speed: 12, direction: 'SE' }
  },
  {
    date: 'Wed, 31',
    dayName: 'Wednesday',
    high: 25,
    low: 20,
    condition: 'Rain',
    precipitation: 0.4,
    humidity: 85,
    wind: { speed: 13, direction: 'SE' }
  }
];
