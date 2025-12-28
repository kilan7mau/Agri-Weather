"""
Quick test script for Weather Prediction API
Run this after starting the backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("=" * 50)
    print("Testing Weather Prediction API")
    print("=" * 50)
    
    # Test health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
        return
    
    # Test daily prediction
    print("\n2. Testing daily prediction for Hanoi...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict/daily",
            json={"city": "Hanoi"}
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   City: {data.get('city')}")
        print(f"   Weather: {data.get('weather_description')}")
        print(f"   Temperature: {data.get('raw_data', {}).get('temperature_2m_mean')}°C")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test hourly prediction
    print("\n3. Testing hourly prediction for Da Nang...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict/hourly",
            json={"city": "Da Nang"}
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   City: {data.get('city')}")
        print(f"   Hours available: {len(data.get('predictions', []))}")
        if data.get('predictions'):
            first_hour = data['predictions'][0]
            print(f"   First hour: {first_hour.get('time')}")
            print(f"   Weather: {first_hour.get('weather_description')}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 7-day prediction
    print("\n4. Testing 7-day prediction for Ho Chi Minh...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict/7days",
            json={"city": "Ho Chi Minh"}
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   City: {data.get('city')}")
        print(f"   Days available: {len(data.get('predictions', []))}")
        if data.get('predictions'):
            today = data['predictions'][0]
            print(f"   Today: {today.get('date')}")
            print(f"   High/Low: {today.get('temperature_2m_max')}°C / {today.get('temperature_2m_min')}°C")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test coordinates
    print("\n5. Testing coordinates endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/coordinates",
            json={"city": "Paris"}
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   City: {data.get('city')}")
        print(f"   Coordinates: {data.get('lat')}, {data.get('lon')}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")
    print("=" * 50)

if __name__ == "__main__":
    test_api()

