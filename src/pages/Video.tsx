import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface VideoProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const Video: React.FC<VideoProps> = ({
  src,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  className = "",
  width = "100%",
  height = "100vh"
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !isMobile) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, [isPlaying, isMobile]);

  const handleBack = () => {
    navigate("/");
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        onClick={isMobile ? togglePlay : undefined}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent p-2 sm:p-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              variant="secondary"
              size={isMobile ? "sm" : "default"}
              onClick={handleBack}
              className="flex items-center space-x-1 sm:space-x-2 bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2">
              <img src="/logo.png" alt="AgriCure Logo" className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="text-sm sm:text-lg font-bold text-grass-800">AgriCure</span>
            </div>
          </div>
        </div>

        {/* Center Play Button (Mobile) */}
        {isMobile && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 border-2 border-white/50"
              size="lg"
            >
              <Play className="h-8 w-8 text-white fill-white" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
            {/* Progress Bar */}
            <div className="mb-2 sm:mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 sm:h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Play/Pause */}
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-white hover:bg-white/20 p-1 sm:p-2"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {/* Mute/Unmute */}
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-white hover:bg-white/20 p-1 sm:p-2"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {/* Time Display */}
                <div className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                {/* Fullscreen Toggle (Desktop only) */}
                {!isMobile && (
                  <Button
                    onClick={toggleFullscreen}
                    variant="ghost"
                    size="default"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Tap Zones */}
      {isMobile && (
        <>
          {/* Left tap zone - seek backward */}
          <div 
            className="absolute left-0 top-1/4 bottom-1/4 w-1/3 z-40"
            onDoubleClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime = Math.max(0, video.currentTime - 10);
              }
            }}
          />
          
          {/* Right tap zone - seek forward */}
          <div 
            className="absolute right-0 top-1/4 bottom-1/4 w-1/3 z-40"
            onDoubleClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
              }
            }}
          />
        </>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        @media (max-width: 640px) {
          .slider::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Video;