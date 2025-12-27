import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useCity } from '../contexts/CityContext';

const CITIES = [
  'Da Nang',
  'Ho Chi Minh City',
  'Hanoi',
  'Ha Long',
  'Hue',
  'Da Lat',
  'Nha Trang',
  'Can Tho',
  'Bangkok',
  'Chiang Mai',
  'Phuket',
  'Singapore',
  'Kuala Lumpur',
  'Jakarta',
  'Bali',
  'Manila',
  'Cebu',
  'Hong Kong',
  'Shanghai',
  'Beijing',
  'Tokyo',
  'Seoul',
  'Taipei',
  'Sydney',
  'Melbourne',
  'Auckland',
  'New York',
  'Los Angeles',
  'London',
  'Paris',
  'Berlin',
  'Dubai',
  'Mumbai',
  'Delhi',
  'Bangkok',
  'Cairo',
];

export default function CitySearch() {
  const { selectedCity, setSelectedCity } = useCity();
  const [input, setInput] = useState(selectedCity);
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
