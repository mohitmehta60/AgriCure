import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Back Button Overlay */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBack}
          className="flex items-center space-x-2 bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      {/* Logo Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <img src="/logo.png" alt="AgriCure Logo" className="h-6 w-6" />
          <span className="text-lg font-bold text-grass-800">AgriCure</span>
        </div>
      </div>

      <video
        className="h-[100vh] w-full object-cover"
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        width={width}
        height={height}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;