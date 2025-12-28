BƯỚC 0: QUẢN LÝ VỊ TRÍ (Global State)
Đây là bước khởi tạo, chạy khi người dùng nhập tên thành phố.

Input: Tên thành phố (User nhập).

API: Open-Meteo Geocoding API ở hàm get_coordinates 

Xử lý:

Lấy lat, lon từ JSON trả về.

Lưu trữ: Lưu vào biến toàn cục hoặc LocalStorage/SessionStorage.

Logic: Nếu người dùng nhập tên mới -> Gọi lại API -> Ghi đè lat, lon cũ.

BƯỚC 1: XỬ LÝ TAB 3 - AI DỰ BÁO 7 NGÀY (Core Logic)
Đây là trái tim của ứng dụng, cần chạy trước để lấy dữ liệu cho Tab 1.

Gọi API (Open-Meteo Historical): ở hàm get_weather_data_30 sau đó process_30day_weather_data,
rồi process_input_7days

Endpoint: 

Params: latitude, longitude, start_date (30 ngày trước), end_date (hôm qua), daily (temp_max, temp_min, rain_sum, wind_speed...).

AI Phase 1 (Regression - deep.keras):

Input: Array 30 ngày dữ liệu quá khứ.

Action: model_7day.predict(input_30_days).

Output (prediction_raw): Mảng số liệu 7 dòng (Nhiệt độ, độ ẩm, gió... cho 7 ngày tới).

AI Phase 2 (Classification - votingC):

Input: Duyệt vòng lặp qua 7 dòng của prediction_raw.

Action: model_daily.predict(row).

Output (weather_labels): 

UI Tab 3:

Vẽ biểu đồ đường từ prediction_raw.

Hiển thị danh sách 7 ngày kèm icon từ weather_labels.

BƯỚC 2: XỬ LÝ TAB 1 - THỜI TIẾT HÔM NAY (Thừa kế từ Tab 3)

Gọi API (Open-Meteo Historical): ở hàm get_weather_data_daily sau đó process_daily_weather_data,
rồi process_input_daily

Action: predict daily weather để dự đoán trạng thái

UI Tab 1:

Hiển thị số to: Nhiệt độ, Độ ẩm, Gió (lấy từ api sau khi process_daily_weather_data).

Hiển thị trạng thái: Icon to và chữ (predict daily weather).



BƯỚC 3: XỬ LÝ TAB 2 - CHI TIẾT 24H (Độc lập)
Chạy song song hoặc chạy sau bước 1.

Gọi API (Open-Meteo Forecast):

Endpoint: 

Params: latitude, longitude, hourly (temperature_2m, relative_humidity_2m, rain, cloud_cover...), forecast_days=1.

AI Phase 3 (Classification - hgbC):

Input: Dữ liệu 24 dòng từ API.

Action: model_hourly.predict(hourly_data_scaled).

Output: Mảng 24 nhãn thời tiết.

UI Tab 2:

Hiển thị danh sách/biểu đồ ngang.

Mỗi giờ gồm: Giờ - Nhiệt độ (API) - Icon thời tiết (AI Output).