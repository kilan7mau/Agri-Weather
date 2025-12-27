import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { CityProvider } from './contexts/CityContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CityProvider>
        <App />
      </CityProvider>
    </AuthProvider>
  </StrictMode>
);
