'use client';

import React from 'react';
import { BodyContent } from '@/types/timeline';

interface AboutSectionProps {
  content: BodyContent;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const BASE_IMAGE_URL = 'https://arthurfrost.qflo.co.za/';

  const backgroundStyle = {
    backgroundImage: `url(${BASE_IMAGE_URL}${content.Background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${content.BackgroundOpacity / 100})`,
  };

  return (
    <section className="relative py-16 px-6" style={backgroundStyle}>

      <div className="absolute inset-0" style={overlayStyle}></div>

      <div className="relative max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-lg prose-a:text-blue-600 hover:prose-a:text-blue-800"
            dangerouslySetInnerHTML={{ __html: content.About }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 