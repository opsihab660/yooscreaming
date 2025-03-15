import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById, fetchTrendingMovies } from '../api';
import { ArrowLeft, Play, Star, Calendar, Film, Tag, Clock, Plus, Share2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id || ''),
    enabled: !!id,
  });

  const { data: recommendedMovies = [] } = useQuery({
    queryKey: ['recommendedMovies'],
    queryFn: fetchTrendingMovies,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <p className="mb-8">Sorry, we couldn't find the movie you're looking for.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center mx-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Hero Section with Backdrop */}
      <div 
        className="relative w-full h-[70vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${movie.Poster})`,
          backgroundPosition: 'center 20%'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent"></div>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.Title}</h1>
            
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="opacity-75">{movie.Year}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="opacity-75">{movie.Type === 'movie' ? 'Movie' : movie.Type}</span>
              {movie.Genre && (
                <>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="opacity-75">{movie.Genre}</span>
                </>
              )}
            </div>
            
            <p className="text-gray-300 mb-6 max-w-2xl">
              {movie.Type === 'movie' 
                ? `${movie.Title} is a captivating ${movie.Genre} film released in ${movie.Year}. With its engaging storyline and memorable characters, this movie has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
                : `${movie.Title} is a captivating ${movie.Genre} ${movie.Type} released in ${movie.Year}. With its engaging storyline and memorable characters, this ${movie.Type} has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
              }
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play Now
              </button>
              <button className="flex items-center bg-gray-800/70 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors">
                <Plus className="mr-2 h-5 w-5" />
                Add to List
              </button>
              <button className="flex items-center bg-gray-800/70 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors">
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Details */}
          <div className="w-full md:w-2/3">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-xl font-bold mb-4">About {movie.Title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Release Year</p>
                  <p>{movie.Year}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Genre</p>
                  <p>{movie.Genre || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="capitalize">{movie.Type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Runtime</p>
                  <p>120 minutes</p>
                </div>
              </div>
              <p className="text-gray-300">
                {movie.Type === 'movie' 
                  ? `${movie.Title} takes viewers on an unforgettable journey through ${movie.Genre}. Released in ${movie.Year}, this film showcases exceptional performances and a compelling narrative that keeps audiences engaged from start to finish.`
                  : `${movie.Title} takes viewers on an unforgettable journey through ${movie.Genre}. Released in ${movie.Year}, this ${movie.Type} showcases exceptional performances and a compelling narrative that keeps audiences engaged from start to finish.`
                }
              </p>
            </div>
            
            {/* Cast & Crew */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
                    </div>
                    <p className="font-medium">Actor Name</p>
                    <p className="text-sm text-gray-400">Character</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Director</p>
                    <p>Director Name</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Writer</p>
                    <p>Writer Name</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Producer</p>
                    <p>Producer Name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Poster */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800 mb-4">
                <img 
                  src={movie.Poster} 
                  alt={movie.Title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-bold">8.5/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="ml-1">120 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommended Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendedMovies.slice(0, 6).map((recommendedMovie) => (
            <MovieCard key={recommendedMovie.imdbID} movie={recommendedMovie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage; 