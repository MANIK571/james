import React, { useState, useEffect } from 'react';
import { Clock, Globe, MapPin } from 'lucide-react';

interface TimeZone {
  city: string;
  timezone: string;
  time: string;
  offset: string;
}

const TimeZoneWidget: React.FC = () => {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const worldCities = [
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' }
  ];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const updatedTimeZones = worldCities.map(city => {
        const time = new Date().toLocaleTimeString('en-US', {
          timeZone: city.timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const offset = new Date().toLocaleTimeString('en-US', {
          timeZone: city.timezone,
          timeZoneName: 'short'
        }).split(' ')[2];
        
        return {
          ...city,
          time,
          offset: offset || ''
        };
      });
      
      setTimeZones(updatedTimeZones);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return { period: 'Morning', color: 'bg-yellow-100 text-yellow-800' };
    if (hour >= 12 && hour < 18) return { period: 'Afternoon', color: 'bg-orange-100 text-orange-800' };
    if (hour >= 18 && hour < 22) return { period: 'Evening', color: 'bg-purple-100 text-purple-800' };
    return { period: 'Night', color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">World Clock</h3>
      </div>

      {/* Local Time */}
      <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-medium text-gray-700">Local Time</span>
        </div>
        <div className="text-2xl font-bold text-violet-600">
          {currentTime.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div className="text-sm text-gray-600">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* World Times */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          World Times
        </h4>
        
        {timeZones.map((tz, index) => {
          const timeOfDay = getTimeOfDay(tz.time);
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{tz.city}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${timeOfDay.color}`}>
                    {timeOfDay.period}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{tz.time}</p>
                <p className="text-xs text-gray-500">{tz.offset}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meeting Planner Tip */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Best time for global meetings is usually 9-11 AM EST (2-4 PM GMT)
        </p>
      </div>
    </div>
  );
};

export default TimeZoneWidget;