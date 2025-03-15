import React from 'react';

interface SkeletonProps {
  className?: string;
  withShimmer?: boolean;
  style?: React.CSSProperties;
  withPulse?: boolean;
  withBorder?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  withShimmer = true, 
  style,
  withPulse = false,
  withBorder = false
}) => {
  return (
    <div 
      className={`
        relative overflow-hidden bg-gray-700/50 rounded-md 
        ${className} 
        ${withShimmer ? 'skeleton-shimmer' : 'animate-pulse'}
        ${withPulse ? 'skeleton-pulse' : ''}
        ${withBorder ? 'skeleton-border' : ''}
      `}
      style={style}
    >
      {withShimmer && (
        <div className="absolute inset-0 skeleton-shimmer-effect" />
      )}
    </div>
  );
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="group relative overflow-hidden rounded-lg card-shadow corner-shadow">
      <div className="w-full aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full rounded-lg" withBorder={true} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4">
        <Skeleton className="w-12 h-12 rounded-full mb-4" withPulse={true} />
        <Skeleton className="w-3/4 h-5 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
  );
};

export const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 staggered-fade-in">
      {Array(10).fill(0).map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 80}ms` }}>
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export const QuickSearchSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="w-32 h-6" withPulse={true} />
        <Skeleton className="w-24 h-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 staggered-fade-in">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced advanced skeleton components
export const DetailedMovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 rounded-xl overflow-hidden skeleton-border">
      <div className="w-full md:w-1/3 aspect-[2/3] md:max-w-[240px]">
        <Skeleton className="w-full h-full rounded-lg" withBorder={true} />
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <Skeleton className="w-3/4 h-8" withPulse={true} />
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-full h-24" />
        <div className="flex space-x-3">
          <Skeleton className="w-24 h-10 rounded-full" withPulse={true} />
          <Skeleton className="w-24 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const CategoryRowSkeleton: React.FC = () => {
  return (
    <div className="mb-8">
      <Skeleton className="w-48 h-7 mb-4" withPulse={true} />
      <div className="flex space-x-4 overflow-x-auto pb-4 staggered-fade-in">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[180px]" style={{ animationDelay: `${index * 100}ms` }}>
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FiltersSkeleton: React.FC = () => {
  return (
    <div className="flex space-x-3 mb-6 staggered-fade-in">
      {Array(4).fill(0).map((_, index) => (
        <Skeleton 
          key={index} 
          className="w-24 h-10 rounded-full" 
          withPulse={true}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
};

// New Hero Slider Skeleton
export const HeroSliderSkeleton: React.FC = () => {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <Skeleton className="w-full h-full" withShimmer={true} withBorder={true} />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-transparent to-[#0D0D0D]/70">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/70 to-transparent">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
              <div className="animate-float">
                <Skeleton className="w-[300px] md:w-[500px] h-12 mb-6" withPulse={true} />
                <Skeleton className="w-[400px] md:w-[600px] h-24 mb-8" />
                <div className="flex space-x-4">
                  <Skeleton className="w-36 h-14 rounded-full" withPulse={true} />
                  <Skeleton className="w-36 h-14 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows skeleton */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <Skeleton className="w-10 h-10 rounded-full" withPulse={true} />
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <Skeleton className="w-10 h-10 rounded-full" withPulse={true} />
      </div>

      {/* Slide indicators skeleton */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {Array(3).fill(0).map((_, index) => (
          <Skeleton 
            key={index}
            className={`h-3 rounded-full ${index === 0 ? 'w-6' : 'w-3'}`}
            withPulse={true}
          />
        ))}
      </div>
    </div>
  );
};

// Home Page Skeleton
export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white">
      {/* Hero Slider Skeleton */}
      <HeroSliderSkeleton />
      
      {/* Content Sections Container */}
      <div className="relative z-10 -mt-24">
        {/* Trending Section Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Skeleton className="w-48 h-8 mb-8" withPulse={true} />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 staggered-fade-in">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                  <MovieCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Movies Section Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Skeleton className="w-48 h-8 mb-8" withPulse={true} />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 staggered-fade-in">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                  <MovieCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Web Series Section Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Skeleton className="w-48 h-8 mb-8" withPulse={true} />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 staggered-fade-in">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                  <MovieCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default {
  Skeleton,
  MovieCardSkeleton,
  SearchResultsSkeleton,
  QuickSearchSkeleton,
  DetailedMovieCardSkeleton,
  CategoryRowSkeleton,
  FiltersSkeleton,
  HeroSliderSkeleton,
  HomePageSkeleton
}; 