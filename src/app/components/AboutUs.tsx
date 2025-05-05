"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs = () => {
  
  
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO-optimized heading area */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Who We Are</h2>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">About Us</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A collaborative team of specialists dedicated to helping people overcome stammering challenges through technology and personalized therapy.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Image and stats */}
          <div className="space-y-8">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/StammeringTherapy.png"
                alt="Stammering Therapy Team"
                fill
                className="object-cover"
              />
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-blue-900 bg-opacity-30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900 to-transparent">
                <h3 className="text-white text-2xl font-bold">Our Global Team</h3>
                <p className="text-blue-100">Specialists from across the world</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">23+</div>
                <p className="text-gray-700 mt-2">Years of Combined Experience</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <p className="text-gray-700 mt-2">Regions Worldwide</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">10000+</div>
                <p className="text-gray-700 mt-2">Stammerers Helped</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <p className="text-gray-700 mt-2">Evidence-Based Methods</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              We are a dedicated team of stammering therapy specialists that came together with one goal in mind: to make effective stammering therapy accessible to everyone who needs it.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our collaborative effort brings together dozens of Audiology and Speech Disorders Specialists, stammering therapists, and speech therapists from Eastern Europe, Western Europe, and North America.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
              <h4 className="text-xl font-medium text-blue-800 mb-4">Our Two-Pronged Approach</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900">E-Stammering App</h5>
                    <p className="mt-1 text-gray-700">A comprehensive digital platform providing exercises, techniques, and progress tracking for self-guided therapy.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900">Private Therapy Sessions</h5>
                    <p className="mt-1 text-gray-700">Personalized one-on-one sessions with certified specialists tailored to your specific needs and challenges.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Link 
                href="/about" 
                className="inline-flex items-center px-5 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
              >
                Learn More About Us
                <svg 
                  className="ml-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center px-5 py-3 text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-300 shadow hover:shadow-lg"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-20 bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-12">
              <h3 className="text-2xl font-bold text-white mb-4">Start Your Journey Today</h3>
              <p className="text-blue-100 text-lg mb-6">
                Whether through our app or personalized therapy sessions, our team is ready to help you achieve fluent, confident speech.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/e-stammering" 
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow hover:shadow-lg"
                >
                  Try the App
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-blue-700 transition-all duration-300"
                >
                  Schedule a Session
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;