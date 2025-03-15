import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { CategoryRowSkeleton } from './SkeletonLoader';

interface MoviesSectionProps {
  movies: Movie[];
}

const MoviesSection: React.FC<MoviesSectionProps> = ({ movies }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate 2.5s loading time
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryRowSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Film className="w-6 h-6 text-red-600 mr-3" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Popular Movies</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoviesSection; 