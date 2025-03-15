import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = movie.Poster && !movie.Poster.includes('N/A') 
    ? movie.Poster 
    : '/images/movie-placeholder.svg';

  return (
    <div 
      className="relative overflow-visible rounded-lg card-shadow corner-shadow cursor-pointer group/card"
      onClick={onClick}
    >
      {/* Image container with transform effect */}
      <div className="w-full aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <div 
          className={`w-full h-full transition-all duration-500 transform-gpu ${!imageLoaded ? 'skeleton-shimmer' : ''}`}
          style={{ transformOrigin: 'center 20%' }}
        >
          <img 
            src={imageUrl}
            className={`w-full h-full object-cover rounded-lg transition-all duration-500 group-hover/card:scale-[1.15] group-hover/card:-translate-y-3 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            alt={movie.Title}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ transformOrigin: 'center 20%' }}
          />
        </div>
      </div>

      {/* Overlay with content */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 transition-all duration-300 z-20"
      >
        {/* Play button - hidden by default, shown on hover */}
        <div 
          className="flex justify-center transition-all duration-300 opacity-0 transform translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0"
        >
          <Play className="w-12 h-12 text-red-500 mb-4" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-1 relative z-20">
          {movie.Title}
        </h3>

        {/* Year and Type */}
        <p className="text-sm text-gray-300 mb-2 relative z-20">
          {movie.Year} • {movie.Type}
        </p>

        {/* Description - hidden by default, shown on hover */}
        <div 
          className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover/card:max-h-20 group-hover/card:opacity-100 relative z-20"
        >
          <p className="text-xs text-gray-400 line-clamp-3">
            {`A ${movie.Type} released in ${movie.Year}, featuring an engaging storyline and memorable characters.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 