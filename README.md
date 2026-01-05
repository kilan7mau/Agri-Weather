# 🌾 Agri-Weather - Smart Agriculture Planning System

> **AI-Powered Smart Farming Assistant with Weather Forecasting**

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.x-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)](https://www.tensorflow.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-purple)](https://console.groq.com/)

A comprehensive web application that combines **weather forecasting**, **AI-powered agriculture planning**, and **real-time weather data** to help farmers make informed decisions.

## 🎯 Key Highlights

- ✅ **AI-Powered Planning**: Groq AI (Llama 3.3 70B) generates intelligent 7-day farming schedules
- ✅ **Context-Aware Chatbot**: Ask questions about weather and get personalized farming advice
- ✅ **Advanced ML Models**: 3 specialized models for hourly, daily, and 7-day forecasts
- ✅ **Real-Time Weather**: Live data from Open-Meteo API with beautiful visualizations
- ✅ **Optimized Performance**: Single API call predicts all weather data (today, hourly, 7-day)
- ✅ **Interactive Charts**: Temperature trends, precipitation, wind speed/gusts with direction indicators
- ✅ **Farmer-Friendly**: Vietnamese language support and intuitive interface
- ✅ **Completely Free**: All APIs have generous free tiers
- ✅ **Production Ready**: Built with React, TypeScript, FastAPI, and TensorFlow

---

## ✨ Features

### 🌤️ Weather Forecasting
- **Today's Weather**: Current weather conditions with 8 detailed metrics
  - Temperature (actual & feels-like)
  - Dew point, precipitation, cloud cover, humidity
  - Wind speed/gusts, pressure, daylight/sunshine duration
- **24-Hour Forecast**: Hourly weather predictions with interactive visualizations
  - Temperature trends chart (actual & feels-like)
  - Precipitation bar chart
  - Wind speed, gusts & direction chart with directional indicators
  - Detailed metrics: humidity, cloud cover, precipitation for each hour
- **7-Day Forecast**: Weekly weather outlook with clickable daily cards
  - Interactive day selection to view detailed forecasts
  - Temperature ranges with color gradients
  - Weather icons based on WMO weather codes
  - Wind, precipitation, and all 8 weather metrics per day
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

### 💬 Context-Aware AI Chatbot
- **Smart Assistant**: Groq-powered chatbot (Llama-3.3-70b-versatile) understands weather data and farming plans
- **3 Conversation Flows**:
  - **Weather**: Explains temperature, precipitation, humidity, and their impact on crops
  - **Agriculture**: Suggests optimal times for watering, fertilizing, pest control
  - **General**: Guides users through app features and best practices
- **Real-time Context**: Bot analyzes current weather and your farming schedule
- **Intelligent Advice**: Combines weather forecasts with tasks (e.g., "Don't water today, rain expected")
- **Vietnamese Support**: Friendly, farmer-focused language
- **Chat History**: All conversations saved to Supabase
- **Current Date Awareness**: AI knows the actual date and provides time-relevant advice

### 🎯 Machine Learning Models
- **Hourly Prediction**: Deep learning + Histogram Gradient Boosting
- **Daily Prediction**: Voting Classifier ensemble
- **7-Day Prediction**: LSTM-based sequential model
- **Weather Code Classification**: WMO weather code interpretation


---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + TypeScript + Tailwind CSS + Vite                  │
│  ├─ Dashboard (3 tabs: Today/Hourly/7-Day)                 │
│  ├─ Agriculture Planner (AI-powered schedule)              │
│  ├─ AI Chatbot (Context-aware assistant)                   │
│  └─ City Search & Auth                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│  FastAPI + Python + Uvicorn                                 │
│  ├─ Weather Prediction (/api/predict/*)                    │
│  ├─ AI Schedule Generation (/api/groq/generate-schedule)   │
│  ├─ AI Chat (/api/groq/chat)                               │
│  └─ Data Processing & ML Inference                         │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   ML Models         │       │  External APIs      │
│  ├─ TensorFlow      │       │  ├─ Open-Meteo      │
│  ├─ scikit-learn    │       │  │   (Weather data) │
│  └─ joblib          │       │  ├─ OpenWeather     │
│                     │       │  │   (Geocoding)    │
│                     │       │  ├─ Groq AI         │
│                     │       │  │   (Llama 3.3)    │
│                     │       │  └─ Supabase        │
│                     │       │      (Auth & DB)    │
└─────────────────────┘       └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.10 or higher
- **pip** (Python package manager)
- **Git** (for cloning repository)

**API Keys (All Free):**
- **Groq API Key**: Get at https://console.groq.com (free tier: 14,400 requests/day)
- **OpenWeather API Key**: Get at https://openweathermap.org/api (free tier: 1,000 calls/day)
- **Supabase Account**: Create at https://supabase.com (free tier: 500MB database)

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
cd ../..
```

#### 4. Environment Configuration

Create `.env` file in root directory:
```env
# Groq AI - Get free key at https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# OpenWeather - Get free key at https://openweathermap.org/api
OPENWEATHER_API_KEY=xxxxxxxxxxxxx

# Supabase - Get from https://supabase.com project settings
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxx
```

#### 5. Database Setup

Run Supabase migrations:
```bash
# Make sure you have Supabase CLI installed
supabase db push
```

Or manually create tables using SQL in `supabase/migrations/`

---

## 🎮 Usage

### Start Backend Server
```bash
cd src/Backends
python main.py
```
Backend runs on `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Using the Application

#### 1. **Login/Register** 
Create an account or login with existing credentials

#### 2. **Select City** 
Choose your location from the search bar (supports Vietnamese cities)

#### 3. **View Weather Forecasts**
- **Today Tab**: Current weather with key metrics
  - Main weather card with temperature, feels-like, and description
  - 8 metric boxes: Dew Point, Precipitation, Cloud Cover, Humidity, Wind Gust, Pressure, Daylight Duration, Sunshine Duration
- **Hourly Tab**: 24-hour forecast with interactive charts
  - Scrollable hourly cards showing weather at each hour
  - Temperature trend chart (actual & feels-like temperatures)
  - Precipitation bar chart (rainfall per hour)
  - Wind analysis chart (speed, gusts, and direction indicators)
- **7-Day Tab**: Weekly outlook with detailed daily information
  - Clickable 8-day forecast list (Today + 7 future days)
  - Selected day details card with temperature gradient and 8 metrics
  - Temperature ranges with color-coded bars
  - Wind direction arrows and precipitation amounts

#### 4. **Agriculture Planning**
- Click "Agriculture Planner" tab
- Enter:
  - Crop name (e.g., "Rice", "Corn")
  - Farm location (e.g., "Field A")
  - Season/Goal (e.g., "Spring planting")
  - Optional notes
- Click "Save Plan"
- Click "🤖 Generate 7-Day Schedule with AI"
- Wait 5-10 seconds for AI to analyze weather and create tasks
- View, edit, or delete generated tasks

#### 5. **Chat with AI Assistant**
- Click the floating chat button (bottom-right corner)
- Ask questions like:
  - "What's the weather today?"
  - "Should I water my crops today?"
  - "When is the best time to fertilize?"
  - "Will it rain this week?"
- AI analyzes your weather data and farming plans to give personalized advice
- Chat history is saved automatically

---

## 📡 API Endpoints

### Weather Endpoints
- `POST /api/predict/all` - **Get all predictions (today, hourly, 7-day) in one call** ⭐ Recommended
  - Returns complete weather data for all 3 tabs
  - Optimized for performance - single API call loads entire dashboard
  - Response includes: `today_forecast`, `hourly_forecast`, `seven_day_forecast`
- `POST /api/predict/daily` - Get today's weather prediction only
- `POST /api/predict/hourly` - Get 24-hour forecast only
- `POST /api/predict/7days` - Get 7-day forecast only

### Groq AI Endpoints
- `POST /api/groq/generate-schedule` - Generate 7-day farming schedule
  - Input: crop name, location, season goal
  - Returns: 7 daily tasks optimized for weather conditions
- `POST /api/groq/chat` - Chat with context-aware AI assistant
  - Input: user message, weather context, agriculture context
  - Returns: Intelligent response based on current data and date
- `GET /api/groq/test` - Test Groq API connection

### Request Examples

**Get All Weather Data (Recommended):**
```bash
curl -X POST http://localhost:8000/api/predict/all \
  -H "Content-Type: application/json" \
  -d '{"city": "Da Nang"}'
```

**Response includes:**
- `today_forecast`: Current day weather with 14+ metrics
- `hourly_forecast`: 24-hour predictions (temperature, precipitation, wind, etc.)
- `seven_day_forecast`: 7-day outlook with daily aggregated data

**Generate Farming Schedule:**
```bash
curl -X POST http://localhost:8000/api/groq/generate-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "crop_name": "Rice",
    "farm_location": "Field A",
    "season_goal": "Spring planting",
    "weather_data": {...}
  }'
```

**Chat with AI:**
```bash
curl -X POST http://localhost:8000/api/groq/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_message": "Should I water my crops today?",
    "weather_context": {...},
    "agriculture_context": {...}
  }'
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
│   │   └── model/               # ML models
│   │       ├── 7days/           # LSTM model for weekly forecast
│   │       ├── daily/           # Voting classifier for today
│   │       └── hourly/          # Deep learning + HGBC for 24h
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard with tabs
│   │   ├── WeatherTab.tsx       # Weather display container
│   │   ├── AgriculturePlanner.tsx  # AI planning UI
│   │   ├── ChatPanel.tsx        # AI chatbot interface
│   │   ├── FloatingChatButton.tsx  # Chat toggle button
│   │   ├── CitySearch.tsx       # Location selector
│   │   ├── weather/
│   │   │   ├── WeatherToday.tsx    # Today's weather
│   │   │   ├── HourlyWeather.tsx   # 24-hour forecast
│   │   │   └── SevenDayForecast.tsx # Weekly forecast
│   │   └── data/
│   │       └── weatherData.ts   # Weather utilities
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── CityContext.tsx      # City selection state
│   │   └── WeatherContext.tsx   # Weather data state
│   ├── lib/
│   │   ├── weatherApi.ts        # Weather API client
│   │   ├── groqApi.ts           # Groq AI API client
│   │   ├── supabaseClient.ts    # Database client
│   │   └── weatherData.ts       # Weather utilities
│   └── pages/
│       ├── Login.tsx            # Login page
│       └── Register.tsx         # Registration page
├── supabase/
│   └── migrations/              # Database migrations
│       └── 20251224184542_create_agriculture_and_chat_schema.sql
├── .env                         # Environment variables
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

### 1. Agriculture Schedule Generator

**How it Works:**

1. **User Input**: Crop name, location, season goal
2. **Data Collection**: System fetches 7-day weather forecast
3. **AI Analysis**: Groq API with Llama-3.3-70b-versatile analyzes:
   - Daily temperature ranges
   - Precipitation patterns
   - Humidity levels
   - Wind conditions
4. **Task Generation**: AI creates 7 optimized farming tasks
5. **Output**: Day-by-day schedule with detailed instructions

**Example AI Output:**

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

### 2. Context-Aware Chatbot

**How it Works:**

1. **User Question**: Farmer asks about weather or farming tasks
2. **Context Loading**: 
   - Current weather data (today, hourly, 7-day forecasts)
   - User's agriculture plans and tasks
   - Current date and time
3. **AI Analysis**: Llama-3.3-70b processes:
   - Weather conditions and trends
   - Scheduled farming activities
   - Best practices for the crop type
4. **Smart Response**: AI provides:
   - Weather interpretation for farmers
   - Task recommendations based on conditions
   - Warnings about unsuitable weather
   - Suggestions to postpone/advance activities

**Example Conversation:**

```
👤 Farmer: "Should I water my rice today?"

🤖 AI: "Today (Jan 5, 2026) in Da Nang, temperature is 20.75°C 
       with 5.42mm rain expected and 87.84% humidity. 
       I recommend POSTPONING watering to avoid waterlogging. 
       The soil will have sufficient moisture from the rain."
```

**3 Conversation Flows:**

- **Weather Flow**: Explains temperature, precipitation, humidity impact
- **Agriculture Flow**: Suggests timing for watering, fertilizing, pest control
- **General Flow**: Guides through app features and farming best practices

---

## 🛠️ Technologies

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization for weather charts
- **Supabase Client** - Authentication & real-time database

### Backend
- **FastAPI** - High-performance web framework
- **Python 3.10+** - Programming language
- **TensorFlow/Keras** - Deep learning models (LSTM, DNN)
- **scikit-learn** - ML algorithms (Voting, HGBC, Decision Trees)
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Groq SDK** - AI inference client (Llama-3.3-70b-versatile)
- **Uvicorn** - ASGI server
- **python-dotenv** - Environment variable management

### APIs & Services
- **Open-Meteo** - Free weather data API (no key required)
- **OpenWeather** - Geocoding API for city coordinates
- **Groq** - Fast AI inference (Llama 3.3 70B model)
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions

### Machine Learning Stack
- **Models**:
  - LSTM (Sequential forecasting)
  - Deep Neural Networks (Weather classification)
  - Histogram Gradient Boosting Classifier
  - Voting Classifier (Ensemble)
  - Extra Trees & Decision Trees
- **Preprocessing**:
  - StandardScaler (Feature normalization)
  - LabelEncoder (Weather code encoding)
  - Time series feature engineering

---

## 🔒 Environment Variables

### Backend (`.env` in root directory)
```env
# Groq AI (Required for AI features)
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# OpenWeather API (Required for geocoding)
OPENWEATHER_API_KEY=your_openweather_key

# Supabase (Required for auth and database)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Get API Keys
- **Groq**: Free at https://console.groq.com
- **OpenWeather**: Free at https://openweathermap.org/api
- **Supabase**: Free at https://supabase.com

---

## 📝 Database Schema

### Tables

#### `users`
- User authentication and profile
- Managed by Supabase Auth

#### `agriculture_plans`
- `id` (uuid) - Plan identifier
- `crop_name` (text) - Crop being grown
- `farm_location` (text) - Field/location name
- `season_goal` (text) - Farming objective
- `notes` (text) - Additional information
- `created_at` (timestamp) - Creation time

#### `daily_tasks`
- `id` (uuid) - Task identifier
- `plan_id` (uuid) - Foreign key to agriculture_plans
- `task_date` (integer) - Day number (0-6)
- `task_description` (text) - Task title
- `task_details` (text) - Detailed instructions
- `created_at` (timestamp) - Creation time

#### `chat_messages`
- `id` (uuid) - Message identifier
- `message_text` (text) - Message content
- `sender` (text) - 'user' or 'bot'
- `created_at` (timestamp) - Message time

See `supabase/migrations/` for full schema and RLS policies.

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.10+)
- Install dependencies: `pip install -r requirements.txt`
- Verify `GROQ_API_KEY` and `OPENWEATHER_API_KEY` in `.env`
- Check if port 8000 is already in use

### Frontend errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Supabase credentials in `.env`
- Verify `.env` has `VITE_` prefix for frontend variables

### AI generation fails
- Test Groq connection: `curl http://localhost:8000/api/groq/test`
- Expected response: `{"status": "success", "message": "Groq API connected successfully"}`
- Check API key is valid at https://console.groq.com
- Verify backend logs for errors
- Ensure internet connection is stable

### Chatbot not responding
- Check backend is running and accessible
- Open browser Console (F12) and look for errors
- Verify weather data is loaded (check Console logs)
- Test API: `curl -X POST http://localhost:8000/api/groq/chat -H "Content-Type: application/json" -d '{"user_message":"Hello","weather_context":{},"agriculture_context":{}}'`
- Check chat_messages table exists in Supabase

### Chatbot gives wrong date
- Restart backend server (Ctrl+C then `python main.py`)
- Backend automatically includes current date in AI prompt
- Check backend logs show correct date: `📅 Current Date/Time: 2026-01-05...`


### Weather data not loading
- Check city name spelling (supports Vietnamese cities)
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Test Open-Meteo API is accessible
- Verify `OPENWEATHER_API_KEY` is set for geocoding

### Database errors
- Ensure Supabase project is active
- Run migrations: `supabase db push`
- Check RLS policies are enabled
- Verify `.env` has correct Supabase URL and key

---

## 📈 Future Enhancements

- [ ] **Multi-language support**: Full English and Vietnamese UI
- [ ] **Voice input**: Speech-to-text for easier farmer interaction
- [ ] **Offline mode**: Cached data for areas with poor connectivity
- [ ] **Mobile app**: React Native version for iOS/Android
- [ ] **Advanced AI**:
  - [ ] Crop disease detection via image recognition
  - [ ] Pest identification and treatment recommendations
  - [ ] Yield prediction based on weather patterns
- [ ] **IoT Integration**: 
  - [ ] Soil moisture sensors
  - [ ] Automated irrigation control
  - [ ] Real-time field monitoring
- [ ] **Community features**:
  - [ ] Farmer network and knowledge sharing
  - [ ] Local weather station integration
  - [ ] Marketplace for selling produce
- [ ] **Analytics dashboard**: Historical data visualization and insights
- [ ] **SMS/WhatsApp notifications**: Weather alerts for farmers without smartphones
- [ ] **Multi-crop support**: Manage multiple fields with different crops

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
- **API Documentation**: Visit `http://localhost:8000/docs` when backend is running
- **Browser Console**: Press F12 to view frontend logs and errors
- **Backend Logs**: Check terminal output for detailed error messages
- **Database Issues**: Check Supabase dashboard for table structure and data
- **Troubleshooting**: Refer to the detailed troubleshooting section above

**Common Commands:**
```bash
# Check backend is running
curl http://localhost:8000

# Test Groq API
curl http://localhost:8000/api/groq/test

# View API documentation
open http://localhost:8000/docs

# Check Python version
python --version

# Check Node version
node --version
```

---

**Built with ❤️ for farmers and agriculture professionals**

🌾 Happy Farming! 🌤️

