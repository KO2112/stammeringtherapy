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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hizmetlerimiz</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Kendinden emin, akıcı konuşma elde etmenize yardımcı olacak kapsamlı kekemelik çözümleri
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
              E-Kekemelik Uygulaması
            </button>
            <button
              onClick={() => setActiveTab('therapy')}
              className={`px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'therapy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Terapi Seansları
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">E-Kekemelik</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Yenilikçi dijital platformumuz, istediğiniz zaman ve yerde erişebileceğiniz kişiselleştirilmiş 
                  kekemelik terapi egzersizleri ve teknikleri sunar. Dünyanın dört bir yanından sertifikalı 
                  konuşma uzmanları tarafından geliştirilmiştir.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Özel kekemelik paternlerinize göre kişiselleştirilmiş egzersizler</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Detaylı analitik ve raporlama ile ilerlemenizi takip edin</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Destek için kullanıcı ve uzman topluluğuna erişim</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Sertifikalı uzmanlar tarafından geliştirilen kanıta dayalı teknikler</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/e-stammering"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
                  >
                    Uygulamayı Deneyin
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/Stammering-Therapy-logo.png"
                  alt="E-Kekemelik Uygulama Demosu"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
            
            {/* App Features */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Uygulama Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Günlük Egzersizler</h4>
                  <p className="text-gray-700">
                    Konuşma kas hafızası ve kendine güven oluşturmak için özel olarak hazırlanmış günlük pratik rutinleri.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">İlerleme Takibi</h4>
                  <p className="text-gray-700">
                    Görsel analizler ve kilometre taşı başarıları ile gelişiminizi izleyin.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Topluluk Desteği</h4>
                  <p className="text-gray-700">
                    Benzer yolculuklarda olan diğer kişilerle bağlantı kurun ve uzmanlardan rehberlik alın.
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
                    alt="Kekemelik Terapi Seansı"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Özel Terapi Seansları</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Sertifikalı kekemelik uzmanları ile bire bir seanslarımız, özel ihtiyaçlarınıza göre 
                  kişiselleştirilmiş terapi sunar. Programınızı ve konumunuzu dikkate alarak hem yüz yüze 
                  hem de uzaktan kullanılabilir.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Kekemelik paternlerinizin kapsamlı değerlendirmesi</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Uzman terapistler tarafından geliştirilen özelleştirilmiş terapi planı</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Düzenli ilerleme değerlendirmeleri ve plan düzenlemeleri</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Uzaktan ve yüz yüze seçenekleri ile esnek planlama</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
                  >
                    Seans Planlayın
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Therapy Approaches */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Terapi Yaklaşımlarımız</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Akıcılık Şekillendirme</h4>
                  <p className="text-gray-700">
                    Kontrollü nefes alma, nazik ses başlangıcı ve düzgün konuşma geçişlerine odaklanan teknikler.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Kekemelik Modifikasyonu</h4>
                  <p className="text-gray-700">
                    Kekeme anları değiştirme ve konuşmayla ilişkili korku ve gerginliği azaltma yöntemleri.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Bilişsel Davranışsal</h4>
                  <p className="text-gray-700">
                    Güven oluşturmak ve kaygıyı azaltmak için kekemelik hakkındaki düşünce ve duygulara odaklanma.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Akıcı Konuşmaya Giden Yolculuğunuzu Bugün Başlatın</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Size en uygun yaklaşımı seçin ve kendinden emin iletişime doğru ilk adımı atın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/e-stammering" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow hover:shadow-lg"
            >
              Uygulamayı Deneyin
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all duration-300"
            >
              Terapi Planlayın
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}