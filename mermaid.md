graph LR
    %% ===================================
    %% PHASE 1: USER INPUT & LOCATION
    %% ===================================
    User((👤 User)) -->|🔍 Search| CitySearch[City Search]
    CitySearch -->|City Name| OSM[OpenStreetMap API]
    OSM -->|Lat/Lon| CityContext[(🌍 Location)]
    
    %% ===================================
    %% PHASE 2: BACKEND API (ONE CALL)
    %% ===================================
    CityContext -->|📡 /predict/all| PredictAll[⚡ Predict All]
    
    subgraph Backend["🐍 FastAPI Backend"]
        direction LR
        PredictAll -->|30d history| Archive[Open-Meteo Archive]
        PredictAll -->|168h forecast| Forecast[Open-Meteo Forecast]
        
        Archive -->|Features| LSTM[LSTM Model]
        LSTM -->|7-day| DailyClass[Daily Class]
        
        Forecast -->|Hourly| HourlyClass[Hourly Class]
        
        DailyClass -->|Day 0| Today[today_forecast]
        DailyClass -->|Day 1-7| SevenDay[seven_day_forecast]
        HourlyClass -->|168h| Hourly[hourly_forecast]
        
        Today & SevenDay & Hourly --> JSON[📋 JSON Response]
    end
    
    %% ===================================
    %% PHASE 3: FRONTEND (3 TABS)
    %% ===================================
    JSON -->|Cache| WeatherCtx[(🌦️ Weather)]
    
    subgraph Frontend["⚛️ React Frontend"]
        direction LR
        WeatherCtx -->|today| Tab1[📱 Current<br/>🌡️💧💨☁️]
        
        WeatherCtx -->|hourly| Tab2[📱 Hourly<br/>📊 Charts]
        Tab2 --> TempChart[📈 Temp]
        Tab2 --> PrecipChart[🌧️ Rain]
        Tab2 --> HumidChart[💧 Humid]
        Tab2 --> WindChart[💨 Wind]
        
        WeatherCtx -->|all| Tab3[📱 7-Day<br/>📅 Cards]
        Tab3 -.->|Select| Detail[Day Detail]
    end
    
    %% ===================================
    %% PHASE 4: GROQ AI (Llama 3.3 70B)
    %% ===================================
    subgraph AI["🤖 Groq AI"]
        direction LR
        UserForm[🌾 Input<br/>Crop/Season] -->|Form| SchedPrompt[Schedule<br/>Prompt]
        WeatherCtx -->|7d context| SchedPrompt
        SchedPrompt -->|/schedule| GroqSched[Groq API]
        GroqSched -->|JSON| Tasks[7-Day<br/>Tasks]
        Tasks -->|Save| DB[(🗄️ Supabase)]
        DB -->|Load| AgriUI[🌾 Planner<br/>✏️✅]
        
        Question[💬 Question] -->|Msg| ChatPrompt[Chat<br/>Prompt]
        WeatherCtx -->|Weather| ChatPrompt
        DB -->|Plans| ChatPrompt
        CityContext -->|Location| ChatPrompt
        ChatPrompt -->|/chat| GroqChat[Groq API]
        GroqChat -->|Reply| ChatUI[💬 Chatbot<br/>☀️🌾ℹ️]
    end
    
    %% User Interactions
    Tab1 -.->|Ask| ChatUI
    AgriUI -.->|Help| ChatUI
    
    %% ===================================
    %% STYLING
    %% ===================================
    classDef api fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef model fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef ui fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ai fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef db fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class OSM,Archive,Forecast,GroqSched,GroqChat api
    class LSTM,DailyClass,HourlyClass model
    class Tab1,Tab2,Tab3,TempChart,PrecipChart,HumidChart,WindChart,AgriUI,ChatUI,Detail ui
    class SchedPrompt,ChatPrompt,Tasks,AI ai
    class DB db
