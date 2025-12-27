
import joblib
from keras.models import load_model

import pandas as pd

import numpy as np

from crawl import (
    get_weather_data_daily, get_weather_data_24hour, get_weather_data_30, get_coordinates, 
    process_daily_weather_data, process_hourly_weather_data, process_30day_weather_data)
# ===== MODEL LOADING ===== done
def load_models():
    global predaily_model, scaler_daily, labele_encoder_daily
    global pre7day_model, scaler_x, scaler_y
    global prehourly_model_hgbC, scaler_hourly, labele_encoder_hourly
    #global prehourly_model_deep
    

    base_path = 'D:\\jetbrain\\project\\Agri-Weather\\src\\model'

    try:
        # Load 7-day prediction model
        pre7day_model = load_model(f'{base_path}\\7days\\7day_model.keras')
        scaler_x = joblib.load(f'{base_path}\\7days\\scaler_x.joblib')
        scaler_y = joblib.load(f'{base_path}\\7days\\scaler_y.joblib')

        # Load daily prediction model
        predaily_model = joblib.load(f'{base_path}\\daily\\votingC.joblib')
        scaler_daily = joblib.load(f'{base_path}\\daily\\scaler.joblib')
        labele_encoder_daily = joblib.load(f'{base_path}\\daily\\label_encoder.joblib')

        # Load hourly prediction models
        prehourly_model_hgbC = joblib.load(f'{base_path}\\hourly\\hgbC.joblib')
        #prehourly_model_deep = load_model(f'{base_path}\\hourly\\deep.keras')
        scaler_hourly = joblib.load(f'{base_path}\\hourly\\scaler_hourly.joblib')
        labele_encoder_hourly = joblib.load(f'{base_path}\\hourly\\label_encoder_hourly.joblib')

        print("✅ All models loaded successfully!")
        return True

    except Exception as e:
        print(f"❌ Error loading models: {str(e)}")
        raise
# process input
# Định nghĩa lại SEQ_FEATURES (phải khớp với SEQ_FEATURES đã dùng để train model)
# FEATURES cho model 7day
SEQ_FEATURES = [
    'temperature_2m_mean', 'temperature_2m_max', 'temperature_2m_min',
    'apparent_temperature_mean', 'apparent_temperature_max', 'apparent_temperature_min',
    'dew_point_2m_mean', 'precipitation_sum', 'cloud_cover_mean',
    'relative_humidity_2m_mean', 'wind_gusts_10m_mean',
    'wind_speed_10m_mean', 'winddirection_10m_dominant',
    'surface_pressure_mean', 'pressure_msl_mean', 'daylight_duration',
    'sunshine_duration', 'sin_doy', 'cos_doy'
]
Y_FEATURES = [
    'temperature_2m_mean', 'temperature_2m_max', 'temperature_2m_min',
    'apparent_temperature_mean', 'apparent_temperature_max', 'apparent_temperature_min',
    'dew_point_2m_mean', 'precipitation_sum', 'cloud_cover_mean',
    'relative_humidity_2m_mean', 'wind_gusts_10m_mean',
    'wind_speed_10m_mean', 'winddirection_10m_dominant',
    'surface_pressure_mean', 'pressure_msl_mean', 'daylight_duration',
    'sunshine_duration'
]
#FEATURES cho model hourly
hourly_features = [
    'temperature_2m', 'apparent_temperature', 'dew_point_2m', 'precipitation',
    'cloud_cover', 'relative_humidity_2m', 'wind_gusts_10m', 'wind_speed_10m',
    'wind_direction_10m', 'surface_pressure', 'pressure_msl',
    'sin_hour', 'cos_hour', 'sin_doy', 'cos_doy'
]
# FEATURES cho model daily
daily_features = ['temperature_2m_mean', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_mean', 'apparent_temperature_max', 'apparent_temperature_min',
                           'dew_point_2m_mean', 'precipitation_sum', 'cloud_cover_mean', 'relative_humidity_2m_mean',
                           'wind_gusts_10m_mean', 'wind_speed_10m_mean', 'winddirection_10m_dominant',
                           'surface_pressure_mean', 'pressure_msl_mean', 'daylight_duration', 'sunshine_duration', 'sin_doy', 'cos_doy']

