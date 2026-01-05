import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useCity } from '../contexts/CityContext';

export const CITIES = [
  'Ha Noi',
  'Hue',
  'Lai Chau',
  'Dien Bien',
  'Son La',
  'Lang Son',
  'Quang Ninh',
  'Thanh Hoa',
  'Nghe An',
  'Ha Tinh',
  'Cao Bang',
  'Tuyen Quang',
  'Ha Giang',
  'Lao Cai',
  'Yen Bai',
  'Thai Nguyen',
  'Bac Kan',
  'Phu Tho',
  'Vinh Phuc',
  'Hoa Binh',
  'Bac Ninh',
  'Bac Giang',
  'Hung Yen',
  'Thai Binh',
  'Hai Phong',
  'Hai Duong',
  'Ninh Binh',
  'Ha Nam',
  'Nam Dinh',
  'Quang Tri',
  'Quang Binh',
  'Da Nang',
  'Quang Nam',
  'Quang Ngai',
  'Kon Tum',
  'Gia Lai',
  'Binh Dinh',
  'Khanh Hoa',
  'Ninh Thuan',
  'Lam Dong',
  'Dak Nong',
  'Binh Thuan',
  'Dak Lak',
  'Phu Yen',
  'Ho Chi Minh',
  'Binh Duong',
  'Vung Tau',
  'Dong Nai',
  'Binh Phuoc',
  'Tay Ninh',
  'Long An',
  'Can Tho',
  'Soc Trang',
  'Hau Giang',
  'Vinh Long',
  'Ben Tre',
  'Tra Vinh',
  'Dong Thap',
  'Tien Giang',
  'Ca Mau',
  'Bac Lieu',
  'An Giang',
  'Kien Giang',
];


export default function CitySearch() {
  const { selectedCity, setSelectedCity, setCoordinates } = useCity();
  const [input, setInput] = useState(selectedCity);
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch coordinates from OpenStreetMap Nominatim API
  const fetchCoordinates = useCallback(async (cityName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)},Vietnam&format=json&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AgriWeatherApp/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates({
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch coordinates:', error);
    }
  }, [setCoordinates]);

  useEffect(() => {
    if (input.trim()) {
      const matches = CITIES.filter((city) =>
        city.toLowerCase().includes(input.toLowerCase())
      );
      setFiltered(matches);
      setIsOpen(matches.length > 0);
    } else {
      setFiltered([]);
      setIsOpen(false);
    }
  }, [input]);

  // Fetch coordinates on initial load
  useEffect(() => {
    if (selectedCity) {
      fetchCoordinates(selectedCity);
    }
  }, [selectedCity, fetchCoordinates]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setInput(city);
    setIsOpen(false);
    fetchCoordinates(city);
  };

  const handleClear = () => {
    setInput(selectedCity);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-80">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => input.trim() && filtered.length > 0 && setIsOpen(true)}
          placeholder="Search city..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        {input !== selectedCity && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filtered.map((city) => (
            <button
              key={city}
              onClick={() => handleSelectCity(city)}
              className={`w-full px-4 py-3 text-left flex items-center gap-2 transition-colors ${
                city === selectedCity
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {city}
              {city === selectedCity && (
                <span className="ml-auto text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
