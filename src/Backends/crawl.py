import urllib.request
import urllib.parse
import json
import sys
import pandas as pd
import requests
from datetime import datetime, timezone, timedelta


def get_coordinates(location):
    encoded_location = urllib.parse.quote(location)
    url = f"https://api.openweathermap.org/data/2.5/find?q={location}&appid=5796abbde9106b7da4febfae8c44c232&units=metric"

    headers = {
        'Accept': '*/*',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'Connection': 'keep-alive',
        'Origin': 'https://openweathermap.org',
        'Referer': 'https://openweathermap.org/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    }

    response = requests.get(url, headers=headers)

    # Kiểm tra nếu có lỗi xảy ra
    if response.status_code != 200:
        raise Exception(f"API request failed with status code {response.status_code}: {response.text}")

    data = response.json()

    # Kiểm tra nếu danh sách 'list' không trống
    if "list" in data and len(data["list"]) > 0:
        coord = data["list"][0]["coord"]
        return coord
    else:
        raise Exception("Location not found or data unavailable.")


# Hàm giả lập tọa độ (Bạn thay bằng logic thực tế của bạn)

def get_weather_data_24hour(location):
    coord = get_coordinates(location)
    lat = coord["lat"]
    lon = coord["lon"]

    # 1. Cấu hình URL:
    # - forecast_days=2: Lấy 48h để đảm bảo đủ dữ liệu cho việc cắt 24h
    # - timezone=Asia%2FBangkok: API trả về giờ GMT+7
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"hourly=temperature_2m,apparent_temperature,dew_point_2m,precipitation,cloud_cover,"
        f"relative_humidity_2m,wind_gusts_10m,wind_speed_10m,wind_direction_10m,"
        f"surface_pressure,pressure_msl&"
        f"timezone=Asia%2FBangkok&forecast_days=3"
    )

    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)

            # --- BẮT ĐẦU XỬ LÝ CẮT DATA 24H ---
            if 'hourly' in data:
                hourly = data['hourly']
                times = hourly['time']

                # 2. Xử lý thời gian
                # Định nghĩa múi giờ GMT+7
                tz_vn = timezone(timedelta(hours=7))

                # Lấy giờ hiện tại hệ thống theo GMT+7, bỏ thông tin timezone để khớp format API
                now_vn = datetime.now(tz_vn).replace(tzinfo=None)

                # QUAN TRỌNG: Làm tròn về đầu giờ (VD: 23:10:07 -> 23:00:00)
                # Để đảm bảo lấy luôn cả khung giờ hiện tại
                target_time = now_vn.replace(minute=0, second=0, microsecond=0)

                start_index = 0
                found = False

                # 3. Tìm vị trí bắt đầu
                for i, t_str in enumerate(times):
                    t_obj = datetime.strptime(t_str, "%Y-%m-%dT%H:%M")

                    # So sánh: Nếu giờ trong API >= Giờ mục tiêu (đã làm tròn)
                    if t_obj >= target_time:
                        start_index = i
                        found = True
                        break

                if found:
                    # 4. Cắt dữ liệu: Lấy 24 mốc kể từ start_index
                    new_hourly = {}
                    # Duyệt qua tất cả các trường (temp, rain, wind...) và cắt đồng bộ
                    for key, value_list in hourly.items():
                        new_hourly[key] = value_list[start_index: start_index + 24]

                    # Cập nhật lại biến data
                    data['hourly'] = new_hourly
                else:
                    print("Cảnh báo: Không tìm thấy mốc thời gian phù hợp trong dữ liệu API.")

            return data

    except urllib.error.HTTPError as e:
        try:
            error_info = e.read().decode()
        except:
            error_info = str(e)
        print('HTTP Error:', e.code, error_info)
        return None

    except urllib.error.URLError as e:
        print('URL Error:', e.reason)
        return None


