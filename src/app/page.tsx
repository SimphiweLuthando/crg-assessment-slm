'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TimelineData } from '@/types/timeline';
import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import Timeline from '@/components/Timeline';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

const getTimelineData = async (): Promise<TimelineData | null> => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://arthurfrost.qflo.co.za/php/getTimeline.php',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return null;
  }
};

export default function Home() {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTimelineData();
        if (data) {
          setTimelineData(data);
        } else {
          setError('Failed to load timeline data');
        }
      } catch {
        setError('An error occurred while loading the timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !timelineData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Error Loading Timeline</h2>
              <p>{error || 'Failed to load timeline data'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>

        {timelineData.Body && timelineData.Body.length > 0 && (
          <AboutSection content={timelineData.Body[0]} />
        )}
        

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Content & Teachings
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore Dr. Arthur Frost&apos;s latest sermons, teachings, and spiritual content. 
                Click play to listen to any audio content directly.
              </p>
            </div>
          </div>
          
          {timelineData.Timeline && timelineData.Timeline.length > 0 ? (
            <Timeline items={timelineData.Timeline} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No timeline content available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}