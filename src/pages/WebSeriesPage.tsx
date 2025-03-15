import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWebSeries } from '../api';
import { HomePageSkeleton } from '../components/SkeletonLoader';
import MovieCard from '../components/MovieCard';

const WebSeriesPage: React.FC = () => {
  const { data: series = [], isLoading } = useQuery({
    queryKey: ['series'],
    queryFn: fetchWebSeries,
  });

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Web Series</h1>
        
        {isLoading ? (
          <HomePageSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {series.map((show) => (
              <MovieCard key={show.imdbID} movie={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSeriesPage; 