"use client"

import { useState, useEffect } from "react"

interface Slide {
  title: string
  subtitle: string
  bgGradient: string
  animation: string
}

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides: Slide[] = [
    {
      title: "Armoni Kekemelik Tedavisi",
      subtitle: "Kekemelik zorluklarını aşmak için profesyonel destek",
      bgGradient: "from-blue-600 via-blue-700 to-blue-800",
      animation: "slide1",
    },
    {
      title: "E-Kekemelik",
      subtitle: "Teknikleri pratik yapın ve evinizde ilerlemenizi takip edin",
      bgGradient: "from-blue-500 via-blue-600 to-blue-700",
      animation: "slide2",
    },
    {
      title: "Topluluk Desteği",
      subtitle: "Aynı yolculukta olan diğerleriyle bağlantı kurun",
      bgGradient: "from-blue-700 via-blue-800 to-blue-900",
      animation: "slide3",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          {/* Animated Background with Mesh Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}>
            {/* Overlay mesh pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-transparent to-blue-300/10"></div>

            {/* Dynamic Background Animations */}
            {slide.animation === "slide1" && (
              <>
                {/* Floating geometric shapes */}
                <div className="absolute top-16 left-8 w-20 h-20 border-2 border-white/20 rotate-45 animate-spin-slow"></div>
                <div className="absolute top-32 right-16 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-24 left-1/4 w-16 h-16 bg-gradient-to-r from-white/10 to-white/5 rounded-lg rotate-12 animate-float-slow"></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-white/15 rounded-full animate-bounce-slow"></div>

                {/* Animated lines */}
                <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-slide-down"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-slide-right"></div>
              </>
            )}

            {slide.animation === "slide2" && (
              <>
                {/* Rotating rings */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white/10 rounded-full animate-spin-reverse-slow"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/15 rounded-full animate-spin-slow"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse-slow"></div>
                </div>

                {/* Hexagonal patterns */}
                <div className="absolute top-20 left-20 w-12 h-12 bg-white/10 transform rotate-45 animate-float-slow"></div>
                <div className="absolute bottom-32 right-24 w-16 h-16 border-2 border-white/15 transform rotate-12 animate-spin-slow"></div>
                <div className="absolute top-2/3 left-16 w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 animate-bounce-slow"></div>
              </>
            )}

            {slide.animation === "slide3" && (
              <>
                {/* Constellation effect */}
                <div className="absolute inset-0">
                  <div className="absolute top-16 left-16 w-2 h-2 bg-white/40 rounded-full animate-twinkle"></div>
                  <div className="absolute top-24 right-20 w-3 h-3 bg-white/30 rounded-full animate-twinkle-delayed"></div>
                  <div className="absolute top-40 left-1/3 w-2 h-2 bg-white/35 rounded-full animate-twinkle"></div>
                  <div className="absolute bottom-32 right-16 w-3 h-3 bg-white/25 rounded-full animate-twinkle-delayed"></div>
                  <div className="absolute bottom-48 left-24 w-2 h-2 bg-white/40 rounded-full animate-twinkle"></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-twinkle-delayed"></div>

                  {/* Connecting lines between stars */}
                  <svg className="absolute inset-0 w-full h-full">
                    <line
                      x1="64"
                      y1="64"
                      x2="120"
                      y2="96"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      className="animate-draw-line"
                    />
                    <line
                      x1="200"
                      y1="160"
                      x2="280"
                      y2="200"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      className="animate-draw-line-delayed"
                    />
                  </svg>
                </div>

                {/* Flowing wave effect */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/5 to-transparent animate-wave"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/5 to-transparent animate-wave-delayed"></div>
              </>
            )}
          </div>

          {/* Enhanced Content with backdrop blur */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 px-4 text-center">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2
                className={`text-3xl md:text-5xl font-bold mb-4 transform transition-all duration-1000 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent ${
                  index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {slide.title}
              </h2>
              <p
                className={`text-lg md:text-xl max-w-lg transform transition-all duration-1000 delay-300 text-blue-50 ${
                  index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
        <div className="backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20">
          {slides.map((_, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`mx-2 transition-all duration-500 hover:scale-125 ${
                index === currentSlide
                  ? "w-8 h-3 bg-white rounded-full shadow-lg shadow-white/30"
                  : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
              }`}
              aria-label={`Slayt ${index + 1}'e git`}
            />
          ))}
        </div>
      </div>

      {/* Custom CSS for advanced animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        
        @keyframes slide-down {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(0px) scaleY(1); }
          50% { transform: translateX(10px) scaleY(1.1); }
        }
        
        @keyframes wave-delayed {
          0%, 100% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(10px) scaleX(1.1); }
        }
        
        @keyframes draw-line {
          0% { stroke-dasharray: 0, 200; }
          100% { stroke-dasharray: 200, 0; }
        }
        
        @keyframes draw-line-delayed {
          0%, 30% { stroke-dasharray: 0, 200; }
          100% { stroke-dasharray: 200, 0; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 20s linear infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle-delayed 2.5s ease-in-out infinite 0.5s;
        }
        
        .animate-slide-down {
          animation: slide-down 8s ease-in-out infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 10s ease-in-out infinite 2s;
        }
        
        .animate-wave {
          animation: wave 6s ease-in-out infinite;
        }
        
        .animate-wave-delayed {
          animation: wave-delayed 7s ease-in-out infinite 1s;
        }
        
        .animate-draw-line {
          animation: draw-line 3s ease-in-out infinite;
        }
        
        .animate-draw-line-delayed {
          animation: draw-line-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default BannerSlider
