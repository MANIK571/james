import React, { useState } from 'react';
import { Target, Plus, Check, X, Flame, Calendar, Save } from 'lucide-react';

interface HabitEntry {
  id: string;
  name: string;
  color: string;
  streak: number;
  completedDates: string[];
}

interface HabitTrackerProps {
  habits: HabitEntry[];
  setHabits: React.Dispatch<React.SetStateAction<HabitEntry[]>>;
  selectedDate: string | null;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits, selectedDate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitColor, setNewHabitColor] = useState('#3B82F6');

  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'
  ];

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit: HabitEntry = {
      id: Date.now().toString(),
      name: newHabitName,
      color: newHabitColor,
      streak: 0,
      completedDates: []
    };
    
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setShowAddForm(false);
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(date);
      let newCompletedDates;
      let newStreak = habit.streak;
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== date);
        // Recalculate streak
        newStreak = calculateStreak(newCompletedDates);
      } else {
        newCompletedDates = [...habit.completedDates, date].sort();
        newStreak = calculateStreak(newCompletedDates);
      }
      
      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak
      };
    }));
  };

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffTime = currentDate.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      week.push(date.toISOString().split('T')[0]);
    }
    
    return week;
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const weekDates = getWeekDates();
  const currentDate = selectedDate || new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Habit Tracker</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="space-y-3">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Habit name (e.g., Drink water, Exercise)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Color:</span>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewHabitColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newHabitColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddHabit}
                className="flex items-center px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Add Habit
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No habits yet. Add one to get started!</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  ></div>
                  <h4 className="font-medium text-gray-900">{habit.name}</h4>
                  {habit.streak > 0 && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-bold">{habit.streak}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Week View */}
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map(date => {
                  const isCompleted = habit.completedDates.includes(date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <button
                      key={date}
                      onClick={() => toggleHabit(habit.id, date)}
                      className={`
                        aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                        ${isCompleted 
                          ? 'border-emerald-500 bg-emerald-500 text-white' 
                          : 'border-gray-300 hover:border-emerald-300'
                        }
                        ${isToday ? 'ring-2 ring-blue-300' : ''}
                      `}
                    >
                      {isCompleted && <Check className="h-3 w-3" />}
                      <span className="sr-only">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  {weekDates[0] && new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span>This Week</span>
                <span>
                  {weekDates[6] && new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Today's Progress */}
      {habits.length > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Today's Progress
          </h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${habits.length > 0 ? (habits.filter(h => h.completedDates.includes(currentDate)).length / habits.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {habits.filter(h => h.completedDates.includes(currentDate)).length}/{habits.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;