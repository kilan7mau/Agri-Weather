import pandas as pd
import numpy as np
from joblib import load

# Đường dẫn đến các file đã lưu
scaler = load('/content/scaler.joblib')
encoder=load('/content/label_encoder.joblib')
best_model = load('/content/votingC.joblib')



# Định nghĩa lại các features cuối cùng đã được sử dụng (từ cell `UefjlYNvJEz8`)
final_selected_features = ['temperature_2m_mean', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_mean', 'apparent_temperature_max', 'apparent_temperature_min',
                           'dew_point_2m_mean', 'precipitation_sum', 'cloud_cover_mean', 'relative_humidity_2m_mean',
                           'wind_gusts_10m_mean', 'wind_speed_10m_mean', 'winddirection_10m_dominant',
                           'surface_pressure_mean', 'pressure_msl_mean', 'daylight_duration', 'sunshine_duration', 'sin_doy', 'cos_doy']

### Hàm chuẩn bị dữ liệu đầu vào

def prepare_input_data(input_df):
    """
    Chuẩn bị dữ liệu đầu vào cho dự đoán, áp dụng các bước tiền xử lý tương tự như khi huấn luyện.

    Args:
        input_df (pd.DataFrame): DataFrame chứa dữ liệu thô cần dự đoán.
                                  Cần có cột 'date' (chuỗi hoặc datetime).
                                  Các cột khác phải khớp với các đặc trưng được chọn ban đầu.

    Returns:
        pd.DataFrame: DataFrame đã được chuẩn hóa, sẵn sàng để dự đoán.
    """
    df_processed = input_df.copy()

    # Chuyển đổi cột 'date' sang định dạng datetime và tạo các đặc trưng thời gian
    df_processed['date'] = pd.to_datetime(df_processed['date'], errors='coerce')
    df_processed['dayofyear'] = df_processed['date'].dt.dayofyear
    df_processed['sin_doy'] = np.sin(2 * np.pi * df_processed['dayofyear'] / 365)
    df_processed['cos_doy'] = np.cos(2 * np.pi * df_processed['dayofyear'] / 365)

    # Loại bỏ các cột không cần thiết cho mô hình
    df_processed = df_processed.drop(columns=['date', 'dayofyear'], errors='ignore')

    # Đảm bảo các cột theo đúng thứ tự đã huấn luyện và chỉ chọn các đặc trưng đã sử dụng
    df_processed = df_processed[final_selected_features]

    # Áp dụng StandardScaler
    scaled_data = scaler.transform(df_processed)
    df_scaled = pd.DataFrame(scaled_data, columns=final_selected_features)

    return df_scaled

### Hàm dự đoán

def predict_weather_code(prepared_data):
    """
    Dự đoán mã thời tiết dựa trên dữ liệu đã được chuẩn bị.

    Args:
        prepared_data (pd.DataFrame): DataFrame chứa dữ liệu đã được chuẩn hóa,
                                      được tạo bởi hàm `prepare_input_data`.

    Returns:
        list: Danh sách các mã thời tiết dự đoán (giá trị gốc trước khi mã hóa).
    """
    predictions_encoded = best_model.predict(prepared_data)
    predictions_original = encoder.inverse_transform(predictions_encoded)
    return predictions_original.tolist()

### Ví dụ sử dụng

# Tạo dữ liệu đầu vào mẫu cho một ngày cụ thể
# Các giá trị này chỉ là ví dụ và bạn nên thay thế bằng dữ liệu thực tế.
# Đảm bảo tất cả các cột trừ 'date' đều có mặt và đúng tên.
sample_data = pd.DataFrame({
    'date': ['2023-01-15'],
    'temperature_2m_mean': [22.5],
    'temperature_2m_max': [26.0],
    'temperature_2m_min': [19.0],
    'apparent_temperature_mean': [24.0],
    'apparent_temperature_max': [28.0],
    'apparent_temperature_min': [20.0],
    'dew_point_2m_mean': [18.0],
    'precipitation_sum': [0.5],
    'rain_sum': [0.5], # rain_sum is removed by DropDuplicateFeatures because it's identical to precipitation_sum
    'snowfall_sum': [0.0],
    'cloud_cover_mean': [60],
    'relative_humidity_2m_mean': [85],
    'wind_gusts_10m_mean': [15.0],
    'wind_speed_10m_mean': [8.0],
    'winddirection_10m_dominant': [120],
    'surface_pressure_mean': [1015.0],
    'pressure_msl_mean': [1017.0],
    'daylight_duration': [38000.0],
    'sunshine_duration': [10000.0],
    'province_id': [1] # province_id was used for sorting but not as a feature in the final model, can be ignored or set to a default if not a feature.
})

# Chuẩn bị dữ liệu
prepared_sample_data = prepare_input_data(sample_data)

# Thực hiện dự đoán
predicted_codes = predict_weather_code(prepared_sample_data)

print(f"Dữ liệu đầu vào mẫu:\n{sample_data}")
print(f"\nMã thời tiết dự đoán cho dữ liệu mẫu là: {predicted_codes}")

# Để giải thích mã thời tiết (ví dụ: tra cứu trong tài liệu WMO)
# 'weather_code' ban đầu là một mã số. Bạn có thể cần một ánh xạ để chuyển
# các mã này thành mô tả dễ hiểu hơn (ví dụ: 0 = Clear sky, 51 = Drizzle light, etc.)
# Dưới đây là một ví dụ về cách ánh xạ (bạn cần bổ sung đầy đủ)
weather_code_map = {
    0: 'Clear sky',
    1: 'Mainly clear, partly cloudy, or overcast',
    2: 'Mainly clear, partly cloudy, or overcast',
    3: 'Mainly clear, partly cloudy, or overcast',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense',
    61: 'Rain: Light',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy'
    # Thêm các mã khác nếu cần
}

described_predictions = [weather_code_map.get(code, f'Unknown code: {code}') for code in predicted_codes]
print(f"Mô tả thời tiết dự đoán: {described_predictions}")