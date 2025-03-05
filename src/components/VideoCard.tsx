import React, { useState, useRef, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const previewTimeoutRef = useRef<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const formatDuration = (seconds: string) => {
    const duration = parseInt(seconds, 10);
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    if (isHovering && video.canplay === 1) {
      previewTimeoutRef.current = window.setTimeout(() => {
        setIsPreviewLoaded(true);
      }, 500);
    } else {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
      setIsPreviewLoaded(false);
    }

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [isHovering, video.canplay]);

  return (
    <Link 
      to={`/video/${video.file_code}`}
      className="group block relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gray-900"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.single_img || video.splash_img} 
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isPreviewLoaded ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        
        {isPreviewLoaded && video.canplay === 1 && (
          <div className="absolute inset-0 bg-black">
            <iframe 
              src={`https://dood.wf/e/${video.file_code}?autoplay=1&mute=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={video.title}
            ></iframe>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isHovering && !isPreviewLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="rounded-full bg-primary p-3 text-white">
              <Play size={24} />
            </div>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.length)}
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(video.file_code);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite(video.file_code) ? 'bg-primary text-white' : 'bg-black/70 text-white/70'
          } hover:bg-primary hover:text-white transition-colors duration-200`}
        >
          <Heart size={16} fill={isFavorite(video.file_code) ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="text-base font-medium line-clamp-2 text-white group-hover:text-primary transition-colors duration-200">
          {video.title}
        </h3>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>{Number(video.views).toLocaleString()} views</span>
          <span>{formatDate(video.uploaded || video.created || new Date().toISOString())}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;