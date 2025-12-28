from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from predict import (
    load_models,
    predict_weather_7days,
    predict_weather_hourly,
    predict_weather_daily,
    decode_wmo_code_batch,
    process_input_hourly,
    process_input_daily
)
from crawl import (
    get_coordinates,
    get_weather_data_30,
    get_weather_data_24hour,
    get_weather_data_daily,
    process_30day_weather_data,
    process_hourly_weather_data,
    process_daily_weather_data
)

app = FastAPI(title="Weather Prediction API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class CityRequest(BaseModel):
    city: str


# Response models
class CoordinatesResponse(BaseModel):
    lat: float
    lon: float
    city: str


@app.on_event("startup")
async def startup_event():
    """Load all models when server starts"""
    print("🚀 Loading models...")
    load_models()
    print("✅ Models loaded successfully!")


@app.get("/")
async def root():
    return {"message": "Weather Prediction API is running"}


@app.post("/api/coordinates")
async def get_city_coordinates(request: CityRequest):
    """Get coordinates for a city"""
    try:
        coord = get_coordinates(request.city)
        return CoordinatesResponse(
            lat=coord["lat"],
            lon=coord["lon"],
            city=request.city
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/predict/7days")
async def predict_7days(request: CityRequest):
    """Predict weather for next 7 days"""
    try:
        import predict

        weather_30d = get_weather_data_30(request.city)
        df_30d = process_30day_weather_data(weather_30d)

        predictions_df = predict_weather_7days(
            df_30d,
            predict.scaler_x,
            predict.scaler_y,
            predict.pre7day_model,
            input_window=30
        )

        result = predictions_df.to_dict(orient="records")
        return {"city": request.city, "predictions": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/hourly")
async def predict_hourly(request: CityRequest):
    """Predict hourly weather codes for next 24 hours with full weather data"""
    try:
        weather_24h = get_weather_data_24hour(request.city)
        df_hourly = process_hourly_weather_data(weather_24h)

        prepared_hourly = process_input_hourly(df_hourly)
        predictions_hourly = predict_weather_hourly(prepared_hourly)

        weather_descriptions = decode_wmo_code_batch(predictions_hourly)

        # Create detailed hourly forecast with all weather parameters
        hourly_forecast = []
        for i in range(len(predictions_hourly)):
            # Helper function to safely convert to float
            def safe_float(value):
                if pd.isna(value) or value is None:
                    return 0.0
                return float(value)

            hourly_data = {
                "time": str(df_hourly.iloc[i]['time']),
                "weather_code": int(predictions_hourly[i]),
                "weather_description": weather_descriptions[i],
                "raw_data": {
                    "temperature_2m": safe_float(df_hourly.iloc[i]['temperature_2m']),
                    "apparent_temperature": safe_float(df_hourly.iloc[i]['apparent_temperature']),
                    "dew_point_2m": safe_float(df_hourly.iloc[i]['dew_point_2m']),
                    "precipitation": safe_float(df_hourly.iloc[i]['precipitation']),
                    "cloud_cover": safe_float(df_hourly.iloc[i]['cloud_cover']),
                    "relative_humidity_2m": safe_float(df_hourly.iloc[i]['relative_humidity_2m']),
                    "wind_gusts_10m": safe_float(df_hourly.iloc[i]['wind_gusts_10m']),
                    "wind_speed_10m": safe_float(df_hourly.iloc[i]['wind_speed_10m']),
                    "wind_direction_10m": safe_float(df_hourly.iloc[i]['wind_direction_10m']),
                    "surface_pressure": safe_float(df_hourly.iloc[i]['surface_pressure']),
                    "pressure_msl": safe_float(df_hourly.iloc[i]['pressure_msl'])
                }
            }
            hourly_forecast.append(hourly_data)

        return {
            "city": request.city,
            "predictions": hourly_forecast
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/daily")
async def predict_daily(request: CityRequest):
    """Predict daily weather code"""
    try:
        weather_daily = get_weather_data_daily(request.city)
        df_daily = process_daily_weather_data(weather_daily)

        prepared_daily = process_input_daily(df_daily)
        predictions_daily = predict_weather_daily(prepared_daily)

        weather_description = decode_wmo_code_batch(predictions_daily)

        result = df_daily[['time']].copy()
        result['weather_code'] = predictions_daily
        result['weather_description'] = weather_description

        return {
            "city": request.city,
            "prediction": result.to_dict(orient="records")[0],
            "raw_data": df_daily.to_dict(orient="records")[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/weather/raw/all")
async def get_raw_weather_all(request: CityRequest):
    """Get all raw weather data at once"""
    try:
        coord = get_coordinates(request.city)
        weather_30d = get_weather_data_30(request.city)
        weather_24h = get_weather_data_24hour(request.city)
        weather_daily = get_weather_data_daily(request.city)

        df_30d = process_30day_weather_data(weather_30d)
        df_hourly = process_hourly_weather_data(weather_24h)
        df_daily = process_daily_weather_data(weather_daily)

        return {
            "city": request.city,
            "coordinates": coord,
            "data_30days": {
                "total_days": len(df_30d),
                "processed": df_30d.to_dict(orient="records"),
                "raw": weather_30d
            },
            "data_24hours": {
                "total_hours": len(df_hourly),
                "processed": df_hourly.to_dict(orient="records"),
                "raw": weather_24h
            },
            "data_daily": {
                "processed": df_daily.to_dict(orient="records")[0],
                "raw": weather_daily
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/predict/all")
async def predict_all(request: CityRequest):
    """Get all predictions at once (7-day, hourly, daily)"""
    try:
        import predict

        weather_30d = get_weather_data_30(request.city)
        weather_24h = get_weather_data_24hour(request.city)
        weather_daily = get_weather_data_daily(request.city)

        df_30d = process_30day_weather_data(weather_30d)
        df_hourly = process_hourly_weather_data(weather_24h)
        df_daily = process_daily_weather_data(weather_daily)

        predictions_7day = predict_weather_7days(
            df_30d,
            predict.scaler_x,
            predict.scaler_y,
            predict.pre7day_model
        )

        prepared_hourly = process_input_hourly(df_hourly)
        predictions_hourly = predict_weather_hourly(prepared_hourly)
        hourly_descriptions = decode_wmo_code_batch(predictions_hourly)

        prepared_daily = process_input_daily(df_daily)
        predictions_daily = predict_weather_daily(prepared_daily)
        daily_description = decode_wmo_code_batch(predictions_daily)

        return {
            "city": request.city,
            "seven_day_forecast": predictions_7day.to_dict(orient="records"),
            "hourly_forecast": [
                {
                    "time": df_hourly.iloc[i]['time'],
                    "weather_code": int(predictions_hourly[i]),
                    "weather_description": hourly_descriptions[i],
                    "raw_data": {
                        "temperature_2m": df_hourly.iloc[i]['temperature_2m'],
                        "apparent_temperature": df_hourly.iloc[i]['apparent_temperature'],
                        "dew_point_2m": df_hourly.iloc[i]['dew_point_2m'],
                        "precipitation": df_hourly.iloc[i]['precipitation'],
                        "cloud_cover": df_hourly.iloc[i]['cloud_cover'],
                        "relative_humidity_2m": df_hourly.iloc[i]['relative_humidity_2m'],
                        "wind_gusts_10m": df_hourly.iloc[i]['wind_gusts_10m'],
                        "wind_speed_10m": df_hourly.iloc[i]['wind_speed_10m'],
                        "wind_direction_10m": df_hourly.iloc[i]['wind_direction_10m'],
                        "surface_pressure": df_hourly.iloc[i]['surface_pressure'],
                        "pressure_msl": df_hourly.iloc[i]['pressure_msl']
                    }
                }
                for i in range(len(predictions_hourly))
            ],
            "today_forecast": {
                "time": df_daily.iloc[0]['time'],
                "weather_code": int(predictions_daily[0]),
                "weather_description": daily_description[0],
                "raw_data": df_daily.to_dict(orient="records")[0]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
    #uvicorn
    #main: app - -reload
    #http://127.0.0.1:8000/docs#/