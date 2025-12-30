from groq import Groq
import os
import json

# Initialize Groq client lazily to avoid crash on import
def get_groq_client():
    """Get or create Groq client"""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set. Please set it to use AI features.")
    return Groq(api_key=api_key)

def generate_farming_schedule(crop_name: str, location: str, season: str, weather_forecast: dict, notes: str = ""):
    """
    Generate a 7-day farming schedule using Groq AI with llama-3.3-70b-versatile
    
    Args:
        crop_name: Name of the crop to plan for
        location: Farm location/field name
        season: Season or goal for farming
        weather_forecast: 7-day weather forecast data
        notes: Additional notes from user
    
    Returns:
        Dict containing tasks list for 7 days
    """
    
    # Format weather data for the prompt
    weather_summary = []
    for day in weather_forecast.get('seven_day_forecast', []):
        weather_summary.append({
            "date": day.get('time'),
            "weather": day.get('weather_description', 'Unknown'),
            "temp_max": day.get('temperature_2m_max', 0),
            "temp_min": day.get('temperature_2m_min', 0),
            "precipitation": day.get('precipitation_sum', 0),
            "humidity": day.get('relative_humidity_2m_mean', 0),
            "wind_speed": day.get('wind_speed_10m_mean', 0)
        })
    
    prompt = f"""You are an expert agricultural advisor. Generate a detailed 7-day farming schedule based on the following information:

**FARM INFORMATION:**
- Crop: {crop_name}
- Location: {location}
- Season/Goal: {season}
- Additional Notes: {notes if notes else "None"}

**WEATHER FORECAST (Next 7 Days):**
{json.dumps(weather_summary, indent=2)}

**INSTRUCTIONS:**
1. Create EXACTLY 7 tasks (one for each day, day 0 to day 6)
2. Each task should consider the weather conditions for that specific day
3. Tasks should be practical and relevant to {crop_name} cultivation
4. Consider temperature, rainfall, and humidity when planning activities
5. Include preventive measures if bad weather is forecasted
6. Keep descriptions concise (max 60 characters)
7. Provide detailed instructions in the details field

**OUTPUT FORMAT (JSON ONLY):**
{{
  "tasks": [
    {{
      "day": 0,
      "description": "Brief task title",
      "details": "Detailed instructions considering weather: temperature, rain, humidity, etc."
    }},
    {{
      "day": 1,
      "description": "Brief task title",
      "details": "Detailed instructions considering weather conditions"
    }},
    ... (continue for days 2-6)
  ]
}}

Generate ONLY the JSON response, no additional text."""

    try:
        client = get_groq_client()
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert agricultural advisor. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Parse JSON from response
        try:
            result = json.loads(response_text)
            
            # Validate that we have exactly 7 tasks
            if "tasks" not in result:
                raise ValueError("Response missing 'tasks' field")
            
            if len(result["tasks"]) != 7:
                raise ValueError(f"Expected 7 tasks, got {len(result['tasks'])}")
            
            # Ensure each task has required fields
            for i, task in enumerate(result["tasks"]):
                if "day" not in task:
                    task["day"] = i
                if "description" not in task:
                    task["description"] = f"Task for day {i}"
                if "details" not in task:
                    task["details"] = "No details provided"
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response was: {response_text}")
            raise ValueError(f"Failed to parse AI response as JSON: {e}")
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise Exception(f"Failed to generate schedule: {str(e)}")


def test_groq_connection():
    """Test if Groq API key is configured correctly"""
    try:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return {"status": "error", "message": "GROQ_API_KEY not set in environment"}
        
        # Simple test request
        client = get_groq_client()
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello"}],
            model="llama-3.3-70b-versatile",
            max_tokens=10
        )
        
        return {"status": "success", "message": "Groq API connected successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

