'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TimelineItem } from '@/types/timeline';

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  const animationRef = useRef<number | undefined>(undefined);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const BASE_IMAGE_URL = 'https://arthurfrost.qflo.co.za/';
  const BASE_AUDIO_URL = 'https://arthurfrost.qflo.co.za/';


  const updateProgress = () => {
    if (currentAudioRef.current && !currentAudioRef.current.paused && playingId) {
      setCurrentTime(currentAudioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    };
    
    setIsMobile(checkMobile());
  }, []);


  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const unlockAudioContext = () => {
    if (isMobile && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (error) {
        console.warn('AudioContext unlock failed:', error);
      }
    }
  };

  useEffect(() => {
    if (isMobile) {

      const handleUserInteraction = () => {
        unlockAudioContext();
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      };

      document.addEventListener('touchstart', handleUserInteraction);
      document.addEventListener('click', handleUserInteraction);

      return () => {
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      };
    }
  }, [isMobile]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const createAudio = (item: TimelineItem): HTMLAudioElement => {
    const audio = new Audio();
    
    if (isMobile) {
      audio.preload = 'none'; 
      audio.crossOrigin = 'anonymous';
    } else {
      audio.preload = 'metadata'; 
    }
    
    audio.src = `${BASE_AUDIO_URL}${item.Audio}`;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      if (playingId === item.Id) {
        setIsLoading(false);
        setAudioError(null);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (currentAudioRef.current === audio) {
        setCurrentTime(audio.currentTime);
      }
    });

    audio.addEventListener('ended', () => {
      if (currentAudioRef.current === audio) {
        setPlayingId(null);
        setCurrentAudio(null);
        currentAudioRef.current = null;
        setCurrentTime(0);
        setDuration(0);

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      }
    });

    audio.addEventListener('canplay', () => {
      if (playingId === item.Id) {
        setIsLoading(false);
        setAudioError(null);
      }
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio error for:', item.Title, e);
      setIsLoading(false);
      setAudioError('Failed to load audio');
    });

    if (isMobile) {
      audio.addEventListener('stalled', () => {
        console.warn('Audio stalled for:', item.Title);
      });

      audio.addEventListener('suspend', () => {
        console.warn('Audio suspended for:', item.Title);
      });
    }

    return audio;
  };

  const handlePlayPause = async (item: TimelineItem) => {
    setAudioError(null);
    
    if (isMobile) {
      unlockAudioContext();
    }

    if (playingId === item.Id && currentAudio) {
      try {
        if (currentAudio.paused) {
          setIsLoading(true);
          await currentAudio.play();
          setIsLoading(false);
          
          updateProgress();
        } else {
          currentAudio.pause();
         
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = undefined;
          }

          setCurrentTime(currentAudio.currentTime);
        }
      } catch (error) {
        console.error('Play/pause error:', error);
        setIsLoading(false);
        setAudioError('Playback failed. Please try again.');
      }
      return;
    }

    
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
   
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }

    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    
    let audio = audioRefs.current[item.Id];
    if (!audio) {
      audio = createAudio(item);
      audioRefs.current[item.Id] = audio;
    }

    try {
     
      setCurrentAudio(audio);
      currentAudioRef.current = audio;
      setPlayingId(item.Id);
      
      if (audio.duration) {
        setDuration(audio.duration);
      }
      
      setCurrentTime(audio.currentTime);
      

      if (isMobile && audio.readyState < 2) {
        audio.load();
      }
      
      await audio.play();
      setIsLoading(false);
      updateProgress();
    } catch (error: unknown) {
      console.error('Play error:', error);
      setIsLoading(false);
      

      const errorMessage = error instanceof Error ? error.name : 'UnknownError';
      if (errorMessage === 'NotAllowedError') {
        setAudioError(isMobile ? 
          'Audio playback blocked. Please enable audio in your browser.' :
          'Audio playback blocked. Click to enable audio.'
        );
      } else if (errorMessage === 'NotSupportedError') {
        setAudioError('Audio format not supported on this device.');
      } else {
        setAudioError('Failed to play audio. Please check your connection.');
      }
    }
  };

  const handleSeek = (item: TimelineItem, event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (playingId !== item.Id || !currentAudio) return;

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clientX = 'touches' in event ? 
      event.touches[0]?.clientX || event.changedTouches[0]?.clientX : 
      event.clientX;
    const clickX = clientX - rect.left;
    const progressBarWidth = rect.width;
    const newTime = (clickX / progressBarWidth) * duration;

    if (newTime >= 0 && newTime <= duration) {
      currentAudio.currentTime = newTime;
    
      setCurrentTime(newTime);
    }
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
        {items.map((item) => {
          const isCurrentlyPlaying = playingId === item.Id;
          const isPlaying = isCurrentlyPlaying && currentAudio && !currentAudio.paused;
          const currentDuration = isCurrentlyPlaying ? duration : 0;
          const currentCurrentTime = isCurrentlyPlaying ? currentTime : 0;
          
          return (
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

                {/* Error Display */}
                {audioError && playingId === item.Id && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
                    {audioError}
                  </div>
                )}

                <div className="space-y-3">
                  {isCurrentlyPlaying && (
                    <div className="space-y-2">
                      <div
                        className={`w-full h-2 bg-gray-200 rounded-full cursor-pointer ${isMobile ? 'touch-manipulation select-none' : ''}`}
                        onClick={(e) => handleSeek(item, e)}
                        {...(isMobile ? { onTouchStart: (e) => handleSeek(item, e) } : {})}
                      >
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-150"
                          style={{
                            width: currentDuration > 0 ? `${(currentCurrentTime / currentDuration) * 100}%` : '0%'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatTime(currentCurrentTime)}</span>
                        <span>{formatTime(currentDuration)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePlayPause(item)}
                      disabled={isLoading && playingId === item.Id}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isMobile ? 'touch-manipulation' : ''} ${
                        isPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading && playingId === item.Id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : isPlaying ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Pause</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline; 