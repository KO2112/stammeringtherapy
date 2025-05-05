"use client"
import { useState } from 'react';

const StammeringTherapyTechniques = () => {
  const [activeTab, setActiveTab] = useState('speechRate');
  
  const techniques = [
    {
      id: 'speechRate',
      title: 'Speech Rate Control',
      description: 'Manage the speed of speech to enhance fluency and maintain consistent, controlled speech patterns. This technique helps create a more rhythmic speaking style that reduces stammering incidents.',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'breathing',
      title: 'Diaphragmatic Breathing',
      description: 'Improve breath control for smooth speech, ensuring better airflow and voice stability. This foundational technique creates the support needed for fluent speech production and reduces tension in speech muscles.',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'motorControl',
      title: 'Oral Motor Control',
      description: 'Strengthen and coordinate speech muscles for clear and effective communication. Targeted exercises improve the precision and timing of speech movements, resulting in more controlled articulation and reduced stammering.',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m-2.828-4.242a9 9 0 001.414 1.414" />
        </svg>
      )
    },
    {
      id: 'fluencyShaping',
      title: 'Fluency Shaping',
      description: 'Develop fluent speech patterns, reducing stammering through structured techniques. This comprehensive approach modifies speech behaviors to create smoother transitions between sounds and words, building confidence in communication.',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO-optimized heading area */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Evidence-Based Approach</h2>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">What is Stammering Therapy?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Stammering therapy focuses on proven techniques that help individuals achieve greater speech fluency, communication confidence, and reduced speech anxiety.
          </p>
        </div>

        {/* How does it work section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">How Does It Work?</h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <p className="text-gray-700 text-lg leading-relaxed">
              Our comprehensive stammering therapy program combines multiple evidence-based techniques tailored to your specific needs. Through consistent practice and expert guidance, you'll develop strategies that address both the physical aspects of speech production and psychological factors that impact fluency.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Personalized Assessment</h3>
                </div>
                <p className="mt-3 text-gray-700">We analyze your specific speech patterns to develop a customized therapy program.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Structured Learning</h3>
                </div>
                <p className="mt-3 text-gray-700">Progressive techniques build skills gradually for lasting improvement.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Techniques section with tabs */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Core Therapy Techniques</h2>
          
          {/* Technique selector tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setActiveTab(tech.id)}
                className={`px-5 py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-300 ${
                  activeTab === tech.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tech.title}
              </button>
            ))}
          </div>
          
          {/* Technique detail area */}
          {techniques.map((tech) => (
            <div
              key={tech.id}
              className={`transition-opacity duration-300 ${
                activeTab === tech.id ? 'opacity-100' : 'hidden opacity-0'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Left column with icon and title */}
                  <div className="bg-blue-50 p-8 flex flex-col justify-center items-center text-center">
                    <div className="bg-white rounded-full p-4 shadow-md mb-6">
                      {tech.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{tech.title}</h2>
                  </div>
                  
                  {/* Right column with description and benefits */}
                  <div className="md:col-span-2 p-8 md:p-10">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {tech.description}
                    </p>
                    <div className="bg-blue-50 p-5 rounded-xl">
                      <h4 className="font-medium text-blue-800 mb-2">Benefits:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Increased speech fluency in everyday situations</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Reduced speech anxiety and improved confidence</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Long-term sustainable speech improvement</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <a 
            href="/services" 
            className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Learn More About Our Services
            <svg 
              className="ml-2 h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default StammeringTherapyTechniques;