def process_input_7days(df_input_7days, scaler_x, input_window=30):
    """
    Xử lý DataFrame chứa `input_window` ngày dữ liệu cho một địa điểm cụ thể
    vào định dạng yêu cầu bởi mô hình LSTM để dự đoán.

    Args:
        df_input_7days (pd.DataFrame): DataFrame chứa `input_window` hàng (ngày) dữ liệu lịch sử
                                 cho một địa điểm duy nhất. Nó phải chứa cột 'time'
                                 và tất cả các đặc trưng trong `SEQ_FEATURES`.
        scaler_x (StandardScaler): StandardScaler đã được fit trên các đặc trưng `SEQ_FEATURES` của dữ liệu huấn luyện.
        input_window (int): Số bước thời gian (ngày) mà mô hình mong đợi làm đầu vào. Mặc định là 30.

    Returns:
        np.array: Một mảng NumPy 3D phù hợp cho dự đoán mô hình (1, input_window, num_features).
    Raises:
        ValueError: Nếu DataFrame đầu vào không chứa đúng số hàng hoặc thiếu các cột cần thiết.
    """

    if len(df_input_7days) != input_window:
        raise ValueError(f"DataFrame đầu vào phải chứa chính xác {input_window} hàng (ngày). Đã nhận {len(df_input_7days)}.")

    if 'time' not in df_input_7days.columns:
        raise ValueError("DataFrame đầu vào phải có cột 'time' ")

    # Đảm bảo cột 'time' là datetime và trích xuất các đặc trưng theo thời gian
    df_input_7days['time'] = pd.to_datetime(df_input_7days['time'], errors='coerce')
    df_input_7days['year'] = df_input_7days['time'].dt.year
    df_input_7days['month'] = df_input_7days['time'].dt.month
    df_input_7days['day'] = df_input_7days['time'].dt.day
    df_input_7days['dayofyear'] = df_input_7days['time'].dt.dayofyear
    df_input_7days['sin_doy'] = np.sin(2 * np.pi * df_input_7days['dayofyear'] / 365)
    df_input_7days['cos_doy'] = np.cos(2 * np.pi * df_input_7days['dayofyear'] / 365)

    # Sắp xếp theo ngày để đảm bảo thứ tự chuỗi đúng
    df_input_7days = df_input_7days.sort_values('time').reset_index(drop=True)

    # Chọn chỉ các đặc trưng mà mô hình mong đợi (SEQ_FEATURES)
    # Kiểm tra xem tất cả SEQ_FEATURES có trong df_input_7days không
    missing_features = [f for f in SEQ_FEATURES if f not in df_input_7days.columns]
    if missing_features:
        raise ValueError(f"DataFrame đầu vào thiếu các đặc trưng sau: {missing_features}")

    processed_df = df_input_7days[SEQ_FEATURES]

    # Chuẩn hóa các đặc trưng
    scaled_data = scaler_x.transform(processed_df)

    # Thay đổi hình dạng cho mô hình LSTM: (1, input_window, num_features)
    model_input = scaled_data.reshape(1, input_window, len(SEQ_FEATURES))

    return model_input

def process_input_hourly(df_input_hourly):
    # Ensure 'time' column is datetime
    df_input_hourly['time'] = pd.to_datetime(df_input_hourly['time'], errors='coerce')

    # Extract time-based features
    df_input_hourly['hour'] = df_input_hourly['time'].dt.hour
    df_input_hourly['dayofyear'] = df_input_hourly['time'].dt.dayofyear

    df_input_hourly['sin_hour'] = np.sin(2 * np.pi * df_input_hourly['hour'] / 24)
    df_input_hourly['cos_hour'] = np.cos(2 * np.pi * df_input_hourly['hour'] / 24)

    df_input_hourly['sin_doy'] = np.sin(2 * np.pi * df_input_hourly['dayofyear'] / 365)
    df_input_hourly['cos_doy'] = np.cos(2 * np.pi * df_input_hourly['dayofyear'] / 365)

    # Select only the features used for training
    processed_hourly = df_input_hourly[hourly_features]

    # Apply the same scaling used during training
    scaled_data = scaler_hourly.transform(processed_hourly)
    scaled_hourly_df = pd.DataFrame(scaled_data, columns=hourly_features)

    return scaled_hourly_df

def process_input_daily(df_input_daily):
    """
    Chuẩn bị dữ liệu đầu vào cho dự đoán, áp dụng các bước tiền xử lý tương tự như khi huấn luyện.

    Args:
        input_df (pd.DataFrame): DataFrame chứa dữ liệu thô cần dự đoán.
                                  Cần có cột 'date' (chuỗi hoặc datetime).
                                  Các cột khác phải khớp với các đặc trưng được chọn ban đầu.

    Returns:
        pd.DataFrame: DataFrame đã được chuẩn hóa, sẵn sàng để dự đoán.
    """
    processed_daily = df_input_daily.copy()

    # Chuyển đổi cột 'date' sang định dạng datetime và tạo các đặc trưng thời gian
    processed_daily['time'] = pd.to_datetime(processed_daily['time'], errors='coerce')
    processed_daily['dayofyear'] = processed_daily['time'].dt.dayofyear
    processed_daily['sin_doy'] = np.sin(2 * np.pi * processed_daily['dayofyear'] / 365)
    processed_daily['cos_doy'] = np.cos(2 * np.pi * processed_daily['dayofyear'] / 365)

    # Loại bỏ các cột không cần thiết cho mô hình
    df_processed = processed_daily.drop(columns=['time', 'dayofyear'], errors='ignore')

    # Đảm bảo các cột theo đúng thứ tự đã huấn luyện và chỉ chọn các đặc trưng đã sử dụng
    df_processed = df_processed[daily_features]

    # Áp dụng StandardScaler
    scaled_data_daily = scaler_daily.transform(df_processed)
    df_scaled_daily = pd.DataFrame(scaled_data_daily, columns=daily_features)

    return df_scaled_daily

