import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';
import WeatherTab from './WeatherTab';
import AgriculturePlanner from './AgriculturePlanner';
import FloatingChatButton from './FloatingChatButton';
import ChatPanel from './ChatPanel';
import CitySearch from './CitySearch';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { selectedCity } = useCity();
  const [activeTab, setActiveTab] = useState<'weather' | 'agriculture'>('weather');
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AgriWeather</h1>
            </div>
            <CitySearch />
          </div>

          <nav className="flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('weather')}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeTab === 'weather'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Cloud className="w-5 h-5" />
                Weather
              </button>
              <button
                onClick={() => setActiveTab('agriculture')}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeTab === 'agriculture'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Leaf className="w-5 h-5" />
                Agriculture
              </button>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 hidden sm:block">
                <span className="font-medium">{selectedCity}</span>
              </p>
              <div className="pl-3 border-l border-gray-200 flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'weather' ? (
          <WeatherTab />
        ) : (
          <AgriculturePlanner />
        )}
      </main>

      <FloatingChatButton onClick={() => setChatOpen(true)} />
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
