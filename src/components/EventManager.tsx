import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Clock, Flag, Save, Calendar } from 'lucide-react';

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

interface EventManagerProps {
  selectedDate: string | null;
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onEditEvent: (eventId: string, event: Omit<Event, 'id'>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

const EventManager: React.FC<EventManagerProps> = ({
  selectedDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onClose
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate || '',
    time: '',
    color: '#3B82F6',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'personal' as 'work' | 'personal' | 'health' | 'social' | 'learning'
  });

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' }
  ];

  const categories = [
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'personal', label: 'Personal', icon: '🏠' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'learning', label: 'Learning', icon: '📚' }
  ];

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingEvent) {
      onEditEvent(editingEvent.id, formData);
    } else {
      onAddEvent(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: selectedDate || '',
      time: '',
      color: '#3B82F6',
      priority: 'medium',
      category: 'personal'
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      color: event.color,
      priority: event.priority,
      category: event.category
    });
    setShowForm(true);
  };

  const relevantEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate)
    : events.slice(0, 10);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '📅';
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Event Manager'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Event Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50/50 rounded-xl p-4 mb-6 space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value as any })}
                  className={`p-2 rounded-lg text-center transition-all ${
                    formData.category === category.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg">{category.icon}</div>
                  <div className="text-xs">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingEvent ? 'Update' : 'Create'} Event
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">
          {selectedDate ? 'Events Today' : 'Recent Events'} 
          <span className="text-sm font-normal text-gray-500 ml-2">({relevantEvents.length})</span>
        </h4>
        
        {relevantEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No events found</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {relevantEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex flex-col items-center space-y-1">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      ></div>
                      <span className="text-lg">{getCategoryIcon(event.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 truncate">{event.title}</h5>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {event.time && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {event.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-3">
                    <button
                      onClick={() => startEdit(event)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManager;