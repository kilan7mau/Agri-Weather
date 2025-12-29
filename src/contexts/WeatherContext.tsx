import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllWeather, type AllWeatherResponse } from '../lib/weatherApi';
import { useCity } from './CityContext';

interface WeatherContextType {
  weatherData: AllWeatherResponse | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { selectedCity } = useCity();
  const [weatherData, setWeatherData] = useState<AllWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🌤️ Fetching weather data for ${city}...`);
      
      const data = await getAllWeather(city);
      setWeatherData(data);
      
      console.log(`✅ Weather data loaded for ${city}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error(`❌ Error fetching weather: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    await fetchWeatherData(selectedCity);
  };

  // Auto-fetch when city changes
  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  return (
    <WeatherContext.Provider value={{ weatherData, loading, error, refreshWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
}

