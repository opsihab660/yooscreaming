import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Play } from 'lucide-react';
import { Movie } from '../types';
import { fetchMovies } from '../api';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { 
  SearchResultsSkeleton, 
  FiltersSkeleton, 
  DetailedMovieCardSkeleton 
} from './SkeletonLoader';

// Mock similar movies data for the selected movie view
const similarMovies = [
  {
    id: 'sm1',
    Title: 'Similar Movie 1',
    Year: '2022',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg'
  },
  {
    id: 'sm2',
    Title: 'Similar Movie 2',
    Year: '2021',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNjRmNDI5MjMtMmFhZi00YzcwLWI4ZGItMGI2MjI0N2Q3YmIwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg'
  },
  {
    id: 'sm3',
    Title: 'Similar Movie 3',
    Year: '2023',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg'
  },
  {
    id: 'sm4',
    Title: 'Similar Movie 4',
    Year: '2020',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BOTJhNzlmNzctNTU5Yy00N2YwLThhMjQtZDM0YjEzN2Y0ZjNhXkEyXkFqcGdeQXVyMTEwMTQ4MzU5._V1_SX300.jpg'
  }
];

// Add CSS animations as a style object
const animationStyles = `
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes modalFadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }
  
  @keyframes backdropReveal {
    from {
      opacity: 0.4;
      transform: scale(1.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

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
  const [isClosing, setIsClosing] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skeletonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Add animations to document head when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      
      // Remove any potential duplicate movies by imdbID
      const uniqueResults = searchResults.filter((movie, index, self) => 
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      );
      
      setResults(uniqueResults);
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

  // Helper function to get image URL
  const getImageUrl = (movie: Movie) => 
    movie.Poster && !movie.Poster.includes('N/A') 
      ? movie.Poster 
      : '/images/movie-placeholder.svg';

  // Handle opening movie details modal
  const openMovieDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsClosing(false);
  };

  // Handle closing movie details modal with animation
  const closeMovieDetails = (e?: React.MouseEvent) => {
    if (e && e.target !== e.currentTarget) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovie(null);
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  };

  // Handle close button click specifically
  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovie(null);
      setIsClosing(false);
    }, 300);
  };

  // Handle similar movie click
  const handleSimilarMovieClick = (similarMovie: any) => {
    // Convert the similar movie to the Movie type format
    const movieDetails: Movie = {
      Title: similarMovie.Title,
      Year: similarMovie.Year,
      imdbID: similarMovie.id,
      Type: similarMovie.Type,
      Poster: similarMovie.Poster
    };
    
    // Close current modal and open new one with a slight delay
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovie(movieDetails);
      setIsClosing(false);
    }, 350);
  };

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMovie) {
        closeMovieDetails();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedMovie]);

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

        {/* Results */}
        {isTyping || showSkeleton ? (
          <div className="animate-fade-in">
            {/* Featured First Result Skeleton */}
            <DetailedMovieCardSkeleton />
            
            {/* Rest of results skeleton */}
            <div className="mt-8">
              <SearchResultsSkeleton />
            </div>
          </div>
        ) : isLoading ? (
          <div className="py-8">
            {/* Featured First Result Skeleton */}
            <DetailedMovieCardSkeleton />
            
            {/* Rest of results skeleton */}
            <div className="mt-8">
              <SearchResultsSkeleton />
            </div>
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
            <div className="mb-4">
              <p className="text-gray-400">Found {filteredResults.length} results for "{searchQuery}"</p>
            </div>
            
            {/* Featured First Result */}
            {filteredResults.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 rounded-xl overflow-hidden">
                  <div className="w-full md:w-1/3 aspect-[2/3] md:max-w-[240px]">
                    <img 
                      src={getImageUrl(filteredResults[0])}
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
                        onClick={() => openMovieDetails(filteredResults[0])}
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
                    onClick={() => openMovieDetails(movie)}
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

        {/* Movie Details Modal Popup */}
        {selectedMovie && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={closeMovieDetails}
            style={{ 
              animation: isClosing ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.3s ease-out forwards'
            }}
          >
            <div 
              ref={modalRef}
              className="relative w-full bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden h-[85vh]"
              style={{
                width: "800px",
                maxWidth: "100%",
                animation: isClosing 
                  ? 'modalFadeOut 0.3s ease-out forwards' 
                  : 'modalFadeIn 0.4s ease-out forwards',
                transformOrigin: 'center'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                onClick={handleCloseButtonClick}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Movie backdrop */}
              <div 
                className="relative w-full h-[40vh] bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${getImageUrl(selectedMovie)})`,
                  backgroundPosition: 'center 20%',
                  animation: isClosing 
                    ? 'fadeOut 0.3s ease-out forwards'
                    : 'backdropReveal 0.8s ease-out forwards'
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                
                {/* Content Container */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ 
                    animation: isClosing 
                      ? 'fadeOut 0.2s ease-out forwards'
                      : 'slideUp 0.6s ease-out 0.2s both' 
                  }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedMovie.Title}</h1>
                  
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="opacity-75">{selectedMovie.Year}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="opacity-75 capitalize">{selectedMovie.Type}</span>
                    {selectedMovie.Genre && (
                      <>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="opacity-75">{selectedMovie.Genre}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Movie details */}
              <div 
                className="p-6 overflow-y-auto" 
                style={{ 
                  maxHeight: 'calc(85vh - 40vh)',
                  animation: isClosing 
                    ? 'fadeOut 0.2s ease-out forwards'
                    : 'fadeIn 0.6s ease-out 0.4s both'
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div 
                    className="w-full md:w-1/3 lg:w-1/4 aspect-[2/3] md:max-w-[160px] flex-shrink-0"
                    style={{ 
                      animation: isClosing 
                        ? 'fadeOut 0.2s ease-out forwards'
                        : 'scaleIn 0.5s ease-out 0.3s both' 
                    }}
                  >
                    <img 
                      src={getImageUrl(selectedMovie)}
                      alt={selectedMovie.Title}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p 
                      className="text-gray-300 mb-6"
                      style={{ 
                        animation: isClosing 
                          ? 'fadeOut 0.2s ease-out forwards'
                          : 'fadeIn 0.6s ease-out 0.5s both' 
                      }}
                    >
                      {selectedMovie.Type === 'movie' 
                        ? `${selectedMovie.Title} is a captivating ${selectedMovie.Genre || ''} film released in ${selectedMovie.Year}. With its engaging storyline and memorable characters, this movie has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
                        : `${selectedMovie.Title} is a captivating ${selectedMovie.Genre || ''} ${selectedMovie.Type} released in ${selectedMovie.Year}. With its engaging storyline and memorable characters, this ${selectedMovie.Type} has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
                      }
                    </p>
                    
                    <div 
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                      style={{ 
                        animation: isClosing 
                          ? 'fadeOut 0.2s ease-out forwards'
                          : 'fadeIn 0.6s ease-out 0.6s both' 
                      }}
                    >
                      <div>
                        <p className="text-gray-400 text-sm">Release Year</p>
                        <p>{selectedMovie.Year}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Genre</p>
                        <p>{selectedMovie.Genre || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Type</p>
                        <p className="capitalize">{selectedMovie.Type}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Runtime</p>
                        <p>120 minutes</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex space-x-3"
                      style={{ 
                        animation: isClosing 
                          ? 'fadeOut 0.2s ease-out forwards'
                          : 'slideUp 0.5s ease-out 0.7s both' 
                      }}
                    >
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer">
                        Watch Now
                      </button>
                      <button 
                        onClick={handleCloseButtonClick}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>

                {/* More Like This Section */}
                <div 
                  className="mt-8 pt-6 border-t border-gray-800"
                  style={{ 
                    animation: isClosing 
                      ? 'fadeOut 0.2s ease-out forwards'
                      : 'fadeIn 0.6s ease-out 0.8s both' 
                  }}
                >
                  <h3 className="text-xl font-semibold mb-4">More Like This</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {similarMovies.map((similarMovie) => (
                      <div 
                        key={similarMovie.id} 
                        className="cursor-pointer group/similar transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimilarMovieClick(similarMovie);
                        }}
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 relative">
                          <img 
                            src={similarMovie.Poster} 
                            alt={similarMovie.Title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/similar:scale-105"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover/similar:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/similar:opacity-100">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <h4 className="text-sm font-medium line-clamp-1 group-hover/similar:text-red-500 transition-colors duration-300">{similarMovie.Title}</h4>
                        <p className="text-xs text-gray-400">{similarMovie.Year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 