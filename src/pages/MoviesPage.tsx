import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPopularMovies } from '../api';
import { HomePageSkeleton } from '../components/SkeletonLoader';
import MovieCard from '../components/MovieCard';

const MoviesPage: React.FC = () => {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: fetchPopularMovies,
  });

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>
        
        {isLoading ? (
          <HomePageSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage; 