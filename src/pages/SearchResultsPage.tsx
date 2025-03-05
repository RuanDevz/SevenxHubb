import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import VideoGrid from '../components/VideoGrid';
import { searchVideos, fetchVideos_old } from '../services/api';
import { Video, DoodStreamResponse } from '../types';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const [newQuery, setNewQuery] = useState('');

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setSearchQuery(query);
        setError(null);
        
        // Try to search using the search API
        const searchResponse = await searchVideos(query);
        
        if (searchResponse && searchResponse.status === 200 && searchResponse.result) {
          // Convert search results to Video format
          const searchResults = Array.isArray(searchResponse.result) 
            ? searchResponse.result.map((item: any) => ({
                file_code: item.file_code,
                title: item.title,
                length: item.length || '0',
                splash_img: item.splash_img || '',
                created: item.created || new Date().toISOString(),
                size: item.size || '0',
                views: item.views || 0
              }))
            : [];
            
          setVideos(searchResults);
        } else {
          // Fallback to fetching all videos and filtering client-side
          const response: DoodStreamResponse = await fetchVideos_old(1, 50);
          
          if (response && response.result === 999 && response.data) {
            const filteredVideos = response.data.filter(video => 
              video.title.toLowerCase().includes(query.toLowerCase())
            );
            setVideos(filteredVideos);
          } else {
            setError('Failed to search videos');
          }
        }
      } catch (err) {
        setError('An error occurred while searching');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(newQuery.trim())}`;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Search Results for "{searchQuery}"
        </h2>
        
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
      
      {error ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link 
            to="/"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <VideoGrid 
          videos={videos} 
          isLoading={isLoading} 
        />
      )}
      
      {!isLoading && videos.length === 0 && !error && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No videos found for "{searchQuery}"</p>
          <p className="text-gray-500 dark:text-gray-500 mb-4">Try different keywords or browse our featured videos</p>
          <Link 
            to="/"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Browse Featured Videos
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;