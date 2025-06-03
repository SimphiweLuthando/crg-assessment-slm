'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Dr. Arthur Frost</h3>
            <p className="text-gray-300 leading-relaxed">
              Equipping the body of Christ through teachings, sermons, and spiritual guidance. 
              Join us on the journey to become fully mature and functional Christians.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Content Categories</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Daily Communion</li>
              <li>GIBC Topics</li>
              <li>Audio Teachings</li>
              <li>Spiritual Guidance</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <p className="text-gray-300 mb-4">
              All teachings and sermons are shared free of charge. 
              Please use this platform and share it with others.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">YT</span>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">FH</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Dr. Arthur Frost Timeline. Built with ❤️ for the CRG Assessment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 