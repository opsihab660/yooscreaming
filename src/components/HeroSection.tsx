import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[80vh]">
      <img 
        src="https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg"
        className="w-full h-full object-cover"
        alt="Hero Banner"
      />
      {/* Decorative SVG Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-soft-light">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="redGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <pattern id="circlePattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="white" />
            </pattern>
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3e3e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#circlePattern)" className="svg-float" />
          <path d="M0,30 Q50,0 100,30 L100,70 Q50,100 0,70 Z" fill="url(#fadeGradient)" className="svg-pulse" />
          <circle cx="70" cy="30" r="20" fill="url(#redGlow)" className="svg-glow" />
          
          {/* Additional decorative elements */}
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
            <div className="animate-float">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Pather Panchali</h1>
              <p className="text-xl mb-8 max-w-2xl text-gray-300 leading-relaxed">Experience the timeless masterpiece by Satyajit Ray that changed Indian cinema forever. A story of life, struggle, and human spirit.</p>
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
  );
};

export default HeroSection; 