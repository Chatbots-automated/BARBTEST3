import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="https://i.imgur.com/1IbdOtP.png" 
            alt="Girios Horizontas" 
            className="h-12"
          />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('lt')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'lt'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            LT
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'en'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}