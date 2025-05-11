"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('app');
  
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive stammering solutions to help you achieve confident, fluent speech
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Navigation */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'app'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              E-Stammering App
            </button>
            <button
              onClick={() => setActiveTab('therapy')}
              className={`px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'therapy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Therapy Sessions
            </button>
          </div>
        </div>
      </section>
      
      {/* E-Stammering App Section */}
      {activeTab === 'app' && (
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">E-Stammering App</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our innovative digital platform provides personalized stammering therapy exercises 
                  and techniques that you can access anytime, anywhere. Developed by certified speech 
                  specialists from around the world.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Personalized exercises based on your specific stammering patterns</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Track your progress with detailed analytics and reporting</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Access to a community of users and specialists for support</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Evidence-based techniques developed by certified specialists</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/e-stammering"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
                  >
                    Try the App
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/Stammering-Therapy-logo.png"
                  alt="E-Stammering App Demo"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
            
            {/* App Features */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">App Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Daily Exercises</h4>
                  <p className="text-gray-700">
                    Tailored daily practice routines to build speech muscle memory and confidence.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h4>
                  <p className="text-gray-700">
                    Monitor your improvement with visual analytics and milestone achievements.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Community Support</h4>
                  <p className="text-gray-700">
                    Connect with others on similar journeys and receive guidance from experts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Therapy Sessions Section */}
      {activeTab === 'therapy' && (
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/StammeringTherapy.png"
                    alt="Stammering Therapy Session"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Private Therapy Sessions</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our one-on-one sessions with certified stammering specialists provide personalized
                  therapy tailored to your specific needs. Available both in-person and remotely to 
                  accommodate your schedule and location.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Comprehensive assessment of your stammering patterns</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Customized therapy plan developed by expert specialists</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Regular progress reviews and plan adjustments</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Flexible scheduling with remote and in-person options</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
                  >
                    Schedule a Session
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Therapy Approaches */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Therapy Approaches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Fluency Shaping</h4>
                  <p className="text-gray-700">
                    Techniques that focus on controlled breathing, gentle onset of voice, and smooth speech transitions.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Stuttering Modification</h4>
                  <p className="text-gray-700">
                    Methods to modify stammering moments and reduce fear and tension associated with speaking.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Cognitive Behavioral</h4>
                  <p className="text-gray-700">
                    Addressing thoughts and feelings about stammering to build confidence and reduce anxiety.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
     
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Journey to Fluent Speech Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the approach that works best for you and take the first step toward confident communication.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/e-stammering" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
            >
              Try the App
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all duration-300"
            >
              Schedule Therapy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}