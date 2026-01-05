// Weather API Service
const API_BASE_URL = 'http://localhost:8000';

export interface WeatherRawData {
  // Temperature fields
  temperature_2m?: number;
  temperature_2m_mean?: number;
  temperature_2m_max?: number;
  temperature_2m_min?: number;
  
  // Apparent temperature fields
  apparent_temperature?: number;
  apparent_temperature_mean?: number;
  apparent_temperature_max?: number;
  apparent_temperature_min?: number;
  
  // Dew point fields
  dew_point_2m?: number;
  dew_point_2m_mean?: number;
  
  // Precipitation fields
  precipitation?: number;
  precipitation_sum?: number;
  
  // Cloud cover fields
  cloud_cover?: number;
  cloud_cover_mean?: number;
  
  // Relative humidity fields
  relative_humidity_2m?: number;
  relative_humidity_2m_mean?: number;
  
  // Wind gusts fields
  wind_gusts_10m?: number;
  wind_gusts_10m_mean?: number;
  
  // Wind speed fields
  wind_speed_10m?: number;
  wind_speed_10m_mean?: number;
  
  // Wind direction fields
  wind_direction_10m?: number;
  winddirection_10m_dominant?: number;
  
  // Surface pressure fields
  surface_pressure?: number;
  surface_pressure_mean?: number;
  
  // Mean sea level pressure fields
  pressure_msl?: number;
  pressure_msl_mean?: number;
  
  // Duration fields
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
  time: string;
  weather_code: number;
  weather_description: string;
  temperature_2m_max: number;
  temperature_2m_mean: number;
  temperature_2m_min: number;
  apparent_temperature_max: number;
  apparent_temperature_min: number;
  precipitation_sum: number;
  wind_speed_10m_max: number;
  wind_speed_10m_mean: number;
  wind_gusts_10m_mean: number;
  winddirection_10m_dominant: number;
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
  switch (code) {
    case 0:
      return 'Sun'; // Clear sky
    
    case 1:
    case 2:
      return 'CloudSun'; // Mainly clear, partly cloudy
    
    case 3:
      return 'Cloud'; // Overcast
    
    case 45:
    case 48:
      return 'CloudFog'; // Fog and depositing rime fog
    
    case 51:
    case 53:
    case 55:
      return 'CloudDrizzle'; // Drizzle: Light, moderate, and dense intensity
    
    case 56:
    case 57:
      return 'CloudSnow'; // Freezing Drizzle: Light and dense intensity
    
    case 61:
    case 63:
      return 'CloudRain'; // Rain: Slight, moderate
    
    case 65:
      return 'CloudRain'; // Heavy rain
    
    case 66:
    case 67:
      return 'CloudSnow'; // Freezing Rain: Light and heavy intensity
    
    case 71:
    case 73:
    case 75:
      return 'CloudSnow'; // Snow fall: Slight, moderate, and heavy intensity
    
    case 77:
      return 'CloudSnow'; // Snow grains
    
    case 80:
    case 81:
    case 82:
      return 'CloudRain'; // Rain showers: Slight, moderate, and violent
    
    case 85:
    case 86:
      return 'CloudSnow'; // Snow showers slight and heavy
    
    case 95:
      return 'CloudLightning'; // Thunderstorm: Slight or moderate
    
    case 96:
    case 99:
      return 'CloudLightning'; // Thunderstorm with slight and heavy hail
    
    default:
      return 'Cloud';
  }
}