def predict_weather_7days(
    input_history_df: pd.DataFrame,
    scaler_x,
    scaler_y,
    model,
    input_window: int = 30
) :
    """
    Dự đoán thời tiết 7 ngày tiếp theo dựa trên 30 ngày lịch sử.

    Args:
        input_history_df (pd.DataFrame): DataFrame chứa 30 ngày lịch sử.
                                         Bắt buộc có cột 'time' và các feature trong SEQ_FEATURES.
        scaler_x: Scaler cho dữ liệu đầu vào (X).
        scaler_y: Scaler cho dữ liệu đầu ra (Y).
        model: Mô hình LSTM đã train.
        input_window (int): Số ngày lịch sử (mặc định 30).

    Returns:
        pd.DataFrame: DataFrame dự đoán 7 ngày tiếp theo (có cột time).
    """

    # ===============================
    # 0. Copy & validate dữ liệu
    # ===============================
    if not isinstance(input_history_df, pd.DataFrame):
        raise TypeError("input_history_df phải là pandas DataFrame")

    df = input_history_df.copy()

    # ===============================
    # 1. Validate số lượng ngày
    # ===============================
    if len(df) != input_window:
        raise ValueError(
            f"Cần đúng {input_window} ngày dữ liệu lịch sử, "
            f"nhận được {len(df)} ngày"
        )

    # ===============================
    # 2. ÉP KIỂU TIME → DATETIME (FIX LỖI CHÍNH)
    # ===============================
    if 'time' not in df.columns:
        raise ValueError("Thiếu cột 'time' trong dữ liệu đầu vào")

    df['time'] = pd.to_datetime(df['time'], errors='coerce')

    if df['time'].isna().any():
        raise ValueError("Cột 'time' có giá trị không hợp lệ (NaT)")

    # Sắp xếp lại theo thời gian cho chắc chắn
    df = df.sort_values('time').reset_index(drop=True)

    # ===============================
    # 3. Tiền xử lý cho mô hình
    # ===============================
    model_input = process_input_7days(
        df,
        scaler_x,
        input_window=input_window
    )

    # ===============================
    # 4. Predict (scaled)
    # ===============================
    scaled_predictions = model.predict(model_input, verbose=0)

    if scaled_predictions.ndim != 3:
        raise ValueError(
            f"Output model không hợp lệ, shape={scaled_predictions.shape}"
        )

    # ===============================
    # 5. Inverse scale kết quả
    # ===============================
    unscaled_predictions = scaler_y.inverse_transform(
        scaled_predictions.reshape(-1, scaled_predictions.shape[-1])
    ).reshape(scaled_predictions.shape)

    # ===============================
    # 6. Tạo mốc thời gian cho 7 ngày tiếp theo
    # ===============================
    last_date = df['time'].max()
    prediction_dates = pd.date_range(
        start=last_date + pd.Timedelta(days=1),
        periods=7,
        freq='D'
    )

    # ===============================
    # 7. Tạo DataFrame kết quả
    # ===============================
    predictions_df = pd.DataFrame(
        unscaled_predictions[0],
        columns=Y_FEATURES
    )

    predictions_df.insert(0, 'time', prediction_dates)

    return predictions_df

def predict_weather_hourly(prepared_data_hourly):
    # Make predictions
    predictions_hourly_encoded = prehourly_model_hgbC.predict(prepared_data_hourly)

    # Inverse transform the predictions to get original weather codes
    predictions_hourly = labele_encoder_hourly.inverse_transform(predictions_hourly_encoded)

    return predictions_hourly

def predict_weather_code(prepared_data_daily):
    """
    Dự đoán mã thời tiết dựa trên dữ liệu đã được chuẩn bị.

    Args:
        prepared_data (pd.DataFrame): DataFrame chứa dữ liệu đã được chuẩn hóa,
                                      được tạo bởi hàm `prepare_input_data`.

    Returns:
        list: Danh sách các mã thời tiết dự đoán (giá trị gốc trước khi mã hóa).
    """
    predictions_encoded_daily = predaily_model.predict(prepared_data_daily)
    predictions_daily = labele_encoder_daily.inverse_transform(predictions_encoded_daily)
    return predictions_daily.tolist()

