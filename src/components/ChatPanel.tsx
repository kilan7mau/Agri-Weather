import { useState, useEffect, useRef } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { chatWithGroq } from '../lib/groqApi';
import { useWeather } from '../contexts/WeatherContext';

interface Message {
  id: string;
  message_text: string;
  sender: 'user' | 'bot';
  created_at: string;
}

interface ChatPanelProps {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { weatherData } = useWeather();

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

  const loadAgriculturePlans = async () => {
    try {
      // Load latest plan with its tasks
      const { data: plans, error: plansError } = await supabase
        .from('agriculture_plans')
        .select(`
          *,
          daily_tasks (
            task_date,
            task_description,
            task_details
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (plansError) {
        console.error('Error loading plans:', plansError);
        return {};
      }

      const planData = plans && plans.length > 0 ? plans[0] : {};
      console.log('📋 Loaded agriculture plan:', planData);
      return planData;
    } catch (error) {
      console.error('Error loading agriculture plans:', error);
      return {};
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Save user message
    const { data: savedMessage } = await supabase
      .from('chat_messages')
      .insert([{ message_text: userMessage, sender: 'user' }])
      .select()
      .single();

    if (savedMessage) {
      setMessages([...messages, savedMessage as Message]);
    }

    setIsTyping(true);
    
    try {
      // Load agriculture plans from database
      const agricultureContext = await loadAgriculturePlans();
      
      console.log('🌤️ Weather Context:', weatherData);
      console.log('🌾 Agriculture Context:', agricultureContext);
      
      // Call Groq AI with context
      const response = await chatWithGroq({
        user_message: userMessage,
        weather_context: (weatherData || {}) as Record<string, unknown>,
        agriculture_context: agricultureContext as Record<string, unknown>
      });

      // Save bot message
      const { data: botMessage } = await supabase
        .from('chat_messages')
        .insert([{ message_text: response.reply, sender: 'bot' }])
        .select()
        .single();

      if (botMessage) {
        setMessages((prev) => [...prev, botMessage as Message]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback error message
      const errorMsg = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      const { data: errorMessage } = await supabase
        .from('chat_messages')
        .insert([{ message_text: errorMsg, sender: 'bot' }])
        .select()
        .single();

      if (errorMessage) {
        setMessages((prev) => [...prev, errorMessage as Message]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-end z-50 p-4">
      <div className="bg-white rounded-2xl md:rounded-2xl w-full md:w-96 h-[600px] md:h-[600px] shadow-2xl flex flex-col overflow-hidden">
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
