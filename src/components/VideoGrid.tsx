import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../types';

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading }) => {
  // Remove duplicate videos based on file_code
  const uniqueVideos = videos.reduce((acc: Video[], current) => {
    const exists = acc.find(video => video.file_code === current.file_code);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (uniqueVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {uniqueVideos.map((video) => (
        <VideoCard 
          key={`${video.file_code}-${video.uploaded || Date.now()}`} 
          video={video} 
        />
      ))}
    </div>
  );
};

export default VideoGrid;