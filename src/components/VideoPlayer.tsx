import React from 'react';
import { X } from 'lucide-react';
import { Video } from '../types';
import { getVideoEmbedUrl } from '../services/api';

interface VideoPlayerProps {
  video: Video | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
            {video.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >

          </button>
        </div>
        
        <div className="relative aspect-video w-full">
          <iframe
            src={getVideoEmbedUrl(video.file_code)}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title={video.title}
          ></iframe>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{new Date(video.created).toLocaleDateString()}</span>
            <span>{video.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;