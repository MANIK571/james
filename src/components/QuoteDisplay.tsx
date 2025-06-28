import React, { useState, useEffect } from 'react';
import { RefreshCw, Quote, User, Lightbulb, Heart, Star } from 'lucide-react';

interface QuoteDisplayProps {
  selectedDate: string;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ selectedDate }) => {
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author: string; category: string }>({ text: '', author: '', category: '' });
  const [isLoading, setIsLoading] = useState(false);

  const philosopherQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
    { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus", category: "resilience" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "authenticity" },
    { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "wisdom" },
    { text: "The unexamined life is not worth living.", author: "Socrates", category: "philosophy" },
    { text: "I think, therefore I am.", author: "René Descartes", category: "philosophy" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "happiness" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "action" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "innovation" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", category: "mindset" },
    { text: "The mind is everything. What you think you become.", author: "Buddha", category: "mindfulness" },
    { text: "Yesterday is history, tomorrow is a mystery, today is a gift.", author: "Eleanor Roosevelt", category: "present" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "hope" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "self-determination" },
    { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau", category: "dreams" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "perseverance" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "resilience" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "inner-strength" },
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", category: "change" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", category: "life" },
    { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain", category: "honesty" },
    { text: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard", category: "friendship" },
    { text: "To live is the rarest thing in the world. Most people just exist.", author: "Oscar Wilde", category: "living" },
    { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", category: "strength" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "learning" },
    { text: "Darkness cannot drive out darkness: only light can do that.", author: "Martin Luther King Jr.", category: "love" },
    { text: "We accept the love we think we deserve.", author: "Stephen Chbosky", category: "self-worth" }
  ];

  const getRandomQuote = () => {
    const dateHash = selectedDate.split('-').reduce((acc, part) => acc + parseInt(part), 0);
    const randomFactor = Math.floor(Math.random() * 1000);
    const index = (dateHash + randomFactor) % philosopherQuotes.length;
    return philosopherQuotes[index];
  };

  const refreshQuote = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const dateHash = selectedDate.split('-').reduce((acc, part) => acc + parseInt(part), 0);
    const index = dateHash % philosopherQuotes.length;
    setCurrentQuote(philosopherQuotes[index]);
  }, [selectedDate]);

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'motivation': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'wisdom': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'love': case 'friendship': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <Quote className="h-4 w-4 text-purple-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motivation': return 'bg-yellow-100 text-yellow-800';
      case 'wisdom': return 'bg-blue-100 text-blue-800';
      case 'love': case 'friendship': return 'bg-red-100 text-red-800';
      case 'happiness': return 'bg-green-100 text-green-800';
      case 'philosophy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Quote className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Daily Wisdom</h3>
        </div>
        <button
          onClick={refreshQuote}
          disabled={isLoading}
          className={`p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200 ${
            isLoading ? 'animate-spin' : 'hover:scale-110'
          }`}
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Quote Content */}
      <div className="space-y-4">
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-purple-300 opacity-50" />
          <blockquote className="text-lg font-medium text-gray-800 italic leading-relaxed pl-6">
            "{currentQuote.text}"
          </blockquote>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-purple-200">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-purple-600" />
            <cite className="text-sm font-semibold text-purple-700">
              — {currentQuote.author}
            </cite>
          </div>
          
          {currentQuote.category && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentQuote.category)}`}>
              {getCategoryIcon(currentQuote.category)}
              <span className="capitalize">{currentQuote.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* Date Info */}
      <div className="mt-4 text-xs text-gray-500 bg-white/50 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <span>
            Quote for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <span className="text-purple-600 font-medium">
            #{Math.abs(selectedDate.split('-').reduce((acc, part) => acc + parseInt(part), 0)) % philosopherQuotes.length + 1}
          </span>
        </div>
      </div>

      {/* Reflection Prompt */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          <strong>💭 Reflection:</strong> How can you apply this wisdom to your day today?
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;