def get_weather_data_daily(location):
    coord = get_coordinates(location)
    lat = coord["lat"]
    lon = coord["lon"]

    url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_mean,"
           f"temperature_2m_max,temperature_2m_min,apparent_temperature_mean,apparent_temperature_max,apparent_temperature_min,"
           f"dew_point_2m_mean,precipitation_sum,cloud_cover_mean,relative_humidity_2m_mean,wind_gusts_10m_mean,wind_speed_10m_mean,"
           f"winddirection_10m_dominant,surface_pressure_mean,pressure_msl_mean,daylight_duration,"
           f"sunshine_duration&timezone=Asia%2FBangkok&past_days=31&forecast_days=1")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            return data
    except urllib.error.HTTPError as e:
        try:
            error_info = e.read().decode()
        except:
            error_info = str(e)
        print('HTTP Error:', e.code, error_info)
        return None  # QUAN TRỌNG: Không được sys.exit()

    except urllib.error.URLError as e:
        print('URL Error:', e.reason)
        return None  # QUAN TRỌNG: Không được sys.exit()


def get_weather_data_30(location):
    coord = get_coordinates(location)
    lat = coord["lat"]
    lon = coord["lon"]

    url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_mean,"
           f"temperature_2m_max,temperature_2m_min,apparent_temperature_mean,apparent_temperature_max,apparent_temperature_min,"
           f"dew_point_2m_mean,precipitation_sum,cloud_cover_mean,relative_humidity_2m_mean,wind_gusts_10m_mean,wind_speed_10m_mean,"
           f"winddirection_10m_dominant,surface_pressure_mean,pressure_msl_mean,daylight_duration,"
           f"sunshine_duration&timezone=Asia%2FBangkok&past_days=29&forecast_days=1")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            return data
    except urllib.error.HTTPError as e:
        try:
            error_info = e.read().decode()
        except:
            error_info = str(e)
        print('HTTP Error:', e.code, error_info)
        return None  # QUAN TRỌNG: Không được sys.exit()

    except urllib.error.URLError as e:
        print('URL Error:', e.reason)
        return None  # QUAN TRỌNG: Không được sys.exit()


def process_daily_weather_data(weather):
    # Kiểm tra nếu "daily" có dữ liệu
    if not weather.get("daily") or not weather["daily"].get("time"):
        return pd.DataFrame()  # Nếu không có dữ liệu, trả về DataFrame rỗng

    daily_data = weather["daily"]

    # Lấy dữ liệu ngày đầu tiên (index 0)
    day_weather_data = {
        "time": daily_data["time"][0] if daily_data.get("time") else None,
        "temperature_2m_mean": daily_data["temperature_2m_mean"][0] if daily_data.get("temperature_2m_mean") else None,
        "temperature_2m_max": daily_data["temperature_2m_max"][0] if daily_data.get("temperature_2m_max") else None,
        "temperature_2m_min": daily_data["temperature_2m_min"][0] if daily_data.get("temperature_2m_min") else None,
        "apparent_temperature_mean": daily_data["apparent_temperature_mean"][0] if daily_data.get(
            "apparent_temperature_mean") else None,
        "apparent_temperature_max": daily_data["apparent_temperature_max"][0] if daily_data.get(
            "apparent_temperature_max") else None,
        "apparent_temperature_min": daily_data["apparent_temperature_min"][0] if daily_data.get(
            "apparent_temperature_min") else None,
        "dew_point_2m_mean": daily_data["dew_point_2m_mean"][0] if daily_data.get("dew_point_2m_mean") else None,
        "precipitation_sum": daily_data["precipitation_sum"][0] if daily_data.get("precipitation_sum") else None,
        "cloud_cover_mean": daily_data["cloud_cover_mean"][0] if daily_data.get("cloud_cover_mean") else None,
        "relative_humidity_2m_mean": daily_data["relative_humidity_2m_mean"][0] if daily_data.get(
            "relative_humidity_2m_mean") else None,
        "wind_gusts_10m_mean": daily_data["wind_gusts_10m_mean"][0] if daily_data.get("wind_gusts_10m_mean") else None,
        "wind_speed_10m_mean": daily_data["wind_speed_10m_mean"][0] if daily_data.get("wind_speed_10m_mean") else None,
        "winddirection_10m_dominant": daily_data["winddirection_10m_dominant"][0] if daily_data.get(
            "winddirection_10m_dominant") else None,
        "surface_pressure_mean": daily_data["surface_pressure_mean"][0] if daily_data.get(
            "surface_pressure_mean") else None,
        "pressure_msl_mean": daily_data["pressure_msl_mean"][0] if daily_data.get("pressure_msl_mean") else None,
        "daylight_duration": daily_data["daylight_duration"][0] if daily_data.get("daylight_duration") else None,
        "sunshine_duration": daily_data["sunshine_duration"][0] if daily_data.get("sunshine_duration") else None,
    }

    df_day = pd.DataFrame([day_weather_data])
    return df_day


