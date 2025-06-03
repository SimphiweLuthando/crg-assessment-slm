'use client';

import React, { useState } from 'react';
import { TimelineItem } from '@/types/timeline';

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const BASE_IMAGE_URL = 'https://arthurfrost.qflo.co.za/';
  const BASE_AUDIO_URL = 'https://arthurfrost.qflo.co.za/';

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handlePlayAudio = (item: TimelineItem) => {

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (playingId === item.Id) {
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    const audio = new Audio(`${BASE_AUDIO_URL}${item.Audio}`);
    audio.addEventListener('ended', () => {
      setPlayingId(null);
      setCurrentAudio(null);
    });

    audio.play();
    setCurrentAudio(audio);
    setPlayingId(item.Id);
  };

  const getCategoryBadgeColor = (category: string): string => {
    const colors = {
      'Daily Communion': 'bg-blue-100 text-blue-800',
      'GIBC | 2nd Cycle | Topic 101-150': 'bg-green-100 text-green-800',
      'GIBC | 1st Cycle | Topic 1-50': 'bg-purple-100 text-purple-800',
      'GIBC | 1st Cycle | Topic 51-100': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.Id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            
            <div className="relative h-48 overflow-hidden">
              <img
                src={`${BASE_IMAGE_URL}${item.Image}`}
                alt={item.Title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(item.Category)}`}>
                  {item.Category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Episode {item.Episode}
                </span>
                <span className="text-sm text-gray-400">
                  {item.CreateDate}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {item.Title}
              </h3>

              {item.Description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.Description}
                </p>
              )}


              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {item.MediaName}
                </span>
                <span className="text-sm text-gray-400">
                  {formatFileSize(item.AudioSize)}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePlayAudio(item)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    playingId === item.Id
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {playingId === item.Id ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Play</span>
                    </>
                  )}
                </button>

                <img
                  src={`${BASE_IMAGE_URL}${item.Icon}`}
                  alt={`${item.Title} icon`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 