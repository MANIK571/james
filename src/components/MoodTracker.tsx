import React, { useState } from 'react';
import { Heart, Smile, Meh, Frown, Zap, Save } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy: number;
  notes: string;
}

interface MoodTrackerProps {
  moods: MoodEntry[];
  setMoods: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  selectedDate: string | null;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, setMoods, selectedDate }) => {
  const [currentMood, setCurrentMood] = useState<'excellent' | 'good' | 'neutral' | 'bad' | 'terrible'>('good');
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', icon: '😄', color: 'bg-green-500' },
    { value: 'good', label: 'Good', icon: '😊', color: 'bg-blue-500' },
    { value: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-yellow-500' },
    { value: 'bad', label: 'Bad', icon: '😔', color: 'bg-orange-500' },
    { value: 'terrible', label: 'Terrible', icon: '😢', color: 'bg-red-500' }
  ];

  const handleSaveMood = () => {
    const date = selectedDate || new Date().toISOString().split('T')[0];
    const newMood: MoodEntry = {
      date,
      mood: currentMood,
      energy,
      notes
    };

    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== date);
      return [...filtered, newMood];
    });

    setNotes('');
  };

  const getTodayMood = () => {
    const today = selectedDate || new Date().toISOString().split('T')[0];
    return moods.find(m => m.date === today);
  };

  const getWeeklyAverage = () => {
    const lastWeek = moods.slice(-7);
    if (lastWeek.length === 0) return 0;
    
    const moodValues = { terrible: 1, bad: 2, neutral: 3, good: 4, excellent: 5 };
    const average = lastWeek.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / lastWeek.length;
    return Math.round(average * 10) / 10;
  };

  const todayMood = getTodayMood();

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Mood Tracker</h3>
      </div>

      {/* Today's Mood Display */}
      {todayMood && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Mood</h4>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{moodOptions.find(m => m.value === todayMood.mood)?.icon}</span>
            <div>
              <p className="font-semibold capitalize">{todayMood.mood}</p>
              <p className="text-sm text-gray-600">Energy: {todayMood.energy}/10</p>
            </div>
          </div>
          {todayMood.notes && (
            <p className="text-sm text-gray-600 mt-2 italic">"{todayMood.notes}"</p>
          )}
        </div>
      )}

      {/* Mood Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling?</label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setCurrentMood(option.value as any)}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                currentMood === option.value
                  ? `${option.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Energy Level: {energy}/10
        </label>
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium w-8">{energy}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveMood}
        className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-colors"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Mood
      </button>

      {/* Weekly Stats */}
      {moods.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Average</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(getWeeklyAverage() / 5) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{getWeeklyAverage()}/5</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;