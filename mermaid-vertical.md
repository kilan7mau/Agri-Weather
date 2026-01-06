graph TB
    %% USER INPUT
    User((👤 User)) -->|Search City| CitySearch[City Search]
    CitySearch --> OSM[OpenStreetMap API]
    OSM --> Location[(📍 Location)]
    
    %% BACKEND - PREDICT ALL
    Location -->|/api/predict/all| Backend[🐍 FastAPI Backend]
    
    subgraph Backend
        API[Open-Meteo API] --> Models[🤖 ML Models]
        Models --> LSTM[LSTM Model]
        Models --> Classify[Classification Model]
        LSTM & Classify --> Response[JSON Response]
    end
    
    Response --> Cache[(💾 Cache)]
    
    %% FRONTEND - 3 TABS
    Cache --> Tab1[📱 Current Weather]
    Cache --> Tab2[📊 Hourly Charts]
    Cache --> Tab3[📅 7-Day Forecast]
    
    %% GROQ AI
    UserInput[🌾 User Input] --> GroqSchedule[🤖 Groq AI]
    Cache --> GroqSchedule
    GroqSchedule --> Schedule[7-Day Plan]
    Schedule --> DB[(🗄️ Supabase)]
    DB --> AgriUI[🌾 Planner UI]
    
    UserChat[💬 Question] --> GroqChat[🤖 Groq AI]
    Cache --> GroqChat
    DB --> GroqChat
    GroqChat --> ChatUI[💬 Chatbot]
    
    %% STYLING
    classDef api fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef model fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef ui fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ai fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef db fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class OSM,API api
    class Models,LSTM,Classify model
    class Tab1,Tab2,Tab3,AgriUI,ChatUI ui
    class GroqSchedule,GroqChat ai
    class DB,Cache db
