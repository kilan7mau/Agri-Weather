// Weather API Service
const API_BASE_URL = 'http://localhost:8000';

export interface WeatherRawData {
  temperature_2m_mean?: number;
  temperature_2m_max?: number;
  temperature_2m_min?: number;
  apparent_temperature_mean?: number;
  apparent_temperature_max?: number;
  apparent_temperature_min?: number;
  apparent_temperature?: number;
  dew_point_2m_mean?: number;
  dew_point_2m?: number;
  precipitation_sum?: number;
  precipitation?: number;
  cloud_cover_mean?: number;
  cloud_cover?: number;
  relative_humidity_2m_mean?: number;
  relative_humidity_2m?: number;
  wind_gusts_10m_mean?: number;
  wind_gusts_10m?: number;
  wind_speed_10m_mean?: number;
  wind_speed_10m?: number;
  winddirection_10m_dominant?: number;
  wind_direction_10m?: number;
  surface_pressure_mean?: number;
  surface_pressure?: number;
  pressure_msl_mean?: number;
  pressure_msl?: number;
  daylight_duration?: number;
  sunshine_duration?: number;
}

export interface DailyWeatherResponse {
  city: string;
  time: string;
  weather_code: number;
  weather_description: string;
  raw_data: WeatherRawData;
}

export interface HourlyWeatherItem {
  time: string;
  weather_code: number;
  weather_description: string;
  raw_data: WeatherRawData;
}

export interface HourlyWeatherResponse {
  city: string;
  predictions: HourlyWeatherItem[];
}

export interface SevenDayItem {
  date: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  apparent_temperature_max: number;
  apparent_temperature_min: number;
  precipitation_sum: number;
  wind_speed_10m_max: number;
  wind_gusts_10m_max: number;
  wind_direction_10m_dominant: number;
}

export interface SevenDayWeatherResponse {
  city: string;
  predictions: SevenDayItem[];
}

export interface AllWeatherResponse {
  city: string;
  seven_day_forecast: SevenDayItem[];
  hourly_forecast: HourlyWeatherItem[];
  today_forecast: {
    time: string;
    weather_code: number;
    weather_description: string;
    raw_data: WeatherRawData;
  };
}

export async function getDailyWeather(city: string): Promise<DailyWeatherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict/daily`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily weather');
  }

  return response.json();
}

export async function getHourlyWeather(city: string): Promise<HourlyWeatherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict/hourly`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hourly weather');
  }

  return response.json();
}

export async function getSevenDayWeather(city: string): Promise<SevenDayWeatherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict/7days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch 7-day weather');
  }

  return response.json();
}

export async function getAllWeather(city: string): Promise<AllWeatherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all weather data');
  }

  return response.json();
}

// Helper function to get wind direction name
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Helper function to get weather icon based on weather code
export function getWeatherIcon(code: number): string {
  if (code === 0) return 'sun';
  if (code >= 1 && code <= 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'cloud';
  if (code >= 51 && code <= 57) return 'cloud-drizzle';
  if (code >= 61 && code <= 67) return 'cloud-rain';
  if (code >= 71 && code <= 77) return 'cloud-snow';
  if (code >= 80 && code <= 86) return 'cloud-rain';
  if (code >= 95 && code <= 99) return 'cloud-lightning';
  return 'cloud';
}

