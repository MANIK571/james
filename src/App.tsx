import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventManager from './components/EventManager';
import QuoteDisplay from './components/QuoteDisplay';
import WeatherWidget from './components/WeatherWidget';
import MoodTracker from './components/MoodTracker';
import ProductivityInsights from './components/ProductivityInsights';
import TimeZoneWidget from './components/TimeZoneWidget';
import HabitTracker from './components/HabitTracker';
import { CalendarIcon, Sparkles, Brain, Plus, Cloud, Heart, TrendingUp, Clock, Target } from 'lucide-react';
import './styles/animations.css';

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

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [showEventManager, setShowEventManager] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [habits, setHabits] = useState<HabitEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    const savedMoods = localStorage.getItem('calendar-moods');
    const savedHabits = localStorage.getItem('calendar-habits');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Sample events
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Team Meeting',
          description: 'Weekly team sync',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          color: '#3B82F6',
          priority: 'high',
          category: 'work'
        },
        {
          id: '2',
          title: 'Gym Session',
          description: 'Cardio and strength training',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time: '18:00',
          color: '#10B981',
          priority: 'medium',
          category: 'health'
        }
      ];
      setEvents(sampleEvents);
    }

    if (savedMoods) {
      setMoods(JSON.parse(savedMoods));
    }

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Sample habits
      const sampleHabits: HabitEntry[] = [
        { id: '1', name: 'Drink Water', color: '#3B82F6', streak: 5, completedDates: [] },
        { id: '2', name: 'Exercise', color: '#10B981', streak: 3, completedDates: [] },
        { id: '3', name: 'Read', color: '#8B5CF6', streak: 7, completedDates: [] }
      ];
      setHabits(sampleHabits);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calendar-moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('calendar-habits', JSON.stringify(habits));
  }, [habits]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowQuote(true);
  };

  const handleDateHover = (date: string | null) => {
    setHoveredDate(date);
  };

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEditEvent = (eventId: string, updatedEvent: Omit<Event, 'id'>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...updatedEvent, id: eventId } : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const handleQuickAdd = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setShowEventManager(true);
  };

  const toggleWidget = (widget: string) => {
    setActiveWidget(activeWidget === widget ? null : widget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl shadow-lg animate-glow">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  LifeSync Calendar
                </h1>
                <p className="text-sm text-gray-600 mt-1">Your intelligent life companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleQuickAdd}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </button>
              
              <button
                onClick={() => setShowEventManager(!showEventManager)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Events
              </button>

              <button
                onClick={() => toggleWidget('weather')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeWidget === 'weather' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Cloud className="h-4 w-4 mr-2" />
                Weather
              </button>

              <button
                onClick={() => toggleWidget('mood')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeWidget === 'mood' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Mood
              </button>

              <button
                onClick={() => toggleWidget('insights')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeWidget === 'insights' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights
              </button>

              <button
                onClick={() => toggleWidget('timezone')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeWidget === 'timezone' 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Time
              </button>

              <button
                onClick={() => toggleWidget('habits')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeWidget === 'habits' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Target className="h-4 w-4 mr-2" />
                Habits
              </button>
              
              {showQuote && (
                <button
                  onClick={() => setShowQuote(!showQuote)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Philosophy
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              events={events}
              onDateClick={handleDateClick}
              onDateHover={handleDateHover}
              hoveredDate={hoveredDate}
              selectedDate={selectedDate}
              getEventsForDate={getEventsForDate}
              moods={moods}
              habits={habits}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Widget */}
            {activeWidget === 'weather' && <WeatherWidget />}
            {activeWidget === 'mood' && (
              <MoodTracker 
                moods={moods} 
                setMoods={setMoods} 
                selectedDate={selectedDate} 
              />
            )}
            {activeWidget === 'insights' && (
              <ProductivityInsights 
                events={events} 
                moods={moods} 
                habits={habits} 
              />
            )}
            {activeWidget === 'timezone' && <TimeZoneWidget />}
            {activeWidget === 'habits' && (
              <HabitTracker 
                habits={habits} 
                setHabits={setHabits} 
                selectedDate={selectedDate} 
              />
            )}

            {/* Quote Display */}
            {showQuote && selectedDate && (
              <QuoteDisplay selectedDate={selectedDate} />
            )}

            {/* Event Manager */}
            {showEventManager && (
              <EventManager
                selectedDate={selectedDate}
                events={events}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onClose={() => setShowEventManager(false)}
              />
            )}

            {/* Enhanced Stats Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-bold text-blue-600">{events.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-green-600">
                    {events.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Priority</span>
                  <span className="font-bold text-red-600">
                    {events.filter(e => e.priority === 'high').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Habits</span>
                  <span className="font-bold text-purple-600">{habits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mood Entries</span>
                  <span className="font-bold text-pink-600">{moods.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}

export default App;