import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMovies, fetchPopularMovies, fetchWebSeries } from '../api';

// Import components
import HeroSlider from '../components/HeroSlider';
import TrendingSection from '../components/TrendingSection';
import MoviesSection from '../components/MoviesSection';
import WebSeriesSection from '../components/WebSeriesSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { HomePageSkeleton } from '../components/SkeletonLoader';

const HomePage: React.FC = () => {
  const { data: trendingMovies = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingMovies,
  });

  const { data: popularMovies = [], isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: fetchPopularMovies,
  });

  const { data: webSeries = [], isLoading: seriesLoading } = useQuery({
    queryKey: ['series'],
    queryFn: fetchWebSeries,
  });

  const isLoading = trendingLoading || popularLoading || seriesLoading;

  return (
    <>
      {/* Loading State */}
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
        <>
          {/* Hero Slider */}
          <HeroSlider />

          {/* Content Sections Container */}
          <div className="relative z-10 -mt-24">
            {/* Trending Section */}
            <TrendingSection movies={trendingMovies} />

            {/* Movies Section */}
            <MoviesSection movies={popularMovies} />

            {/* Web Series Section */}
            <WebSeriesSection series={webSeries} />
          </div>
        </>
      )}
    </>
  );
};

export default HomePage; 