# 🌾 Agri-Weather - Smart Agriculture Planning System

A comprehensive web application that combines **weather forecasting**, **AI-powered agriculture planning**, and **real-time weather data** to help farmers make informed decisions.

---

## ✨ Features

### 🌤️ Weather Forecasting
- **Today's Weather**: Current weather conditions with detailed metrics
- **24-Hour Forecast**: Hourly weather predictions with temperature trends and precipitation
- **7-Day Forecast**: Weekly weather outlook with temperature ranges
- **Real-time Data**: Powered by Open-Meteo API and ML models

### 🤖 AI Agriculture Planning
- **Groq AI Integration**: Uses Llama-3.3-70b-versatile for intelligent task generation
- **Weather-Aware Planning**: Automatically considers 7-day weather forecasts
- **Smart Task Generation**: AI creates optimal farming schedules based on:
  - Crop type and location
  - Temperature and precipitation patterns
  - Humidity and wind conditions
  - Seasonal goals
- **7-Day Calendar**: Visual task management with day-by-day breakdown

### 🎯 Machine Learning Models
- **Hourly Prediction**: Deep learning + Histogram Gradient Boosting
- **Daily Prediction**: Voting Classifier ensemble
- **7-Day Prediction**: LSTM-based sequential model
- **Weather Code Classification**: WMO weather code interpretation

