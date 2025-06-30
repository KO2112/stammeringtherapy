"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides: Slide[] = [
    {
      image: "/therapy-session.jpg",
      title: "Konuşma Özgürlüğü Terapisi",
      subtitle: "Kekemelik zorluklarını aşmak için profesyonel destek"
    },
    {
      image: "/digital-tools.jpg",
      title: "Dijital Konuşma Araçları",
      subtitle: "Teknikleri pratik yapın ve evinizde ilerlemenizi takip edin"
    },
    {
      image: "/group-session.jpg",
      title: "Topluluk Desteği",
      subtitle: "Aynı yolculukta olan diğerleriyle bağlantı kurun"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-screen max-h-[600px] overflow-hidden">
      {slides.map((slide, index: number) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-blue-900/70 z-10"></div>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 px-4 text-center pt-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
            <p className="text-lg md:text-xl max-w-lg">{slide.subtitle}</p>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
        {slides.map((_, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`mx-2 transition-all duration-300 ${
              index === currentSlide 
                ? "w-6 h-2 bg-white rounded-full" 
                : "w-2 h-2 bg-white bg-opacity-50 rounded-full"
            }`}
            aria-label={`Slayt ${index + 1}'e git`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;