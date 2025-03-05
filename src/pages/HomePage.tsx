import React from 'react';
import VideoGrid from '../components/VideoGrid';
import Pagination from '../components/Pagination';
import { useVideos } from '../hooks/useVideos';
import { Flame } from 'lucide-react';

const HomePage: React.FC = () => {
  const { videos, isLoading, error, page, totalPages, setPage, setError } = useVideos();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Flame size={24} className="text-primary" />
        <h2 className="text-2xl font-bold text-white">Hot Videos</h2>
      </div>
      
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <VideoGrid 
            videos={videos} 
            isLoading={isLoading && videos.length === 0} 
          />
          
          {videos.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;