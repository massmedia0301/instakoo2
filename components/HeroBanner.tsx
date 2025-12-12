import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from '../constants';
import { Platform } from '../types';

interface HeroBannerProps {
  onRecharge: () => void;
  onNavigateToOrder: (platform: Platform) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onRecharge, onNavigateToOrder }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleButtonClick = (slideId: number) => {
    if (slideId === 1) {
      // 1. Recharge Slide
      onRecharge();
    } else if (slideId === 2) {
      // 2. YouTube Slide
      onNavigateToOrder(Platform.YOUTUBE);
    } else if (slideId === 3) {
      // 3. Instagram Slide
      onNavigateToOrder(Platform.INSTAGRAM);
    }
  };

  return (
    // Reduced height from h-[400px] md:h-[480px] to h-[300px] md:h-[380px]
    <div className="relative w-full h-[300px] md:h-[380px] overflow-hidden rounded-b-[40px] shadow-sm bg-white pt-16">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} opacity-90`}></div>
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/30">
                HOT EVENT
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl font-medium mb-8 text-white/90">
                {slide.subtitle}
              </p>
              <button 
                onClick={() => handleButtonClick(slide.id)}
                className="bg-white text-primary font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors transform hover:scale-105 active:scale-95"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows (Desktop Only) */}
      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 rounded-full items-center justify-center text-white backdrop-blur-sm transition-colors"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 rounded-full items-center justify-center text-white backdrop-blur-sm transition-colors"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default HeroBanner;