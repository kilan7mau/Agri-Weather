import { useState, useEffect, useRef } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Message {
  id: string;
  message_text: string;
  sender: 'user' | 'bot';
  created_at: string;
}

interface ChatPanelProps {
  onClose: () => void;
}

const BOT_RESPONSES = {
  weather: [
    "I can help you understand the weather data! The current temperature shows how warm it is right now, while the 'feels like' temperature accounts for wind chill or humidity.",
    "Looking at the forecast? The 7-day outlook helps you plan irrigation and protect crops from harsh weather.",
    "Wind and humidity are crucial for farming! Strong winds can damage crops, and high humidity increases disease risk.",
    "Precipitation is vital for crops. This week's rain forecast will help you decide when to water.",
  ],
  agriculture: [
    "Great! I can help you plan your farm tasks. Consider the weather when scheduling watering, fertilizing, or spraying.",
    "For a 7-day plan, think about your crop's needs, current weather, and upcoming conditions.",
    "Common farming tasks include: watering, fertilizing, pest control, weeding, and harvesting.",
    "Don't forget to record your tasks daily. This helps you track what worked best for future seasons!",
  ],
  general: [
    "I'm here to help! I can assist with weather interpretation and farm planning.",
    "You can use the Weather tab to understand current conditions, hourly forecasts, and 7-day outlooks.",
    "The Agriculture tab lets you plan your farm tasks for the next 7 days and track your activities.",
    "Feel free to ask me anything about weather patterns or farm planning strategies!",
  ],
};

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) || []);
  };

  const getRandomResponse = (category: string) => {
    const responses = BOT_RESPONSES[category as keyof typeof BOT_RESPONSES] || BOT_RESPONSES.general;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const categorizeMessage = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('weather') ||
      lowerText.includes('temperature') ||
      lowerText.includes('rain') ||
      lowerText.includes('forecast')
    ) {
      return 'weather';
    }
    if (
      lowerText.includes('task') ||
      lowerText.includes('crop') ||
      lowerText.includes('farm') ||
      lowerText.includes('plant')
    ) {
      return 'agriculture';
    }
    return 'general';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    const { data: savedMessage } = await supabase
      .from('chat_messages')
      .insert([{ message_text: userMessage, sender: 'user' }])
      .select()
      .single();

    if (savedMessage) {
      setMessages([...messages, savedMessage as Message]);
    }

    setIsTyping(true);
    setTimeout(async () => {
      const category = categorizeMessage(userMessage);
      const botResponse = getRandomResponse(category);

      const { data: botMessage } = await supabase
        .from('chat_messages')
        .insert([{ message_text: botResponse, sender: 'bot' }])
        .select()
        .single();

      if (botMessage) {
        setMessages((prev) => [...prev, botMessage as Message]);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleClearChat = async () => {
    await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-end z-50 p-4">
      <div className="bg-white rounded-2xl md:rounded-2xl w-full md:w-96 h-[600px] md:h-96 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h2 className="font-bold text-lg">Assistant</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="text-gray-600 max-w-xs">
                <p className="text-lg font-semibold mb-2">Hi there! 👋</p>
                <p className="text-sm">
                  I can help you understand the weather and plan your farm tasks. What would you like to do today?
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.message_text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              disabled={isTyping}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
