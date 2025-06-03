'use client';

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Dr. Arthur Frost Timeline
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            Teachings, Sermons & Spiritual Content
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-medium">Daily Communion</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-medium">GIBC Topics</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-medium">Audio Teachings</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 