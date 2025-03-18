import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { Movie } from '../types';
import { useNavigate } from 'react-router-dom';

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

// Mock similar movies data
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

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Add animations to document head when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openModal(movie);
    }
  };

  const openModal = (movieToShow: Movie) => {
    setSelectedMovie(movieToShow);
    setShowModal(true);
    setIsClosing(false);
    document.body.style.overflow = 'hidden';
  };

  const startCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      document.body.style.overflow = 'auto';
    }, 300); // Match this with the animation duration
  };

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      startCloseModal();
    }
  };

  const handleCloseButtonClick = () => {
    startCloseModal();
  };

  const handleSimilarMovieClick = (similarMovie: any) => {
    // Convert the similar movie to the Movie type format
    const movieDetails: Movie = {
      _id: similarMovie.id,
      video_url: "",
      image: similarMovie.Poster,
      title: similarMovie.Title,
      description: `A ${similarMovie.Type} released in ${similarMovie.Year}`,
      release_date: `${similarMovie.Year}-01-01`,
      genre: [],
      runtime: "2h 0m",
      type: similarMovie.Type,
      tags: [],
      like_count: 0,
      cast: [],
      country: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      __v: 0,
      imdbID: similarMovie.id,
      Title: similarMovie.Title,
      Year: similarMovie.Year,
      Poster: similarMovie.Poster,
      Type: similarMovie.Type
    };
    
    // Close current modal and open new one with a slight delay
    startCloseModal();
    setTimeout(() => {
      openModal(movieDetails);
    }, 350);
  };

  const imageUrl = (movieToShow: Movie) => 
    movieToShow.Poster && !movieToShow.Poster.includes('N/A') 
      ? movieToShow.Poster 
      : '/images/movie-placeholder.svg';

  const currentMovie = selectedMovie || movie;
  const currentImageUrl = imageUrl(currentMovie);

  const handleWatchNow = () => {
    // Get video URL for the movie
    const videoUrl = currentMovie.video_url || "https://vgorigin.hakunaymatata.com/cms/87233869f345c5c4a879e2201acf2853.mp4?Expires=1743486372&KeyName=wefeed&Signature=a15Nd0pUbiqeB6NLbDpIBAMe614VwloO-0d3tJLqjJnQ1vGkUoS5_DGqOZywS1YRlRUCH_QrdAkT9YBSKhCvAQ";
    
    // Close modal
    startCloseModal();
    
    // Navigate to video player page with movie details
    navigate('/video-player', { 
      state: { 
        videoUrl, 
        title: currentMovie.title || currentMovie.Title 
      } 
    });
  };

  return (
    <>
      <div 
        className="relative overflow-visible rounded-lg card-shadow corner-shadow cursor-pointer group/card hover:p-0 hover:transform hover:scale-[1.2] hover:z-[1]"
        style={{ transition: '.2s .8s' }}
        onClick={handleClick}
      >
        {/* Image container with transform effect */}
        <div className="w-full aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
          <div 
            className={`w-full h-full transition-all duration-500 transform-gpu ${!imageLoaded ? 'skeleton-shimmer' : ''}`}
            style={{ transformOrigin: 'center 20%' }}
          >
            <img 
              src={currentImageUrl}
              className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              alt={currentMovie.Title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Overlay with content */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 transition-all duration-300 z-20 opacity-0 group-hover/card:opacity-100"
        >
          {/* Play button - hidden by default, shown on hover */}
          <div 
            className="flex justify-center transition-all duration-300 transform translate-y-4 group-hover/card:translate-y-0"
          >
            <Play className="w-12 h-12 text-red-500 mb-4" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-1 relative z-20 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
            {currentMovie.Title}
          </h3>

          {/* Year and Type */}
          <p className="text-sm text-gray-300 mb-2 relative z-20 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
            {currentMovie.Year} • {currentMovie.Type}
          </p>

          {/* Description - hidden by default, shown on hover */}
          <div 
            className="overflow-hidden transition-all duration-300 max-h-0 group-hover/card:max-h-20 relative z-20"
          >
            <p className="text-xs text-gray-400 line-clamp-3">
              {`A ${currentMovie.Type} released in ${currentMovie.Year}, featuring an engaging storyline and memorable characters.`}
            </p>
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
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
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              onClick={handleCloseButtonClick}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Movie backdrop */}
            <div 
              className="relative w-full h-[40vh] bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${currentImageUrl})`,
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
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentMovie.Title}</h1>
                
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="opacity-75">{currentMovie.Year}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="opacity-75 capitalize">{currentMovie.Type}</span>
                  {currentMovie.Genre && (
                    <>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="opacity-75">{currentMovie.Genre}</span>
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
                    src={currentImageUrl}
                    alt={currentMovie.Title}
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
                    {currentMovie.description || (currentMovie.Type === 'movie' 
                      ? `${currentMovie.Title} is a captivating ${currentMovie.Genre || ''} film released in ${currentMovie.Year}. With its engaging storyline and memorable characters, this movie has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
                      : `${currentMovie.Title} is a captivating ${currentMovie.Genre || ''} ${currentMovie.Type} released in ${currentMovie.Year}. With its engaging storyline and memorable characters, this ${currentMovie.Type} has garnered critical acclaim for its storytelling, performances, and visual aesthetics.`
                    )}
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
                      <p>{currentMovie.Year}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Genre</p>
                      <p>{currentMovie.genre && currentMovie.genre.length > 0 
                        ? currentMovie.genre.join(', ') 
                        : currentMovie.Genre || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="capitalize">{currentMovie.type || currentMovie.Type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Runtime</p>
                      <p>{currentMovie.runtime || '120 minutes'}</p>
                    </div>
                    {currentMovie.country && (
                      <div>
                        <p className="text-gray-400 text-sm">Country</p>
                        <p>{currentMovie.country}</p>
                      </div>
                    )}
                    {currentMovie.like_count !== undefined && (
                      <div>
                        <p className="text-gray-400 text-sm">Likes</p>
                        <p>{currentMovie.like_count}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {currentMovie.tags && currentMovie.tags.length > 0 && (
                    <div className="mb-4" style={{ 
                      animation: isClosing 
                        ? 'fadeOut 0.2s ease-out forwards'
                        : 'fadeIn 0.6s ease-out 0.65s both' 
                    }}>
                      <p className="text-gray-400 text-sm mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {currentMovie.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Cast */}
                  {currentMovie.cast && currentMovie.cast.length > 0 && (
                    <div className="mb-4" style={{ 
                      animation: isClosing 
                        ? 'fadeOut 0.2s ease-out forwards'
                        : 'fadeIn 0.6s ease-out 0.7s both' 
                    }}>
                      <p className="text-gray-400 text-sm mb-2">Cast</p>
                      <div className="flex flex-wrap gap-2">
                        {currentMovie.cast.map((actor, index) => (
                          <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="flex space-x-3"
                    style={{ 
                      animation: isClosing 
                        ? 'fadeOut 0.2s ease-out forwards'
                        : 'slideUp 0.5s ease-out 0.7s both' 
                    }}
                  >
                    <button 
                      onClick={handleWatchNow}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                    >
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
    </>
  );
};

export default MovieCard; 