def process_hourly_weather_data(weather):
    # Kiểm tra nếu "hourly" có dữ liệu
    if not weather.get("hourly") or not weather["hourly"].get("time"):
        return pd.DataFrame()  # Nếu không có dữ liệu, trả về DataFrame rỗng

    hourly_data = weather["hourly"]

    # Lấy số lượng giờ có trong dữ liệu
    num_hours = len(hourly_data["time"])

    processed_hours = []

    # Duyệt qua từng giờ
    for i in range(num_hours):
        hour_data = {
            "time": hourly_data["time"][i] if hourly_data.get("time") else None,
            "temperature_2m": hourly_data["temperature_2m"][i] if hourly_data.get("temperature_2m") else None,
            "apparent_temperature": hourly_data["apparent_temperature"][i] if hourly_data.get(
                "apparent_temperature") else None,
            "dew_point_2m": hourly_data["dew_point_2m"][i] if hourly_data.get("dew_point_2m") else None,
            "precipitation": hourly_data["precipitation"][i] if hourly_data.get("precipitation") else None,
            "cloud_cover": hourly_data["cloud_cover"][i] if hourly_data.get("cloud_cover") else None,
            "relative_humidity_2m": hourly_data["relative_humidity_2m"][i] if hourly_data.get(
                "relative_humidity_2m") else None,
            "wind_gusts_10m": hourly_data["wind_gusts_10m"][i] if hourly_data.get("wind_gusts_10m") else None,
            "wind_speed_10m": hourly_data["wind_speed_10m"][i] if hourly_data.get("wind_speed_10m") else None,
            "wind_direction_10m": hourly_data["wind_direction_10m"][i] if hourly_data.get(
                "wind_direction_10m") else None,
            "surface_pressure": hourly_data["surface_pressure"][i] if hourly_data.get("surface_pressure") else None,
            "pressure_msl": hourly_data["pressure_msl"][i] if hourly_data.get("pressure_msl") else None,
        }

        processed_hours.append(hour_data)

    df_hour = pd.DataFrame(processed_hours)
    return df_hour


def process_30day_weather_data(weather):
    # Kiểm tra nếu "daily" có dữ liệu
    if not weather.get("daily") or not weather["daily"].get("time"):
        return pd.DataFrame()  # Nếu không có dữ liệu, trả về DataFrame rỗng

    daily_data = weather["daily"]

    # Lấy số lượng ngày có trong dữ liệu
    num_days = len(daily_data["time"])

    processed_days = []

    # Duyệt qua từng ngày
    for i in range(num_days):
        day_data = {
            "time": daily_data["time"][i] if daily_data.get("time") else None,
            "temperature_2m_mean": daily_data["temperature_2m_mean"][i] if daily_data.get(
                "temperature_2m_mean") else None,
            "temperature_2m_max": daily_data["temperature_2m_max"][i] if daily_data.get("temperature_2m_max") else None,
            "temperature_2m_min": daily_data["temperature_2m_min"][i] if daily_data.get("temperature_2m_min") else None,
            "apparent_temperature_mean": daily_data["apparent_temperature_mean"][i] if daily_data.get(
                "apparent_temperature_mean") else None,
            "apparent_temperature_max": daily_data["apparent_temperature_max"][i] if daily_data.get(
                "apparent_temperature_max") else None,
            "apparent_temperature_min": daily_data["apparent_temperature_min"][i] if daily_data.get(
                "apparent_temperature_min") else None,
            "dew_point_2m_mean": daily_data["dew_point_2m_mean"][i] if daily_data.get("dew_point_2m_mean") else None,
            "precipitation_sum": daily_data["precipitation_sum"][i] if daily_data.get("precipitation_sum") else None,
            "cloud_cover_mean": daily_data["cloud_cover_mean"][i] if daily_data.get("cloud_cover_mean") else None,
            "relative_humidity_2m_mean": daily_data["relative_humidity_2m_mean"][i] if daily_data.get(
                "relative_humidity_2m_mean") else None,
            "wind_gusts_10m_mean": daily_data["wind_gusts_10m_mean"][i] if daily_data.get(
                "wind_gusts_10m_mean") else None,
            "wind_speed_10m_mean": daily_data["wind_speed_10m_mean"][i] if daily_data.get(
                "wind_speed_10m_mean") else None,
            "winddirection_10m_dominant": daily_data["winddirection_10m_dominant"][i] if daily_data.get(
                "winddirection_10m_dominant") else None,
            "surface_pressure_mean": daily_data["surface_pressure_mean"][i] if daily_data.get(
                "surface_pressure_mean") else None,
            "pressure_msl_mean": daily_data["pressure_msl_mean"][i] if daily_data.get("pressure_msl_mean") else None,
            "daylight_duration": daily_data["daylight_duration"][i] if daily_data.get("daylight_duration") else None,
            "sunshine_duration": daily_data["sunshine_duration"][i] if daily_data.get("sunshine_duration") else None,
        }

        processed_days.append(day_data)

    df_30days = pd.DataFrame(processed_days)
    return df_30days


