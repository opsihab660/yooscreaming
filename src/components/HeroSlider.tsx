import React, { useState, useEffect, useCallback } from 'react';
import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { HeroSliderSkeleton } from './SkeletonLoader';

interface SlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    image: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg",
    title: "Pather Panchali",
    description: "Experience the timeless masterpiece by Satyajit Ray that changed Indian cinema forever. A story of life, struggle, and human spirit."
  },
  {
    id: 2,
    image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    title: "The Lord of the Rings",
    description: "An epic fantasy adventure that follows the journey of Frodo Baggins to destroy the One Ring and defeat the Dark Lord Sauron."
  },
  {
    id: 3,
    image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    title: "Titanic",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides.map((slide) => {
        return new Promise<number>((resolve) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = () => resolve(slide.id);
          img.onerror = () => resolve(slide.id); // Still resolve on error to avoid blocking
        });
      });
      
      await Promise.all(imagePromises);
      setIsLoading(false);
    };
    
    preloadImages();
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (isLoading) return; // Don't start auto-slide during loading
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  if (isLoading) {
    return <HeroSliderSkeleton />;
  }

  return (
    <div className="relative sm:h-[80vh] h-[100vh] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 z-0'
            }`}
          >
            <img 
              src={slide.image}
              className="w-full h-full object-cover"
              alt={slide.title}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            
            {/* Decorative SVG Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-soft-light">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id={`redGlow-${slide.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                  <pattern id={`circlePattern-${slide.id}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="white" />
                  </pattern>
                  <linearGradient id={`fadeGradient-${slide.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff3e3e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill={`url(#circlePattern-${slide.id})`} className="svg-float" />
                <path d="M0,30 Q50,0 100,30 L100,70 Q50,100 0,70 Z" fill={`url(#fadeGradient-${slide.id})`} className="svg-pulse" />
                <circle cx="70" cy="30" r="20" fill={`url(#redGlow-${slide.id})`} className="svg-glow" />
                
                <g className="svg-float" style={{ animationDelay: '2s' }}>
                  <circle cx="20" cy="20" r="5" fill="#ff3e3e" opacity="0.2" />
                  <circle cx="25" cy="25" r="3" fill="#ffffff" opacity="0.3" />
                  <circle cx="15" cy="15" r="2" fill="#ffffff" opacity="0.3" />
                </g>
                
                <path 
                  d="M10,90 Q30,70 50,90 T90,90" 
                  stroke="#ff3e3e" 
                  strokeWidth="0.5" 
                  fill="none" 
                  opacity="0.3"
                  className="svg-pulse"
                  style={{ animationDelay: '1s' }}
                />
                
                <path 
                  d="M80,10 Q60,30 40,10 T10,10" 
                  stroke="#ffffff" 
                  strokeWidth="0.3" 
                  fill="none" 
                  opacity="0.2"
                  className="svg-pulse"
                  style={{ animationDelay: '3s' }}
                />
              </svg>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-transparent to-[#0D0D0D]/70">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/70 to-transparent">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
                  <div className={`animate-float transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{slide.title}</h1>
                    <p className="text-xl mb-8 max-w-2xl text-gray-300 leading-relaxed">{slide.description}</p>
                    <div className="flex space-x-4">
                      <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full flex items-center space-x-2 hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 btn-shadow">
                        <Play className="w-5 h-5" />
                        <span className="font-medium">Watch Now</span>
                      </button>
                      <button className="glass-effect text-white px-8 py-4 rounded-full flex items-center space-x-2 hover:bg-white/10 transition-all duration-300 btn-shadow">
                        <span className="font-medium">More Info</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-500 w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 