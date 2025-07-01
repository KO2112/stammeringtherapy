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
              E-Kekemelik Uygulamasını Deneyin
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              E-Kekemelik Terapi Uygulaması, kekemeliği olan bireyler için tasarlanmış özel bir araçtır ve 
              konuşma akıcılığını geliştirmek ve güven oluşturmak için etkili teknikler ve egzersizler sunar.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <p className="text-gray-700">
                Bu uygulama, sertifikalı kekemelik terapistleri ve Odyoloji ve Konuşma Bozuklukları Uzmanları ile iş birliği içinde geliştirilmiş olup, 
                kekemelikle ilgili zorlukların üstesinden gelmenize yardımcı olacak kanıta dayalı yaklaşımlar içermektedir.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Size özel olarak uyarlanmış kişiselleştirilmiş konuşma egzersizleri</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Gerçek zamanlı geri bildirim ve gelişim takibi</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Kullanıcılar ve uzmanlardan oluşan destekleyici bir topluluğa erişim</p>
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
                Uygulamayı Şimdi Dene
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
              alt="E-Kekemelik Uygulama Demosu"
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
