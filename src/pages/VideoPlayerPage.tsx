import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, X, Volume2, VolumeX, RotateCcw, RotateCw, Settings, Subtitles, ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define video quality options
type VideoQuality = '1080p' | '720p' | '480p' | '360p' | 'auto';

interface VideoSource {
  quality: VideoQuality;
  url: string;
}

const VideoPlayerPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>('auto');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract title and videoUrl from state or use defaults
  const { title = "Video Player", videoUrl } = location.state || {};

  // Default video URL if none is provided
  const defaultVideoUrl = "https://vgorigin.hakunaymatata.com/cms/87233869f345c5c4a879e2201acf2853.mp4?Expires=1743486372&KeyName=wefeed&Signature=a15Nd0pUbiqeB6NLbDpIBAMe614VwloO-0d3tJLqjJnQ1vGkUoS5_DGqOZywS1YRlRUCH_QrdAkT9YBSKhCvAQ";
  
  // Sample video sources with different qualities
  // In a real app, these would come from your API or CDN
  const videoSources: VideoSource[] = [
    { quality: '1080p', url: videoUrl || defaultVideoUrl },
    { quality: '720p', url: videoUrl || defaultVideoUrl },
    { quality: '480p', url: videoUrl || defaultVideoUrl },
    { quality: '360p', url: videoUrl || defaultVideoUrl },
    { quality: 'auto', url: videoUrl || defaultVideoUrl },
  ];

  // Get current video source URL based on selected quality
  const getCurrentVideoUrl = () => {
    const source = videoSources.find(src => src.quality === currentQuality);
    return source ? source.url : (videoUrl || defaultVideoUrl);
  };

  // Change video quality
  const changeQuality = (quality: VideoQuality) => {
    // Remember the current time
    const currentTimeToRestore = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;
    
    // Update quality
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    
    // Need to update video source with new quality
    if (videoRef.current) {
      // We'll set the currentTime after video is loaded with the new source
      // This happens in the loadedmetadata event handler
      videoRef.current._qualityChangeData = {
        time: currentTimeToRestore,
        playing: wasPlaying
      };
    }
  };
  
  useEffect(() => {
    const hideControlsTimer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3000);

    return () => clearTimeout(hideControlsTimer);
  }, [isLoaded, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showQualityMenu) {
          setShowQualityMenu(false);
        } else if (isFullscreen) {
          exitFullscreen();
        } else {
          navigate(-1);
        }
      } else if (e.key === ' ' || e.key === 'k') {
        togglePlay();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        skipForward();
      } else if (e.key === 'ArrowLeft') {
        skipBackward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isPlaying, isMuted, showQualityMenu]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add a property to store data during quality changes
    if (!video._qualityChangeData) {
      video._qualityChangeData = { time: 0, playing: false };
    }

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };

    const handleTimeUpdate = () => {
      updateProgress();
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
      
      // If this load is due to a quality change, restore position and play state
      if (video._qualityChangeData) {
        video.currentTime = video._qualityChangeData.time;
        
        if (video._qualityChangeData.playing) {
          video.play().catch(err => console.log('Autoplay prevented:', err));
        }
        
        // Clear the data after use
        video._qualityChangeData = { time: 0, playing: false };
      } else if (video.paused) {
        video.play().catch(err => console.log('Autoplay prevented:', err));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log('Play failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPosition * 100);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3000);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    navigate(-1);
  };

  const toggleQualityMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent video click
    setShowQualityMenu(!showQualityMenu);
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={() => {
        setShowQualityMenu(false);
        setShowControls(true);
      }}
    >
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        onClick={goBack}
      >
        <X className="h-7 w-7" />
      </button>

      {/* Video container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={getCurrentVideoUrl()}
          title={title}
          onClick={togglePlay}
          autoPlay
          playsInline
          preload="auto"
        />

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Large center play button - shown when video is paused */}
        {!isPlaying && (
          <button 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
            onClick={togglePlay}
          >
            <div className="bg-white/20 rounded-full w-28 h-28 flex items-center justify-center">
              <Play className="w-16 h-16 text-white fill-white" />
            </div>
          </button>
        )}

        {/* Controls overlay */}
        {showControls && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Progress bar */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-gray-600 cursor-pointer mx-auto"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-red-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute w-4 h-4 bg-red-500 rounded-full -right-2 -top-1 shadow-md"></div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-6">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>
                
                <button
                  onClick={skipBackward}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <RotateCcw className="w-7 h-7" />
                </button>
                
                <button
                  onClick={skipForward}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <RotateCw className="w-7 h-7" />
                </button>
                
                <div className="group relative flex items-center">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
                  </button>
                  <div className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity w-20">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-white"
                    />
                  </div>
                </div>
                
                <div className="text-white text-base font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Subtitles className="w-7 h-7" />
                </button>
                
                <div className="relative">
                  <button 
                    className="text-white hover:text-gray-300 transition-colors"
                    onClick={toggleQualityMenu}
                  >
                    <Settings className="w-7 h-7" />
                  </button>
                  
                  {/* Quality menu */}
                  {showQualityMenu && (
                    <div 
                      className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 border-b border-gray-700">
                        <span className="text-white text-sm font-medium">Quality</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {videoSources.map((source) => (
                          <button
                            key={source.quality}
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                            onClick={() => changeQuality(source.quality)}
                          >
                            <span>{source.quality}</span>
                            {currentQuality === source.quality && (
                              <Check className="w-4 h-4 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Maximize className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add the type definition for the custom property on HTMLVideoElement
declare global {
  interface HTMLVideoElement {
    _qualityChangeData: { time: number; playing: boolean };
  }
}

export default VideoPlayerPage; 