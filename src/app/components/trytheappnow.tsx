"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TryTheAppNow = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left side - App information */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800">
              Try the E-Stammering App Today
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              The E-Stammering Therapy App is a specialized tool designed for people who stammer, 
              providing effective techniques and exercises to improve speech fluency and build confidence.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <p className="text-gray-700">
                This app has been developed in collaboration with certified stammering therapists 
                and Audiology and Speech Disorders Specialists, incorporating evidence-based 
                approaches to help you overcome stammering challenges.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Personalized speech exercises tailored to your specific needs</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Real-time feedback and progress tracking</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Access to a supportive community of users and specialists</p>
              </div>
            </div>
            
            <div 
              className="inline-block"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link 
                href="/signin" 
                className={`inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ${
                  isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow'
                }`}
              >
                Try the App Now
                <svg 
                  className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Right side - App illustration */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/Stammering-Therapy-logo.png"
              alt="E-Stammering App Demo"
              fill
              className="object-cover rounded-xl"
            />
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryTheAppNow;