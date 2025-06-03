'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Timeline</h3>
        <p className="text-gray-600">Fetching the latest content...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 