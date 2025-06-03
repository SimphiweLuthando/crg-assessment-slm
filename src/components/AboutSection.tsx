'use client';

import React from 'react';
import parse from 'html-react-parser';
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
        <div className="bg-white md:bg-white/95 md:backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
          <div 
            className="prose prose-lg max-w-none 
                     prose-headings:text-gray-900 prose-headings:font-bold
                     prose-p:text-gray-800 prose-p:leading-relaxed
                     prose-li:text-gray-800 
                     prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
                     prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:font-medium
                     prose-ul:text-gray-800 prose-ol:text-gray-800
                     [&>h1]:text-2xl [&>h1]:md:text-3xl [&>h1]:mb-6
                     [&>p]:text-base [&>p]:md:text-lg [&>p]:mb-4
                     [&>ul]:mb-6 [&>li]:mb-2"
          >
            {parse(content.About)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 