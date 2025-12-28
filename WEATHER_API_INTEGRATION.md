# Weather Prediction API - Integration Guide

## Backend Setup (FastAPI)

### 1. Install Dependencies
```bash
cd src/Backends
pip install fastapi uvicorn pandas joblib keras scikit-learn requests
```

### 2. Start Backend Server
```bash
cd src/Backends
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`
- Swagger UI Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

## Frontend Setup (React + TypeScript)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## API Endpoints

### Weather Prediction Endpoints

#### 1. Get Daily Weather Prediction
**POST** `/api/predict/daily`

Request:
```json
{
  "city": "Hanoi"
}
```

Response:
```json
{
  "city": "Hanoi",
  "time": "2025-12-28",
  "weather_code": 2,
  "weather_description": "Partly cloudy",
  "raw_data": {
    "temperature_2m_mean": 23.0,
    "temperature_2m_max": 26.0,
    "temperature_2m_min": 22.0,
    "apparent_temperature_mean": 24.0,
    "precipitation_sum": 11.8,
    "relative_humidity_2m_mean": 89.0,
    "wind_speed_10m_mean": 20.0,
    ...
  }
}
```

#### 2. Get Hourly Weather Prediction (24 hours)
**POST** `/api/predict/hourly`

Request:
```json
{
  "city": "Da Nang"
}
```

Response:
```json
{
  "city": "Da Nang",
  "predictions": [
    {
      "time": "2025-12-28T00:00",
      "weather_code": 0,
      "weather_description": "Clear sky",
      "raw_data": {
        "temperature_2m": 25.5,
        "apparent_temperature": 24.3,
        "precipitation": 0.0,
        "relative_humidity_2m": 65,
        "wind_speed_10m": 8.5,
        ...
      }
    }
  ]
}
```

#### 3. Get 7-Day Weather Forecast
**POST** `/api/predict/7days`

Request:
```json
{
  "city": "Ho Chi Minh"
}
```

Response:
```json
{
  "city": "Ho Chi Minh",
  "predictions": [
    {
      "date": "2025-12-28",
      "temperature_2m_max": 26.0,
      "temperature_2m_min": 22.0,
      "apparent_temperature_max": 28.0,
      "apparent_temperature_min": 21.0,
      "precipitation_sum": 11.8,
      "wind_speed_10m_max": 20.0,
      "wind_gusts_10m_max": 35.0,
      "wind_direction_10m_dominant": 45.0
    }
  ]
}
```

#### 4. Get All Predictions at Once
**POST** `/api/predict/all`

Returns all three types of predictions in one request.

### Raw Weather Data Endpoints (for debugging)

- **POST** `/api/weather/raw/30days` - Get 30-day historical data
- **POST** `/api/weather/raw/24hours` - Get 24-hour data
- **POST** `/api/weather/raw/daily` - Get today's data
- **POST** `/api/weather/raw/all` - Get all raw data

### Coordinates Endpoint

**POST** `/api/coordinates`

Get latitude/longitude for a city.

## Frontend Components

### 1. WeatherToday Component
- Displays current weather prediction
- Shows temperature, feels like, humidity, pressure, dew point
- Uses `/api/predict/daily` endpoint

### 2. HourlyWeather Component
- Shows 24-hour forecast
- Displays temperature trend chart
- Shows precipitation chart
- Uses `/api/predict/hourly` endpoint

### 3. SevenDayForecast Component
- Shows 7-day extended forecast
- Displays high/low temperatures, precipitation, wind
- Uses `/api/predict/7days` endpoint

## WMO Weather Codes

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1-3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog |
| 51-57 | Drizzle |
| 61-67 | Rain |
| 71-77 | Snow |
| 80-86 | Rain/Snow showers |
| 95-99 | Thunderstorm |

## Troubleshooting

### CORS Issues
If you see CORS errors, make sure the backend is running and has CORS middleware configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Model Loading Issues
Make sure all model files are in the correct directories:
- `src/model/7days/` - 7-day prediction models
- `src/model/hourly/` - Hourly prediction models
- `src/model/daily/` - Daily prediction models

### API Connection Issues
Check that the API URL in `src/lib/weatherApi.ts` matches your backend URL:
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## City Context

The application uses React Context (`CityContext`) to manage the selected city. When the user changes the city in the search box, all weather components automatically refresh with new data.

## Data Flow

1. User selects a city in `CitySearch` component
2. `CityContext` updates the `selectedCity` state
3. Weather components (`WeatherToday`, `HourlyWeather`, `SevenDayForecast`) detect the change
4. Components call respective API endpoints with the new city
5. Backend fetches weather data from Open-Meteo API
6. Backend processes data and runs ML models
7. Backend returns predictions
8. Frontend displays the results

## Performance Tips

- Backend caches are loaded once at startup
- Consider implementing caching for API responses
- Use the `/api/predict/all` endpoint if you need all data at once to reduce requests

