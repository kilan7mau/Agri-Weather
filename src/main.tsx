import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { CityProvider } from './contexts/CityContext';
import { WeatherProvider } from './contexts/WeatherContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CityProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </CityProvider>
    </AuthProvider>
  </StrictMode>
);
