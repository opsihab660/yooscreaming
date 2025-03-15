import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Movie } from '../types';
import { fetchMovies } from '../api';
import MovieCard from './MovieCard';
import SearchResults from './SearchResults';
import { QuickSearchSkeleton, Skeleton } from './SkeletonLoader';

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skeletonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start skeleton timer
  const startSkeletonTimer = () => {
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
    }
    
    // Show skeleton for at least 1.8 seconds for better UX
    setShowSkeleton(true);
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
    }, 1800);
  };

  // Handle search query changes
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If search query is empty, immediately clear results and loading states
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsLoading(false);
      setShowSkeleton(false);
      setIsTyping(false);
      // Only hide results if query is completely empty
      if (searchQuery === '') {
        setShowResults(false);
      }
      return;
    }

    if (searchQuery.trim().length >= 1) {
      setIsTyping(true);
      setShowResults(true);
      // Always show skeleton first when typing
      startSkeletonTimer();
    }

    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(searchQuery.trim().length >= 1);
      }
      setIsTyping(false);
    }, 500);

    typingTimeoutRef.current = delayDebounceFn;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsLoading(true);
    startSkeletonTimer();
    
    try {
      const results = await fetchMovies(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
      setShowSkeleton(false);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
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
    
    inputRef.current?.focus();
  };

  const openFullSearch = () => {
    setShowFullSearch(true);
    setIsExpanded(false);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      openFullSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // If the input is cleared completely, immediately reset all states
    if (newValue === '') {
      setSearchResults([]);
      setShowResults(false);
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
    } else if (!showResults && newValue.trim().length >= 1) {
      setShowResults(true);
    }
  };

  return (
    <>
      <div ref={searchRef} className="relative z-50">
        <div 
          className={`flex items-center transition-all duration-300 ${
            isExpanded 
              ? 'bg-black/80 border border-gray-700 rounded-full w-64 md:w-80' 
              : 'w-auto'
          }`}
        >
          {isExpanded ? (
            <>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search Movies & Series"
                className="bg-transparent text-white px-4 py-2 w-full focus:outline-none"
              />
              {searchQuery ? (
                <button 
                  onClick={clearSearch}
                  className="mr-1 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <Search className="w-5 h-5 mr-3 text-gray-400" />
              )}
            </>
          ) : (
            <button 
              onClick={toggleSearch}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full mt-2 w-full md:w-96 max-h-[70vh] overflow-y-auto bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-2xl">
            {/* Always show skeleton first when typing or loading */}
            {isTyping || showSkeleton ? (
              <div className="animate-fade-in">
                <QuickSearchSkeleton />
              </div>
            ) : isLoading ? (
              <div className="p-6">
                <div className="flex justify-center items-center">
                  <div className="skeleton-shimmer w-8 h-8 rounded-full"></div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Quick Results</h3>
                  <button 
                    onClick={openFullSearch}
                    className="text-sm text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    See all results
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6 staggered-fade-in p-4">
                  {searchResults.slice(0, 4).map((movie, index) => (
                    <div key={movie.imdbID} className="col-span-1 relative isolate mb-2" style={{ animationDelay: `${index * 100}ms` }}>
                      <MovieCard 
                        movie={movie} 
                        onClick={openFullSearch}
                      />
                    </div>
                  ))}
                </div>
                {searchResults.length > 4 && (
                  <button 
                    onClick={openFullSearch}
                    className="w-full mt-4 py-2 text-center text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
                  >
                    View all {searchResults.length} results
                  </button>
                )}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="p-6 text-center text-gray-400">
                <p>No results found for "{searchQuery}"</p>
                <button 
                  onClick={openFullSearch}
                  className="mt-3 text-sm text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Try advanced search
                </button>
              </div>
            ) : searchQuery.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Please type to search</p>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Type at least 2 characters to search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Page Search Results */}
      {showFullSearch && (
        <SearchResults 
          isOpen={showFullSearch} 
          onClose={() => setShowFullSearch(false)}
          initialQuery={searchQuery}
        />
      )}
    </>
  );
};

export default SearchBar; 