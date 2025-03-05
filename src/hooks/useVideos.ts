import { useState, useEffect } from 'react';
import { Video, DoodStreamResponse } from '../types';
import { fetchVideos_old } from '../services/api';

export const useVideos = (initialPage = 1) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const response: DoodStreamResponse = await fetchVideos_old(page);
        
        if (response && response.result === 999) {
          if (response.data && Array.isArray(response.data)) {
            setVideos(prev => [...prev, ...response.data]);
            // Assuming 20 items per page
            setTotalPages(Math.ceil(response.total_count / 20));
          } else {
            setError('Invalid response format from API');
          }
        } else {
          setError(response?.msg || 'Failed to load videos');
        }
      } catch (err) {
        setError('An error occurred while fetching videos');
        console.error('Error in loadVideos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [page]);

  return {
    videos,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
    setError
  };
};