### 💬 Chat Support
- Real-time chat panel for assistance
- Floating chat button for easy access

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + TypeScript + Tailwind CSS + Vite                  │
│  - Dashboard with 3 tabs (Today/Hourly/7-Day)              │
│  - Agriculture Planner with AI generation                   │
│  - City search and context management                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│  FastAPI + Python + Uvicorn                                 │
│  - Weather prediction endpoints                             │
│  - Groq AI integration for farming schedules                │
│  - Data crawling from Open-Meteo                            │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   ML Models         │       │  External APIs      │
│  - TensorFlow       │       │  - Open-Meteo       │
│  - scikit-learn     │       │  - Groq AI          │
│  - joblib           │       │  - Supabase         │
└─────────────────────┘       └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Groq API Key** (free at https://console.groq.com)
- **Supabase Account** (for authentication and database)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Agri-Weather
```

#### 2. Frontend Setup
```bash
npm install
```

#### 3. Backend Setup
```bash
cd src/Backends
pip install -r requirements.txt
```

#### 4. Environment Configuration

Create `src/Backends/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Create `src/lib/supabaseClient.ts` with your Supabase credentials:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-supabase-url'
const supabaseAnonKey = 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🎮 Usage

### Start Backend Server
```bash
cd src/Backends
python main.py
```
Backend runs on `http://localhost:8000`

### Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Using the Application

1. **Login/Register**: Create an account or login
2. **Select City**: Choose your location from the search bar
3. **View Weather**: Check Today, Hourly (24h), or 7-Day forecasts
4. **Agriculture Planning**:
   - Click "Agriculture Planner" tab
   - Enter: Crop name, Farm location, Season/Goal
   - Click "Save Plan"
   - Click "🤖 Generate 7-Day Schedule with AI"
   - Wait 5-10 seconds for AI to analyze weather and create tasks
   - View and edit generated tasks

---

## 📡 API Endpoints

### Weather Endpoints
- `POST /api/predict/all` - Get all predictions (today, hourly, 7-day) in one call
- `POST /api/predict/daily` - Get today's weather prediction
- `POST /api/predict/hourly` - Get 24-hour forecast
- `POST /api/predict/7days` - Get 7-day forecast

### Groq AI Endpoints
- `POST /api/groq/generate-schedule` - Generate 7-day farming schedule
- `GET /api/groq/test` - Test Groq API connection

### Request Example
```bash
curl -X POST http://localhost:8000/api/predict/all \
  -H "Content-Type: application/json" \
  -d '{"city": "Da Nang"}'
```

---

## 🗂️ Project Structure

```
Agri-Weather/
├── src/
│   ├── Backends/
│   │   ├── main.py              # FastAPI server
│   │   ├── predict.py           # ML prediction logic
│   │   ├── crawl.py             # Weather data fetching
│   │   ├── groq_service.py      # Groq AI integration
│   │   ├── requirements.txt     # Python dependencies
│   │   ├── .env                 # Environment variables
│   │   └── model/               # ML models
│   │       ├── 7days/           # LSTM model
│   │       ├── daily/           # Voting classifier
│   │       └── hourly/          # Deep learning + HGBC
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── WeatherTab.tsx       # Weather display
│   │   ├── AgriculturePlanner.tsx  # AI planning UI
│   │   ├── weather/
│   │   │   ├── WeatherToday.tsx
│   │   │   ├── HourlyWeather.tsx
│   │   │   └── SevenDayForecast.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Authentication
│   │   ├── CityContext.tsx      # City selection
│   │   └── WeatherContext.tsx   # Weather data
│   ├── lib/
│   │   ├── weatherApi.ts        # Weather API client
│   │   ├── groqApi.ts           # Groq API client
│   │   └── supabaseClient.ts    # Database client
│   └── pages/
│       ├── Login.tsx
│       └── Register.tsx
├── supabase/
│   └── migrations/              # Database schema
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🧠 ML Models

### 1. Hourly Weather Prediction (24 hours)
- **Model**: Deep Neural Network + Histogram Gradient Boosting Classifier
- **Input**: 11 weather parameters (temperature, humidity, pressure, etc.)
- **Output**: Weather codes for next 24 hours
- **Accuracy**: High precision for short-term forecasts

### 2. Daily Weather Prediction (Today)
- **Model**: Voting Classifier (ExtraTree + DecisionTree)
- **Input**: Daily aggregated weather data with temporal features
- **Output**: Today's weather code
- **Accuracy**: Optimized for current day prediction

### 3. 7-Day Weather Prediction
- **Model**: LSTM (Long Short-Term Memory)
- **Input**: 30-day historical weather sequence
- **Output**: 7-day forecast with 17 weather parameters
- **Accuracy**: Sequential pattern learning for medium-term forecasts

---

## 🤖 AI Features (Groq + Llama)

### How it Works

1. **User Input**: Crop name, location, season goal
2. **Data Collection**: System fetches 7-day weather forecast
3. **AI Analysis**: Groq API with Llama-3.3-70b-versatile analyzes:
   - Daily temperature ranges
   - Precipitation patterns
   - Humidity levels
   - Wind conditions
4. **Task Generation**: AI creates 7 optimized farming tasks
5. **Output**: Day-by-day schedule with detailed instructions

### Example AI Output

```json
{
  "tasks": [
    {
      "day": 0,
      "description": "Prepare soil for planting",
      "details": "Weather is clear (25°C), ideal for soil preparation..."
    },
    {
      "day": 1,
      "description": "Plant rice seedlings",
      "details": "Temperature 24°C, 60% humidity - perfect conditions..."
    }
    // ... 5 more days
  ]
}
```

---

## 🛠️ Technologies

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Supabase** - Authentication & Database

### Backend
- **FastAPI** - Web framework
- **Python 3.10+** - Language
- **TensorFlow** - Deep learning
- **scikit-learn** - ML algorithms
- **Pandas** - Data processing
- **Groq SDK** - AI integration
- **Uvicorn** - ASGI server

### APIs
- **Open-Meteo** - Weather data source
- **Groq** - AI inference (Llama-3.3-70b-versatile)
- **Supabase** - Database and auth

---

## 🔒 Environment Variables

### Backend (`src/Backends/.env`)
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

### Frontend (Supabase config in code)
```typescript
const supabaseUrl = 'https://xxx.supabase.co'
const supabaseAnonKey = 'your-key'
```

---

## 📝 Database Schema

### Tables
- `users` - User authentication
- `agriculture_plans` - Farming plans
- `daily_tasks` - AI-generated tasks
- `chat_messages` - Chat history

See `supabase/migrations/` for full schema.

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.10+)
- Install dependencies: `pip install -r requirements.txt`
- Verify GROQ_API_KEY in `.env`

### Frontend errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Supabase credentials in `supabaseClient.ts`

### AI generation fails
- Test Groq connection: `curl http://localhost:8000/api/groq/test`
- Check API key is valid at https://console.groq.com
- Verify backend logs for errors

### Weather data not loading
- Check city name spelling
- Verify backend is running on port 8000
- Check browser console for errors

---

## 📈 Future Enhancements

- [ ] Multi-language support (Vietnamese, English)
- [ ] Voice input for farmers
- [ ] Offline mode with cached data
- [ ] Mobile app (React Native)
- [ ] Crop disease detection (Computer Vision)
- [ ] Soil quality monitoring
- [ ] Marketplace integration
- [ ] Community features (farmer network)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

Developed for smart agriculture and weather forecasting needs.

---

## 🙏 Acknowledgments

- **Open-Meteo** for free weather API
- **Groq** for fast AI inference
- **Supabase** for backend infrastructure
- **TensorFlow** and **scikit-learn** communities

---

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation at `http://localhost:8000/docs`
- Check browser console and backend logs

---

**Built with ❤️ for farmers and agriculture professionals**

🌾 Happy Farming! 🌤️

