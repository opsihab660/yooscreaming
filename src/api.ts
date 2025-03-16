import toast from 'react-hot-toast';
import { Movie } from './types';
import { trendingMovies, popularMovies, webSeries, searchMovies as localSearchMovies } from './data/movies';

// Cache for API responses
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Simulate API delay for a more realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get cached data or fetch new data
const getCachedOrFetch = async <T>(
  cacheKey: string, 
  fetchFn: () => Promise<T>, 
  delayMs = 0
): Promise<T> => {
  const now = Date.now();
  const cached = apiCache.get(cacheKey);
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  
  try {
    // Simulate network delay in development only
    if (import.meta.env.DEV && delayMs > 0) {
      await delay(delayMs);
    }
    
    const data = await fetchFn();
    apiCache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch data';
    toast.error(message);
    throw error;
  }
};

export const fetchMovies = async (searchTerm: string): Promise<Movie[]> => {
  return getCachedOrFetch(
    `search:${searchTerm}`,
    () => {
      const results = localSearchMovies(searchTerm);
      if (results.length === 0) {
        throw new Error('No movies found');
      }
      return Promise.resolve(results);
    },
    500
  );
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  return getCachedOrFetch(
    'trending',
    () => Promise.resolve(trendingMovies),
    700
  );
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  return getCachedOrFetch(
    'popular',
    () => Promise.resolve(popularMovies),
    600
  );
};

export const fetchWebSeries = async (): Promise<Movie[]> => {
  return getCachedOrFetch(
    'series',
    () => Promise.resolve(webSeries),
    800
  );
};

export const fetchMovieById = async (id: string): Promise<Movie | undefined> => {
  return getCachedOrFetch(
    `movie:${id}`,
    () => {
      // Combine all movie arrays to search through
      const allMovies = [...trendingMovies, ...popularMovies, ...webSeries];
      
      // Find the movie with the matching ID
      const movie = allMovies.find(movie => movie.imdbID === id);
      
      if (!movie) {
        throw new Error('Movie not found');
      }
      
      return Promise.resolve(movie);
    },
    600
  );
};