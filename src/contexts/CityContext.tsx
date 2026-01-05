import { createContext, useContext, useState, ReactNode } from 'react';

interface CityCoordinates {
  lat: number;
  lon: number;
}

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  coordinates: CityCoordinates | null;
  setCoordinates: (coords: CityCoordinates | null) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState('Da Nang');
  const [coordinates, setCoordinates] = useState<CityCoordinates | null>(null);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, coordinates, setCoordinates }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within CityProvider');
  }
  return context;
}
