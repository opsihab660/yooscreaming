import toast from 'react-hot-toast';
import { Movie } from './types';
import { trendingMovies, popularMovies, webSeries, searchMovies as localSearchMovies } from './data/movies';

// Simulate API delay for a more realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMovies = async (searchTerm: string): Promise<Movie[]> => {
  try {
    // Simulate network delay
    await delay(500);
    
    const results = localSearchMovies(searchTerm);
    
    if (results.length === 0) {
      throw new Error('No movies found');
    }
    
    return results;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movies';
    toast.error(message);
    throw error;
  }
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    // Simulate network delay
    await delay(700);
    
    return trendingMovies;
  } catch (error) {
    toast.error('Failed to fetch trending movies');
    throw error;
  }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    // Simulate network delay
    await delay(600);
    
    return popularMovies;
  } catch (error) {
    toast.error('Failed to fetch popular movies');
    throw error;
  }
};

export const fetchWebSeries = async (): Promise<Movie[]> => {
  try {
    // Simulate network delay
    await delay(800);
    
    return webSeries;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch web series';
    toast.error(message);
    throw error;
  }
};

export const fetchMovieById = async (id: string): Promise<Movie | undefined> => {
  try {
    // Simulate network delay
    await delay(600);
    
    // Combine all movie arrays to search through
    const allMovies = [...trendingMovies, ...popularMovies, ...webSeries];
    
    // Find the movie with the matching ID
    const movie = allMovies.find(movie => movie.imdbID === id);
    
    if (!movie) {
      throw new Error('Movie not found');
    }
    
    return movie;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movie details';
    toast.error(message);
    throw error;
  }
};