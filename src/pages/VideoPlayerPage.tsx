import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Download, Eye, ChevronLeft } from 'lucide-react';
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
        const response: DoodStreamResponse = await fetchVideos_old(1, 15);
        
        if (response && response.result === 999 && response.data) {
          // Filter out the current video if it's in the results
          const filtered = response.data.filter(v => v.file_code !== fileCode);
          setRelatedVideos(filtered.slice(0, 15)); // Show 15 related videos
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
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Ad Space */}
        <div className="lg:w-1/6 bg-gray-800 rounded-lg p-4 h-[600px] flex items-center justify-center">
          <span className="text-gray-400">Ad Space</span>
        </div>

        {/* Main Content */}
        <div className="lg:w-1/2">
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
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{formatDate(video.uploaded || video.created || new Date().toISOString())}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>{formatDuration(video.length)}</span>
                </div>
                
                <div className="flex items-center">
                  <Eye size={18} className="mr-2" />
                  <span>{video.views?.toLocaleString() || '0'} views</span>
                </div>

                <a
                  href={video.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:text-red-700 transition-colors"
                >
                  <Download size={18} className="mr-2" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Related Videos */}
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Related Videos
          </h2>
          
          {isLoadingRelated ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : relatedVideos.length > 0 ? (
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <Link 
                  key={video.file_code}
                  to={`/video/${video.file_code}`}
                  className="flex gap-4 group hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <div className="w-40 aspect-video relative rounded-lg overflow-hidden">
                    <img 
                      src={video.splash_img || video.single_img} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {formatDuration(video.length)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="mt-1 text-xs text-gray-400">
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
    </div>
  );
};

export default VideoPlayerPage;