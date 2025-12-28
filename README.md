# 🌦️ AgriWeather - Weather Prediction Application

Ứng dụng dự báo thời tiết sử dụng Machine Learning models với giao diện React và backend FastAPI.

## ✨ Tính năng

- **Dự báo hôm nay**: Nhiệt độ, độ ẩm, gió, áp suất, điểm sương
- **Dự báo theo giờ**: 24 giờ tiếp theo với biểu đồ nhiệt độ và lượng mưa
- **Dự báo 7 ngày**: Xu hướng thời tiết tuần tới
- **Tìm kiếm thành phố**: Hỗ trợ nhiều thành phố trên thế giới
- **Machine Learning**: Sử dụng models đã train sẵn cho dự báo chính xác

## 🚀 Quick Start

### 1. Cài đặt Dependencies

**Backend:**
```bash
cd src/Backends
pip install fastapi uvicorn pandas joblib keras scikit-learn requests
```

**Frontend:**
```bash
npm install
```

### 2. Khởi động Backend

```bash
cd src/Backends
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Khởi động Frontend

```bash
npm run dev
```

Frontend: http://localhost:5173

### 4. Test API

```bash
python test_api.py
```

## 📁 Cấu trúc Project

```
Agri-Weather/
├── src/
│   ├── Backends/
│   │   ├── main.py              # FastAPI server
│   │   ├── predict.py           # ML prediction functions
│   │   ├── crawl.py             # Data fetching & processing
│   │   └── model/               # ML models
│   │       ├── 7days/
│   │       ├── hourly/
│   │       └── daily/
│   ├── components/
│   │   ├── weather/
│   │   │   ├── WeatherToday.tsx    # Tab hôm nay
│   │   │   ├── HourlyWeather.tsx   # Tab theo giờ
│   │   │   └── SevenDayForecast.tsx # Tab 7 ngày
│   │   └── APITest.tsx          # Test component
│   ├── lib/
│   │   └── weatherApi.ts        # API service
│   └── contexts/
│       └── CityContext.tsx      # City state management
├── INTEGRATION_SUMMARY.md       # Tóm tắt tích hợp
├── WEATHER_API_INTEGRATION.md   # Hướng dẫn chi tiết
└── START_PROJECT.md             # Quick start
```

## 🔌 API Endpoints

### Weather Predictions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict/daily` | POST | Dự báo hôm nay |
| `/api/predict/hourly` | POST | Dự báo 24 giờ |
| `/api/predict/7days` | POST | Dự báo 7 ngày |
| `/api/predict/all` | POST | Tất cả dự báo |
| `/api/coordinates` | POST | Lấy tọa độ thành phố |

### Request Format

```json
{
  "city": "Hanoi"
}
```

### Response Example (Daily)

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
    "relative_humidity_2m_mean": 89.0,
    "precipitation_sum": 11.8,
    "wind_speed_10m_mean": 20.0
  }
}
```

## 🌍 Thành phố hỗ trợ

- Hanoi (Hà Nội)
- Da Nang (Đà Nẵng)  
- Ho Chi Minh (Hồ Chí Minh)
- Hoặc bất kỳ thành phố nào (tên tiếng Anh)

## 🎨 Frontend Components

### WeatherToday
- Nhiệt độ hiện tại và cảm giác như
- Thông tin vị trí
- Áp suất, độ ẩm, điểm sương
- Bản đồ vị trí

### HourlyWeather  
- Dự báo 24 giờ
- Biểu đồ xu hướng nhiệt độ
- Biểu đồ lượng mưa
- Icons thời tiết động

### SevenDayForecast
- Tóm tắt thời tiết hôm nay
- Danh sách 7 ngày
- Cao/thấp nhiệt độ
- Lượng mưa và gió

## 🤖 ML Models

- **7-Day Model**: LSTM Neural Network
- **Hourly Model**: Gradient Boosting Classifier
- **Daily Model**: Voting Classifier

Models sử dụng dữ liệu từ Open-Meteo API.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

**Backend:**
- FastAPI
- Python 3.10+
- Pandas
- Keras/TensorFlow
- Scikit-learn
- Joblib

## 📝 WMO Weather Codes

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1-3 | Partly cloudy |
| 51-57 | Drizzle |
| 61-67 | Rain |
| 71-77 | Snow |
| 95-99 | Thunderstorm |

## 🐛 Troubleshooting

### Backend không start được
- Kiểm tra Python version (3.10+)
- Cài đặt đầy đủ dependencies
- Kiểm tra models có trong thư mục `src/model/`

### Frontend không connect được backend
- Đảm bảo backend đang chạy trên port 8000
- Kiểm tra CORS configuration
- Check console logs (F12)

### Lỗi khi dự báo
- Kiểm tra tên thành phố đúng (tiếng Anh)
- Xem logs trong backend terminal
- Test API endpoint tại `/docs`

## 📚 Tài liệu

- [Integration Summary](INTEGRATION_SUMMARY.md) - Chi tiết tích hợp
- [Weather API Integration](WEATHER_API_INTEGRATION.md) - Hướng dẫn API
- [Flow Weather](flow_weather.md) - Luồng dữ liệu

## 🔄 Data Flow

```
User → CityContext → Weather Components 
  ↓
weatherApi.ts → FastAPI Backend
  ↓  
crawl.py → Open-Meteo API
  ↓
predict.py → ML Models
  ↓
Response → Frontend Display
```

## 🎯 Testing

1. **Test Backend:**
   ```bash
   python test_api.py
   ```

2. **Test Frontend:**
   - Mở http://localhost:5173
   - Thử đổi thành phố
   - Kiểm tra 3 tabs (Today, Hourly, 7-Day)

3. **Test API Documentation:**
   - Mở http://localhost:8000/docs
   - Try out các endpoints

## 📈 Performance

- Backend cache models khi startup
- API response time: ~2-5 giây (tùy thành phố)
- Frontend lazy loading components
- Responsive design cho mobile

## 🔐 Security

- CORS được cấu hình cho development
- No sensitive data trong code
- API rate limiting (nên thêm)

## 🚧 Future Improvements

- [ ] Redis caching cho API responses
- [ ] User authentication
- [ ] Save favorite cities
- [ ] Weather alerts/notifications
- [ ] Historical data visualization
- [ ] Export data to CSV/PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Weather maps integration

## 📄 License

MIT License

## 👥 Contributors

- Backend: FastAPI + ML Models
- Frontend: React + TypeScript
- Integration: Full-stack API integration

---

Made with ❤️ for AgriWeather Project