if __name__ == "__main__":
    # Nhập tên thành phố
    city = input("Nhập tên thành phố (ví dụ: Đà Nẵng): ")

    try:
        # 1. Lấy tọa độ từ tên thành phố
        print(f"\n[1] Lấy tọa độ cho '{city}'...")
        coord = get_coordinates(city)
        lat = coord["lat"]
        lon = coord["lon"]
        print(f"    ✓ Latitude: {lat}, Longitude: {lon}")

        # 2. Lấy dữ liệu thời tiết 24 giờ
        print(f"\n[2] Lấy dữ liệu thời tiết 24 giờ...")
        weather_24h = get_weather_data_24hour(city)
        if weather_24h:
            print(f"    ✓ Đã lấy dữ liệu 24 giờ")
            df_24h = process_hourly_weather_data(weather_24h)
            df_24h.to_csv("weather_24hours.csv", index=False, encoding='utf-8-sig')
            print(f"    ✓ Đã lưu: weather_24hours.csv ({len(df_24h)} giờ)")
            with open("weather_24hours_raw.json", "w", encoding='utf-8') as f:
                json.dump(weather_24h, f, ensure_ascii=False, indent=2)

        # 3. Lấy dữ liệu thời tiết hàng ngày
        print(f"\n[3] Lấy dữ liệu thời tiết hàng ngày...")
        weather_daily = get_weather_data_daily(city)
        if weather_daily:
            print(f"    ✓ Đã lấy dữ liệu hàng ngày")
            df_daily = process_daily_weather_data(weather_daily)
            df_daily.to_csv("weather_daily.csv", index=False, encoding='utf-8-sig')
            print(f"    ✓ Đã lưu: weather_daily.csv")
            with open("weather_daily_raw.json", "w", encoding='utf-8') as f:
                json.dump(weather_daily, f, ensure_ascii=False, indent=2)

        # 4. Lấy dữ liệu thời tiết 30 ngày
        print(f"\n[4] Lấy dữ liệu thời tiết 30 ngày...")
        weather_30d = get_weather_data_30(city)
        if weather_30d:
            print(f"    ✓ Đã lấy dữ liệu 30 ngày")
            df_30d = process_30day_weather_data(weather_30d)
            df_30d.to_csv("weather_30days.csv", index=False, encoding='utf-8-sig')
            print(f"    ✓ Đã lưu: weather_30days.csv ({len(df_30d)} ngày)")
            with open("weather_30days_raw.json", "w", encoding='utf-8') as f:
                json.dump(weather_30d, f, ensure_ascii=False, indent=2)

        print("\n✅ Hoàn tất! Kiểm tra các file CSV và JSON đã tạo.")

    except Exception as e:
        print(f"\n❌ Lỗi: {e}")

