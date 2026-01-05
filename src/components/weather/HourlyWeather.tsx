import { Cloud, Sun, CloudSun, CloudFog, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, LucideIcon } from 'lucide-react';
import { getWeatherIcon, getWindDirection, type HourlyWeatherItem } from '../../lib/weatherApi';

interface HourlyWeatherProps {
  data: HourlyWeatherItem[];
}

export default function HourlyWeather({ data }: HourlyWeatherProps) {
  // Icon map for converting icon name string to component
  const iconMap: Record<string, LucideIcon> = {
    Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning
  };
  
  const getIconComponent = (code: number): LucideIcon => {
    const iconName = getWeatherIcon(code);
    return iconMap[iconName] || Cloud;
  };

  const formatTime = (timeStr: string, index: number) => {
    if (index === 0) return 'Now';
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const hourlyData = data.slice(0, 24);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {hourlyData.map((hour, index) => {
              const Icon = getIconComponent(hour.weather_code);
              const temp = Math.round(hour.raw_data.temperature_2m || 0);
              const humidity = Math.round(hour.raw_data.relative_humidity_2m || 0);
              const wind = Math.round(hour.raw_data.wind_speed_10m || 0);
              // const windDir = getWindDirection(hour.raw_data.wind_direction_10m || 0);
              
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-24 rounded-lg p-3 text-center transition-all ${
                    index === 0
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-2 ${index === 0 ? 'text-white' : 'text-gray-600'}`}>
                    {formatTime(hour.time, index)}
                  </p>
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${index === 0 ? 'text-white' : 'text-gray-400'}`} />
                  <p className={`text-2xl font-bold mb-1 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>
                    {temp}°
                  </p>
                  <p className={`text-xs font-semibold ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                    {hour.weather_description.split(':')[0]}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>💧</span>
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>{humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>💨</span>
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>{wind}km/h </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>🌧️</span>
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>{(hour.raw_data?.precipitation ?? 0).toFixed(1)}mm</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>☁️</span>
                      <span className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>{Math.round(hour.raw_data?.cloud_cover ?? 0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Temperature Trend - Line Chart with 2 lines */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌡️ Hourly Temperature Trend (24h)
          </h3>
          
          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Temp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Feels Like</span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="h-56 relative">
            {(() => {
              // Calculate min/max once for better performance
              const temps = hourlyData.map(h => h.raw_data.temperature_2m || 0);
              const apparents = hourlyData.map(h => h.raw_data.apparent_temperature || 0);
              const allTemps = [...temps, ...apparents];
              const maxTemp = Math.max(...allTemps);
              const minTemp = Math.min(...allTemps);
              const tempRange = maxTemp - minTemp;
              
              // Helper function to convert data to chart coordinates
              const getChartPoint = (value: number, index: number) => {
                const x = (index / (hourlyData.length - 1)) * 100;
                const y = tempRange > 0 ? 100 - ((value - minTemp) / tempRange) * 100 : 50;
                return { x, y };
              };

              // Generate Y-axis labels
              const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
                const step = tempRange / 4;
                return Math.round(maxTemp - i * step);
              });

              return (
                <>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                    {yAxisLabels.map((label, i) => (
                      <span key={i}>{label}°</span>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="ml-8 h-full flex items-end relative pb-8">
                    <svg 
                      className="absolute inset-0 ml-8" 
                      style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 25}
                          x2="100"
                          y2={i * 25}
                          stroke="#e5e7eb"
                          strokeWidth="0.3"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}

                      {/* Temperature line (orange) */}
                      <polyline
                        points={temps.map((temp, i) => {
                          const point = getChartPoint(temp, i);
                          return `${point.x},${point.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Apparent temperature line (blue) */}
                      <polyline
                        points={apparents.map((apparent, i) => {
                          const point = getChartPoint(apparent, i);
                          return `${point.x},${point.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="2 1"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    {/* X-axis labels - show at regular intervals */}
                    <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const dataIndex = Math.floor((idx / 4) * (hourlyData.length - 1));
                        const hour = hourlyData[dataIndex];
                        return (
                          <span key={idx}>
                            {new Date(hour.time).getHours()}h
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Precipitation - Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌧️ Hourly Precipitation (mm)
          </h3>
          <div className="space-y-2 max-h-[448px] overflow-y-auto pr-2 scrollbar-thin">
            {hourlyData.map((hour, index) => {
              const precipitation = hour.raw_data.precipitation || 0;
              const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              const maxPrecip = Math.max(...hourlyData.map(h => h.raw_data.precipitation || 0), 1);
              const widthPercent = (precipitation / maxPrecip) * 100;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-700 w-12">{time}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                    <div
                      className={`h-full flex items-center justify-start px-2 transition-all rounded-full ${
                        precipitation > 5 ? 'bg-blue-600' : 
                        precipitation > 2 ? 'bg-blue-400' : 
                        precipitation > 0 ? 'bg-blue-300' : 'bg-gray-200'
                      }`}
                      style={{ width: `${Math.max(widthPercent, precipitation > 0 ? 10 : 0)}%` }}
                    >
                      {precipitation > 0.5 && (
                        <span className="text-xs font-semibold text-white whitespace-nowrap">
                          {precipitation.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 w-12 text-right font-medium">
                    {precipitation.toFixed(1)}mm
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wind Speed, Gusts & Direction Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💨 Wind Analysis (Speed, Gusts & Direction)
        </h3>
        
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 bg-cyan-400 opacity-60 rounded"></div>
            <span className="text-gray-600">Wind Gusts (km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-600">Wind Speed (km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">↑ Wind Direction</span>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="h-64 relative">
          {(() => {
            // Prepare data
            const windSpeeds = hourlyData.map(h => h.raw_data.wind_speed_10m || 0);
            const windGusts = hourlyData.map(h => h.raw_data.wind_gusts_10m || 0);
            const windDirections = hourlyData.map(h => h.raw_data.wind_direction_10m || 0);
            const maxWind = Math.max(...windGusts, 1);
            const dataPoints = hourlyData.length;

            // Generate Y-axis labels
            const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
              return Math.round(maxWind - (i * maxWind / 4));
            });

            // Convert degree to arrow rotation
            const getArrowRotation = (degree: number) => degree;

            return (
              <>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                  {yAxisLabels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full relative pb-8">
                  <svg 
                    className="absolute inset-0" 
                    style={{ width: '100%', height: 'calc(100% - 2rem)' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={`grid-${i}`}
                        x1="0"
                        y1={i * 25}
                        x2="100"
                        y2={i * 25}
                        stroke="#e5e7eb"
                        strokeWidth="0.3"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}

                    {/* Wind Gust bars */}
                    {windGusts.map((gust, i) => {
                      const x = (i / (dataPoints - 1)) * 100;
                      const height = (gust / maxWind) * 100;
                      const y = 100 - height;
                      const barWidth = 80 / dataPoints;
                      
                      return (
                        <rect
                          key={`bar-${i}`}
                          x={x - barWidth / 2}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill="#22d3ee"
                          opacity="0.4"
                        />
                      );
                    })}

                    {/* Wind Speed line */}
                    <polyline
                      points={windSpeeds.map((speed, i) => {
                        const x = (i / (dataPoints - 1)) * 100;
                        const y = 100 - (speed / maxWind) * 100;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Wind Speed dots */}
                    {windSpeeds.map((speed, i) => {
                      const x = (i / (dataPoints - 1)) * 100;
                      const y = 100 - (speed / maxWind) * 100;
                      
                      return (
                        <circle
                          key={`dot-${i}`}
                          cx={x}
                          cy={y}
                          r="0.8"
                          fill="#2563eb"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </svg>

                  {/* Wind Direction Arrows - positioned at bottom */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-between px-1">
                    {Array.from({ length: Math.min(12, dataPoints) }).map((_, idx) => {
                      const dataIndex = Math.floor((idx / Math.min(11, dataPoints - 1)) * (dataPoints - 1));
                      const direction = windDirections[dataIndex];
                      const directionLabel = getWindDirection(direction);
                      
                      return (
                        <div key={`arrow-${idx}`} className="flex flex-col items-center">
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16"
                            style={{ transform: `rotate(${getArrowRotation(direction)}deg)` }}
                            className="text-gray-600"
                          >
                            <path
                              d="M8 2 L8 14 M8 2 L5 5 M8 2 L11 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              fill="none"
                            />
                          </svg>
                          <span className="text-[9px] text-gray-500 mt-0.5">{directionLabel}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis time labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const dataIndex = Math.floor((idx / 4) * (dataPoints - 1));
                      const hour = hourlyData[dataIndex];
                      return (
                        <span key={`time-${idx}`}>
                          {new Date(hour.time).getHours()}h
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Cloud Cover & Humidity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ☁️ Cloud Cover & Humidity (%)
        </h3>
        
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 bg-gray-400 opacity-40 rounded"></div>
            <span className="text-gray-600">Cloud Cover (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Humidity (%)</span>
          </div>
        </div>

        {/* Area Chart */}
        <div className="h-64 relative">
          {(() => {
            // Prepare data
            const cloudCover = hourlyData.map(h => h.raw_data.cloud_cover || 0);
            const humidity = hourlyData.map(h => h.raw_data.relative_humidity_2m || 0);
            const dataPoints = hourlyData.length;

            // Generate Y-axis labels (0-100%)
            const yAxisLabels = [100, 75, 50, 25, 0];

            return (
              <>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                  {yAxisLabels.map((label, i) => (
                    <span key={i}>{label}%</span>
                  ))}
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full relative pb-8">
                  <svg 
                    className="absolute inset-0" 
                    style={{ width: '100%', height: 'calc(100% - 2rem)' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={`grid-${i}`}
                        x1="0"
                        y1={i * 25}
                        x2="100"
                        y2={i * 25}
                        stroke="#e5e7eb"
                        strokeWidth="0.3"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}

                    {/* Cloud Cover Area */}
                    <defs>
                      <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    
                    <path
                      d={`
                        M 0,${100 - cloudCover[0]}
                        ${cloudCover.map((cloud, i) => {
                          const x = (i / (dataPoints - 1)) * 100;
                          const y = 100 - cloud;
                          return `L ${x},${y}`;
                        }).join(' ')}
                        L 100,100
                        L 0,100
                        Z
                      `}
                      fill="url(#cloudGradient)"
                      stroke="none"
                    />

                    {/* Cloud Cover Line */}
                    <polyline
                      points={cloudCover.map((cloud, i) => {
                        const x = (i / (dataPoints - 1)) * 100;
                        const y = 100 - cloud;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Humidity Area */}
                    <defs>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    
                    <path
                      d={`
                        M 0,${100 - humidity[0]}
                        ${humidity.map((humid, i) => {
                          const x = (i / (dataPoints - 1)) * 100;
                          const y = 100 - humid;
                          return `L ${x},${y}`;
                        }).join(' ')}
                        L 100,100
                        L 0,100
                        Z
                      `}
                      fill="url(#humidityGradient)"
                      stroke="none"
                    />

                    {/* Humidity Line */}
                    <polyline
                      points={humidity.map((humid, i) => {
                        const x = (i / (dataPoints - 1)) * 100;
                        const y = 100 - humid;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Humidity dots */}
                    {humidity.map((humid, i) => {
                      const x = (i / (dataPoints - 1)) * 100;
                      const y = 100 - humid;
                      
                      return (
                        <circle
                          key={`humid-dot-${i}`}
                          cx={x}
                          cy={y}
                          r="0.6"
                          fill="#3b82f6"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </svg>

                  {/* X-axis time labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const dataIndex = Math.floor((idx / 4) * (dataPoints - 1));
                      const hour = hourlyData[dataIndex];
                      return (
                        <span key={`time-${idx}`}>
                          {new Date(hour.time).getHours()}h
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
