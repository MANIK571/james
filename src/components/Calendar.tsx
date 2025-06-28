import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Heart, Target } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'social' | 'learning';
}

interface MoodEntry {
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy: number;
  notes: string;
}

interface HabitEntry {
  id: string;
  name: string;
  color: string;
  streak: number;
  completedDates: string[];
}

interface CalendarProps {
  events: Event[];
  onDateClick: (date: string) => void;
  onDateHover: (date: string | null) => void;
  hoveredDate: string | null;
  selectedDate: string | null;
  getEventsForDate: (date: string) => Event[];
  moods: MoodEntry[];
  habits: HabitEntry[];
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateClick,
  onDateHover,
  hoveredDate,
  selectedDate,
  getEventsForDate,
  moods,
  habits
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getMoodForDate = (date: string) => {
    return moods.find(mood => mood.date === date);
  };

  const getHabitsForDate = (date: string) => {
    return habits.filter(habit => habit.completedDates.includes(date));
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'neutral': return 'bg-yellow-500';
      case 'bad': return 'bg-orange-500';
      case 'terrible': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const days = getDaysInMonth(currentDate);

  const getAdjacentDates = (date: string) => {
    const currentDateObj = new Date(date);
    const prevDay = new Date(currentDateObj);
    prevDay.setDate(currentDateObj.getDate() - 1);
    const nextDay = new Date(currentDateObj);
    nextDay.setDate(currentDateObj.getDate() + 1);
    
    return [
      formatDate(prevDay),
      formatDate(nextDay)
    ];
  };

  const isAdjacentToHovered = (date: string) => {
    if (!hoveredDate) return false;
    const adjacentDates = getAdjacentDates(hoveredDate);
    return adjacentDates.includes(date);
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up calendar-glow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-100/50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dateStr = formatDate(day);
          const dayEvents = getEventsForDate(dateStr);
          const dayMood = getMoodForDate(dateStr);
          const dayHabits = getHabitsForDate(dateStr);
          const isHovered = hoveredDate === dateStr;
          const isSelected = selectedDate === dateStr;
          const isAdjacent = isAdjacentToHovered(dateStr);

          return (
            <div
              key={index}
              className={`
                relative p-3 min-h-[100px] rounded-xl cursor-pointer transition-all duration-300 transform
                ${isCurrentMonth(day) 
                  ? 'bg-white hover:bg-blue-50' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }
                ${isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isHovered ? 'scale-110 z-10 shadow-2xl bg-blue-100 hover-glow' : ''}
                ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''}
                ${isAdjacent ? 'bg-blue-25 border-blue-200 adjacent-glow' : ''}
                hover:scale-105 hover:shadow-lg
                border border-gray-200/50
              `}
              onClick={() => onDateClick(dateStr)}
              onMouseEnter={() => onDateHover(dateStr)}
              onMouseLeave={() => onDateHover(null)}
            >
              {/* Date Number */}
              <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-blue-700' : ''}`}>
                {day.getDate()}
              </div>

              {/* Mood Indicator */}
              {dayMood && (
                <div className="flex items-center mb-1">
                  <Heart className="h-3 w-3 mr-1 text-pink-500" />
                  <div className={`w-2 h-2 rounded-full ${getMoodColor(dayMood.mood)}`}></div>
                </div>
              )}

              {/* Habit Indicators */}
              {dayHabits.length > 0 && (
                <div className="flex items-center mb-1">
                  <Target className="h-3 w-3 mr-1 text-green-500" />
                  <div className="flex space-x-1">
                    {dayHabits.slice(0, 3).map(habit => (
                      <div
                        key={habit.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      ></div>
                    ))}
                    {dayHabits.length > 3 && (
                      <span className="text-xs text-gray-500">+{dayHabits.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Event Indicators */}
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className="text-xs px-2 py-1 rounded-md truncate transition-all duration-200"
                      style={{ 
                        backgroundColor: event.color + '20',
                        borderLeft: `3px solid ${event.color}`,
                        fontSize: isHovered ? '0.75rem' : '0.6rem'
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium px-2">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}

              {/* Hover Event Preview */}
              {isHovered && (dayEvents.length > 0 || dayMood || dayHabits.length > 0) && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-20 animate-zoom-in">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {new Date(dateStr).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  {/* Events */}
                  {dayEvents.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Events</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {dayEvents.map(event => (
                          <div key={event.id} className="flex items-start space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: event.color }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                              <p className="text-xs text-gray-500">{event.time}</p>
                              {event.description && (
                                <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mood */}
                  {dayMood && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Mood</h5>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${getMoodColor(dayMood.mood)}`}></div>
                        <span className="text-sm capitalize">{dayMood.mood}</span>
                        <span className="text-xs text-gray-500">Energy: {dayMood.energy}/10</span>
                      </div>
                    </div>
                  )}

                  {/* Habits */}
                  {dayHabits.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Completed Habits</h5>
                      <div className="flex flex-wrap gap-1">
                        {dayHabits.map(habit => (
                          <span
                            key={habit.id}
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: habit.color }}
                          >
                            {habit.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Priority Badge */}
              {dayEvents.some(e => e.priority === 'high') && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;