import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Movie } from '../types';
import { fetchMovies } from '../api';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { 
  SearchResultsSkeleton, 
  FiltersSkeleton, 
  DetailedMovieCardSkeleton 
} from './SkeletonLoader';

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ isOpen, onClose, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const skeletonTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialQuery && initialQuery !== searchQuery) {
        setSearchQuery(initialQuery);
        setShowSkeleton(true);
        startSkeletonTimer();
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, [isOpen, initialQuery]);

  const startSkeletonTimer = () => {
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
    }
    
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);
  };

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If search query is empty, immediately clear results and loading states
    if (searchQuery.trim() === '') {
      setResults([]);
      setIsLoading(false);
      setShowSkeleton(false);
      setIsTyping(false);
      return;
    }

    if (searchQuery.trim().length >= 1) {
      setIsTyping(true);
      setShowSkeleton(true);
    }

    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else if (searchQuery.trim().length === 0) {
        setResults([]);
      }
      setIsTyping(false);
    }, 500);

    typingTimeoutRef.current = delayDebounceFn;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setShowSkeleton(true);
    startSkeletonTimer();
    
    try {
      const searchResults = await fetchMovies(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSelectedMovie(null);
    setShowSkeleton(false);
    setIsLoading(false);
    setIsTyping(false);
    
    // Clear any pending timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
      skeletonTimeoutRef.current = null;
    }
  };

  const filteredResults = results.filter(movie => {
    if (activeFilter === 'all') return true;
    return movie.Type === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Search</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchQuery(newValue);
              
              // If the input is cleared completely, immediately reset all states
              if (newValue === '') {
                setResults([]);
                setShowSkeleton(false);
                setIsLoading(false);
                setIsTyping(false);
                
                // Clear any pending timeouts
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = null;
                }
                if (skeletonTimeoutRef.current) {
                  clearTimeout(skeletonTimeoutRef.current);
                  skeletonTimeoutRef.current = null;
                }
              }
            }}
            placeholder="Search for movies, TV shows, and more..."
            className="bg-gray-900 text-white w-full pl-10 pr-10 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>

        {/* Filters */}
        {isTyping || showSkeleton ? (
          <FiltersSkeleton />
        ) : (
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeFilter === 'all' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('movie')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeFilter === 'movie' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Movies
            </button>
            <button 
              onClick={() => setActiveFilter('series')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeFilter === 'series' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              TV Shows
            </button>
          </div>
        )}

        {/* Selected Movie Detail */}
        {selectedMovie && !showSkeleton ? (
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900/50 rounded-xl overflow-hidden">
              <div className="w-full md:w-1/3 aspect-[2/3] md:max-w-[240px]">
                <img 
                  src={selectedMovie.Poster && !selectedMovie.Poster.includes('N/A') 
                    ? selectedMovie.Poster 
                    : '/images/movie-placeholder.svg'}
                  alt={selectedMovie.Title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">{selectedMovie.Title}</h3>
                <p className="text-gray-400 mb-4">{selectedMovie.Year} • {selectedMovie.Type}</p>
                <p className="text-gray-300 mb-6">
                  {selectedMovie.Genre || 'No genre information available.'}
                </p>
                <div className="flex space-x-3">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer">
                    Watch Now
                  </button>
                  <button 
                    onClick={() => setSelectedMovie(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Back to Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (selectedMovie && showSkeleton) && (
          <DetailedMovieCardSkeleton />
        )}

        {/* Results */}
        {isTyping || showSkeleton ? (
          <div className="animate-fade-in">
            {!selectedMovie && (
              <>
                {/* Featured First Result Skeleton */}
                <DetailedMovieCardSkeleton />
                
                {/* Rest of results skeleton */}
                <div className="mt-8">
                  <SearchResultsSkeleton />
                </div>
              </>
            )}
          </div>
        ) : isLoading ? (
          <div className="py-8">
            {!selectedMovie && (
              <>
                {/* Featured First Result Skeleton */}
                <DetailedMovieCardSkeleton />
                
                {/* Rest of results skeleton */}
                <div className="mt-8">
                  <SearchResultsSkeleton />
                </div>
              </>
            )}
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            {searchQuery.length === 0 ? (
              <p className="text-xl">Please type to search</p>
            ) : (
              <p className="text-xl">Type at least 2 characters to search</p>
            )}
          </div>
        ) : filteredResults.length > 0 ? (
          <div>
            {!selectedMovie && (
              <div className="mb-4">
                <p className="text-gray-400">Found {filteredResults.length} results for "{searchQuery}"</p>
              </div>
            )}
            
            {/* Featured First Result */}
            {!selectedMovie && filteredResults.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 rounded-xl overflow-hidden">
                  <div className="w-full md:w-1/3 aspect-[2/3] md:max-w-[240px]">
                    <img 
                      src={filteredResults[0].Poster && !filteredResults[0].Poster.includes('N/A') 
                        ? filteredResults[0].Poster 
                        : '/images/movie-placeholder.svg'}
                      alt={filteredResults[0].Title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-2">{filteredResults[0].Title}</h3>
                    <p className="text-gray-400 mb-4">{filteredResults[0].Year} • {filteredResults[0].Type}</p>
                    <p className="text-gray-300 mb-6">
                      {filteredResults[0].Genre || 'No genre information available.'}
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                      >
                        Watch Now
                      </button>
                      <button 
                        onClick={() => setSelectedMovie(filteredResults[0])}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Rest of the results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 staggered-fade-in p-4">
              {filteredResults.slice(1).map((movie, index) => (
                <div 
                  key={movie.imdbID} 
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="cursor-pointer relative isolate mb-4"
                >
                  <MovieCard 
                    movie={movie} 
                    onClick={() => setSelectedMovie(movie)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No results found for "{searchQuery}"</p>
            <button 
              onClick={() => {
                clearSearch();
                // Focus the search input after clearing
                setTimeout(() => {
                  const searchInput = document.querySelector('input[type="text"]');
                  if (searchInput instanceof HTMLInputElement) {
                    searchInput.focus();
                  }
                }, 100);
              }}
              className="mt-4 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              Try different keywords or check your spelling
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 