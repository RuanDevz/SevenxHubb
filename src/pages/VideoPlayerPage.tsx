import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, HardDrive, Eye, ChevronLeft } from 'lucide-react';
import { getVideoEmbedUrl, getVideoInfo, fetchVideos_old } from '../services/api';
import { Video, DoodStreamResponse } from '../types';

const VideoPlayerPage: React.FC = () => {
  const { fileCode } = useParams<{ fileCode: string }>();
  const [video, setVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  useEffect(() => {
    const loadVideoDetails = async () => {
      if (!fileCode) return;
      
      try {
        setIsLoading(true);
        const videoInfo = await getVideoInfo(fileCode);
        
        if (videoInfo && videoInfo.status === 200 && videoInfo.result) {
          setVideo(videoInfo.result);
        } else {
          // Try to find the video in the related videos if API call fails
          const response: DoodStreamResponse = await fetchVideos_old(1, 20);
          if (response && response.result === 999 && response.data) {
            const foundVideo = response.data.find(v => v.file_code === fileCode);
            if (foundVideo) {
              setVideo(foundVideo);
            } else {
              setError('Video not found');
            }
          } else {
            setError('Failed to load video details');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching video details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const loadRelatedVideos = async () => {
      try {
        setIsLoadingRelated(true);
        const response: DoodStreamResponse = await fetchVideos_old(1, 8);
        
        if (response && response.result === 999 && response.data) {
          // Filter out the current video if it's in the results
          const filtered = response.data.filter(v => v.file_code !== fileCode);
          setRelatedVideos(filtered.slice(0, 6)); // Limit to 6 related videos
        }
      } catch (err) {
        console.error('Error loading related videos:', err);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    loadVideoDetails();
    loadRelatedVideos();
  }, [fileCode]);

  const formatDuration = (seconds: string) => {
    const duration = parseInt(seconds, 10);
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (sizeInBytes: string) => {
    const size = parseInt(sizeInBytes, 10);
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error || 'Video not found'}</p>
        <Link 
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600 mb-4">
        <ChevronLeft size={20} />
        <span>Back to Home</span>
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="aspect-video w-full">
          <iframe
            src={getVideoEmbedUrl(video.file_code)}
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title={video.title}
          ></iframe>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {video.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400"> 
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(video.uploaded)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock size={18} className="mr-2" />
              <span>{formatDuration(video.length)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Eye size={18} className="mr-2" />
              <span>{video.views?.toLocaleString() || '0'} views</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Related Videos
        </h2>
        
        {isLoadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="mt-2 h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : relatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedVideos.map((video) => (
              <Link 
                key={video.file_code}
                to={`/video/${video.file_code}`}
                className="block overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.splash_img || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop'} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.length)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1 text-gray-900 dark:text-white">
                    {video.title}
                  </h3>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {video.views.toLocaleString()} views
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No related videos found</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;