if __name__ == "__main__":
    import sys

    # Load models first
    print("Loading models...")
    load_models()

    # Get city name from user
    city = input("Enter city name: ").strip()
    if not city:
        print("City name cannot be empty!")
        sys.exit(1)

    try:
        # Step 1: Get coordinates
        print(f"\n🌍 Getting coordinates for {city}...")
        coord = get_coordinates(city)
        lat = coord["lat"]
        lon = coord["lon"]
        print(f"    ✓ Latitude: {lat}, Longitude: {lon}")

        # Step 2: Crawl weather data (30 days)
        print(f"\n📡 Fetching 30-day weather data...")
        weather_30d = get_weather_data_30(city)
        print("✅ Weather data fetched successfully")

        # Step 3: Process to CSV/DataFrame
        print(f"\n📊 Processing weather data...")
        df_30d = process_30day_weather_data(weather_30d)
        print(f"✅ Processed {len(df_30d)} days of data")
        print("\nFirst few rows:")
        print(df_30d.head())

        # Step 5: Make prediction
        print(f"\n🔮 Predicting next 7 days...")
        predictions_df = predict_weather_7days(
            df_30d,
            scaler_x,
            scaler_y,
            pre7day_model,
            input_window=30
        )
        print(f"\n finish predicting next 7 days")

        # Display results
        print("\n" + "=" * 80)
        print(f"🌤️  7-DAY WEATHER FORECAST FOR {city.upper()}")
        print("=" * 80)
        print(predictions_df.to_string(index=False))
        print("=" * 80)

        # Optional: Save to CSV
        output_file = f"{city}_7day_forecast.csv"
        predictions_df.to_csv(output_file, index=False)
        print(f"\n💾 Results saved to {output_file}")
        # ==================== HOURLY PREDICTION ====================
        print(f"\n📡 Fetching 24-hour weather data...")
        weather_24h = get_weather_data_24hour(city)
        print("✅ 24-hour weather data fetched successfully")

        # Process hourly data
        print(f"\n📊 Processing hourly weather data...")
        df_hourly = process_hourly_weather_data(weather_24h)
        print(f"✅ Processed {len(df_hourly)} hours of data")
        print("\nFirst few rows:")
        df_hourly.head()

        # Prepare input for hourly prediction
        prepared_hourly = process_input_hourly(df_hourly)

        # Make hourly prediction
        print(f"\n🔮 Predicting hourly weather codes...")
        predictions_hourly = predict_weather_hourly(prepared_hourly)

        # Create result DataFrame
        hourly_result = df_hourly[['time']].copy()
        hourly_result['predicted_weather_code'] = predictions_hourly

        # Display hourly results
        print("\n" + "=" * 80)
        print(f"⏰ 24-HOUR WEATHER CODE FORECAST FOR {city.upper()}")
        print("=" * 80)
        print(hourly_result.to_string(index=False))
        print("=" * 80)

        # Save hourly forecast
        output_hourly = f"{city}_hourly_forecast.csv"
        hourly_result.to_csv(output_hourly, index=False)
        print(f"\n💾 Hourly results saved to {output_hourly}")

        # ==================== DAILY WEATHER CODE PREDICTION ====================
        print(f"\n📡 Fetching daily weather data...")
        weather_daily = get_weather_data_daily(city)
        print("✅ Daily weather data fetched successfully")

    # Process daily data
        print(f"\n📊 Processing daily weather data...")
        df_daily = process_daily_weather_data(weather_daily)
        print(f"✅ Processed {len(df_daily)} days of data")
        print("\nFirst few rows:")
        print(df_daily.head())

    # Prepare input for daily prediction
        prepared_daily = process_input_daily(df_daily)

    # Make daily weather code prediction
        print(f"\n🔮 Predicting daily weather codes...")
        predictions_daily = predict_weather_code(prepared_daily)

    # Create result DataFrame
        daily_result = df_daily[['time']].copy()
        daily_result['predicted_weather_code'] = predictions_daily

    # Display daily results
        print("\n" + "=" * 80)
        print(f"📅 DAILY WEATHER CODE FORECAST FOR {city.upper()}")
        print("=" * 80)
        print(daily_result.to_string(index=False))
        print("=" * 80)

    # Save daily forecast
        output_daily = f"{city}_daily_forecast.csv"
        daily_result.to_csv(output_daily, index=False)
        print(f"\n💾 Daily results saved to {output_daily}")

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        