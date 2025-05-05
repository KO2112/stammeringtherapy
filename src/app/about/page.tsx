"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [activeRegion, setActiveRegion] = useState('all');
  
  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'eastern', name: 'Eastern Europe' },
    { id: 'western', name: 'Western Europe' },
    { id: 'north', name: 'North America' }
  ];
  
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A global team of speech therapy specialists dedicated to helping people who stammer achieve fluent, confident speech.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-700">
                We are a dedicated team of stammering therapy specialists that came together with one goal in mind: to make effective stammering therapy accessible to everyone who needs it.
              </p>
              <p className="text-lg text-gray-700">
                Our collaborative effort brings together dozens of Audiology and Speech Disorders Specialists, stammering therapists, and speech therapists from Eastern Europe, Western Europe, and North America.
              </p>
              <p className="text-lg text-gray-700">
                With over 23 years of combined experience in the field, we've helped more than 10,000 people worldwide overcome stammering challenges and gain speech confidence.
              </p>
            </div>
            
            <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/StammeringTherapy.png"
                alt="Stammering Therapy Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Approach */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Approach</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We combine technology with specialized therapy techniques to provide comprehensive support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">E-Stammering App</h3>
              </div>
              <p className="text-gray-700">
                Our innovative digital platform provides evidence-based exercises, personalized techniques, and progress tracking for self-guided therapy. The app makes daily practice convenient and effective.
              </p>
              <Link 
                href="/e-stammering" 
                className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn more about our app
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Private Therapy</h3>
              </div>
              <p className="text-gray-700">
                Our specialists provide personalized one-on-one therapy sessions tailored to your specific stammering challenges. We offer both in-person and remote sessions to accommodate your needs.
              </p>
              <Link 
                href="/services" 
                className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800 font-medium"
              >
                View our therapy services
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-600">23+</div>
              <p className="text-gray-700 mt-2">Years Experience</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <p className="text-gray-700 mt-2">Clients Helped</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <p className="text-gray-700 mt-2">Global Regions</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <p className="text-gray-700 mt-2">Evidence-Based</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Presence */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Global Presence</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialists come from diverse backgrounds across three regions.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeRegion === region.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eastern Europe</h3>
                <p className="text-gray-700">
                  Our specialists from Poland, Czech Republic, and Ukraine bring innovative approaches to stammering therapy.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Western Europe</h3>
                <p className="text-gray-700">
                  Experts from the UK, Germany, and France contribute established methodologies and research.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">North America</h3>
                <p className="text-gray-700">
                  Our team from the US and Canada brings cutting-edge therapy techniques and technology integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Whether you prefer our app-based approach or personalized therapy sessions, our team is here to support you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/e-stammering" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow hover:shadow-lg"
            >
              Try the App
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-blue-700 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}