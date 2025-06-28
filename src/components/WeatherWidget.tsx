import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, SunSnow as Snow, Wind, Thermometer, Droplets, Eye } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    location: 'Your City'
  });

  const [forecast, setForecast] = useState([
    { day: 'Today', temp: 22, condition: 'sunny' },
    { day: 'Tomorrow', temp: 19, condition: 'cloudy' },
    { day: 'Wed', temp: 16, condition: 'rainy' },
    { day: 'Thu', temp: 18, condition: 'cloudy' },
    { day: 'Fri', temp: 24, condition: 'sunny' }
  ]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snowy': return <Snow className="h-6 w-6 text-blue-300" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getWeatherGradient = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'from-yellow-400 to-orange-500';
      case 'cloudy': return 'from-gray-400 to-gray-600';
      case 'rainy': return 'from-blue-400 to-blue-600';
      case 'snowy': return 'from-blue-200 to-blue-400';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
        {getWeatherIcon(weather.condition)}
      </div>

      {/* Current Weather */}
      <div className={`bg-gradient-to-r ${getWeatherGradient(weather.condition)} rounded-xl p-4 text-white mb-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{weather.location}</p>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm opacity-90 capitalize">{weather.condition}</p>
          </div>
          <div className="text-right">
            {getWeatherIcon(weather.condition)}
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <p className="text-lg font-semibold">{weather.humidity}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Wind</span>
          </div>
          <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">5-Day Forecast</h4>
        <div className="space-y-2">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{day.day}</span>
              <div className="flex items-center space-x-2">
                {getWeatherIcon(day.condition)}
                <span className="text-sm font-semibold">{day.temp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;