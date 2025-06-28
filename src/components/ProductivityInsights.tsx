import React from 'react';
import { TrendingUp, Calendar, Clock, Target, Award, BarChart3 } from 'lucide-react';

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

interface ProductivityInsightsProps {
  events: Event[];
  moods: MoodEntry[];
  habits: HabitEntry[];
}

const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({ events, moods, habits }) => {
  const getProductivityScore = () => {
    const today = new Date().toISOString().split('T')[0];
    const recentDays = 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - recentDays);
    
    // Events completed
    const recentEvents = events.filter(e => new Date(e.date) >= cutoffDate);
    const eventScore = Math.min(recentEvents.length * 10, 40);
    
    // Mood average
    const recentMoods = moods.filter(m => new Date(m.date) >= cutoffDate);
    const moodValues = { terrible: 1, bad: 2, neutral: 3, good: 4, excellent: 5 };
    const avgMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / recentMoods.length 
      : 3;
    const moodScore = (avgMood / 5) * 30;
    
    // Habit consistency
    const habitScore = habits.reduce((total, habit) => {
      const recentCompletions = habit.completedDates.filter(date => new Date(date) >= cutoffDate).length;
      return total + (recentCompletions / recentDays) * 30;
    }, 0) / Math.max(habits.length, 1);
    
    return Math.round(eventScore + moodScore + habitScore);
  };

  const getCategoryBreakdown = () => {
    const categories = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / events.length) * 100)
    }));
  };

  const getStreakInfo = () => {
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.streak > 0).length;
    
    return { longestStreak, totalHabits, activeHabits };
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return events
      .filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate <= nextWeek && e.priority === 'high';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const productivityScore = getProductivityScore();
  const categoryBreakdown = getCategoryBreakdown();
  const streakInfo = getStreakInfo();
  const upcomingDeadlines = getUpcomingDeadlines();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      health: 'bg-red-500',
      social: 'bg-purple-500',
      learning: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Productivity Insights</h3>
      </div>

      {/* Productivity Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Weekly Score</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(productivityScore)}`}>
            {productivityScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${productivityScore}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Event Categories
        </h4>
        <div className="space-y-2">
          {categoryBreakdown.map(({ category, count, percentage }) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                <span className="text-sm capitalize">{category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{count}</span>
                <span className="text-xs text-gray-400">({percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Habit Performance
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{streakInfo.longestStreak}</div>
            <div className="text-xs text-gray-600">Longest Streak</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{streakInfo.activeHabits}</div>
            <div className="text-xs text-gray-600">Active Habits</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {streakInfo.totalHabits > 0 ? Math.round((streakInfo.activeHabits / streakInfo.totalHabits) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Upcoming Deadlines
          </h4>
          <div className="space-y-2">
            {upcomingDeadlines.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{event.title}</span>
                </div>
                <span className="text-xs text-red-600">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badge */}
      {productivityScore >= 80 && (
        <div className="mt-6 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-center">
          <Award className="h-6 w-6 text-white mx-auto mb-1" />
          <p className="text-sm font-bold text-white">Productivity Champion!</p>
          <p className="text-xs text-yellow-100">You're crushing your goals this week!</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityInsights;