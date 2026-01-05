from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()


# Initialize Groq client lazily to avoid crash on import
def get_groq_client():
    """Get or create Groq client"""
    api_key = os.getenv("GROQ_API_KEY")
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


def chat_with_groq(user_message: str, weather_context: dict, agriculture_context: dict):
    """
    Context-aware chatbot using Groq AI
    
    Args:
        user_message: User's question
        weather_context: Current weather data from predict/all
        agriculture_context: Current agriculture plans
    
    Returns:
        Dict containing AI reply
    """
    from datetime import datetime
    
    # Get current date and time
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    # Convert contexts to formatted strings
    weather_str = json.dumps(weather_context, ensure_ascii=False, indent=2)
    agri_str = json.dumps(agriculture_context, ensure_ascii=False, indent=2)
    
    # Log contexts for debugging
    print(f"\n📅 Current Date/Time: {current_datetime}")
    print(f"🌤️ Weather Context Keys: {list(weather_context.keys()) if weather_context else 'Empty'}")
    print(f"🌾 Agriculture Context Keys: {list(agriculture_context.keys()) if agriculture_context else 'Empty'}")
    
    system_prompt = f"""Bạn là Trợ lý Ảo Nông Nghiệp Thông Minh (Smart Agri-Assistant).

THÔNG TIN NGÀY GIỜ HIỆN TẠI:
📅 Hôm nay là: {current_date}
🕐 Thời gian hiện tại: {current_datetime}

Nhiệm vụ của bạn là hỗ trợ người nông dân bằng cách trả lời câu hỏi dựa trên DỮ LIỆU THỜI TIẾT và KẾ HOẠCH NÔNG VỤ hiện có trên màn hình.

DƯỚI ĐÂY LÀ DỮ LIỆU HIỆN TẠI (Context Data):
---
[THÔNG TIN THỜI TIẾT - WEATHER JSON]:
{weather_str}

[KẾ HOẠCH NÔNG NGHIỆP - AGRICULTURE PLAN JSON]:
{agri_str}
---

CHỈ DẪN TRẢ LỜI THEO 3 LUỒNG (Flow Guidelines):

1. LUỒNG THỜI TIẾT (Khi người dùng hỏi về nắng, mưa, nhiệt độ...):
   - QUAN TRỌNG: Dựa vào today_forecast để nói về thời tiết HÔM NAY ({current_date})
   - Phân tích nhiệt độ thực tế và "cảm giác như" (feels like/apparent_temperature).
   - Đưa ra lời khuyên cụ thể. Ví dụ: "Độ ẩm cao dễ sinh sâu bệnh", "Gió mạnh cần chắn gió cho cây".
   - Dựa vào dự báo 7 ngày (seven_day_forecast) để cảnh báo sớm thiên tai/thời tiết xấu.
   - Giải thích ý nghĩa weather_code và weather_description.
   - Phân tích xu hướng nhiệt độ, lượng mưa, độ ẩm.

2. LUỒNG NÔNG NGHIỆP (Khi người dùng hỏi nên làm gì, kế hoạch...):
   - Nhìn vào JSON Kế hoạch (agriculture_context): Tìm daily_tasks để biết công việc cần làm.
   - Kết hợp thời tiết: Nếu JSON bảo "Tưới cây" nhưng Thời tiết báo "Mưa to", hãy khuyên người dùng HOÃN tưới.
   - Đưa ra lời khuyên về thời điểm thích hợp cho từng công việc (bón phân, phun thuốc, thu hoạch...).
   - Nhắc nhở ghi chép nhật ký nông vụ.
   - Cảnh báo về các rủi ro từ thời tiết (ngập úng, hạn hán, sâu bệnh...).

3. LUỒNG CHUNG (Chào hỏi, hỏi cách dùng app):
   - Hướng dẫn họ xem Tab "Today" để biết thời tiết hôm nay.
   - Hướng dẫn xem Tab "Hourly" để theo dõi thời tiết theo giờ (24h).
   - Hướng dẫn xem Tab "7-Day" để lập kế hoạch dài hạn.
   - Hướng dẫn sang Tab "Agriculture" để tạo và quản lý kế hoạch nông vụ 7 ngày.
   - Luôn giữ thái độ thân thiện, chuyên gia, ngắn gọn và dễ hiểu với bà con nông dân.

LƯU Ý QUAN TRỌNG:
- Tuyệt đối chỉ trả lời dựa trên thông tin có trong JSON ở trên.
- Khi nói "hôm nay", phải dùng đúng ngày {current_date}, KHÔNG được tự bịa ngày khác.
- Nếu không có thông tin, hãy nói "Dữ liệu hiện tại không hiển thị thông tin này. Bạn có thể kiểm tra lại ở tab tương ứng."
- Trả lời bằng tiếng Việt, ngắn gọn (2-4 câu), thân thiện.
- Ưu tiên phân tích số liệu cụ thể thay vì lý thuyết chung chung.
- Đưa ra lời khuyên hành động cụ thể, không chỉ mô tả."""

    try:
        client = get_groq_client()
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500,
        )
        
        bot_reply = chat_completion.choices[0].message.content
        return {"reply": bot_reply}
        
    except Exception as e:
        print(f"Groq Chat Error: {e}")
        raise Exception(f"Failed to chat with AI: {str(e)}")



