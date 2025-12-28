# Quick Start Guide

## 1. Start Backend (Terminal 1)

```bash
cd src/Backends
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend sẽ chạy tại: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 2. Start Frontend (Terminal 2)

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Test API

Mở trình duyệt và vào: http://localhost:8000/docs

Test endpoint `/api/predict/daily` với:
```json
{
  "city": "Hanoi"
}
```

## Các thành phố hỗ trợ

- Hanoi (Hà Nội)
- Da Nang (Đà Nẵng)
- Ho Chi Minh (Hồ Chí Minh)
- Hoặc tên thành phố khác bằng tiếng Anh

## Troubleshooting

### Lỗi: Models not found
Kiểm tra các thư mục model:
- `src/model/7days/`
- `src/model/hourly/`
- `src/model/daily/`

### Lỗi: CORS
Backend đã được cấu hình CORS cho phép tất cả origins.

### Lỗi: Connection refused
Đảm bảo backend đang chạy trên port 8000.

