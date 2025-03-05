import React from 'react';
import { Heart } from 'lucide-react';
import VideoGrid from '../components/VideoGrid';
import { useFavorites } from '../hooks/useFavorites';
import { useVideos } from '../hooks/useVideos';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { videos, isLoading } = useVideos();
  
  const favoriteVideos = videos.filter(video => favorites.includes(video.file_code));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Heart size={24} className="text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Videos</h2>
      </div>

      {favoriteVideos.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Favorite Videos Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start adding videos to your favorites by clicking the heart icon on any video.
          </p>
        </div>
      ) : (
        <VideoGrid videos={favoriteVideos} isLoading={isLoading} />
      )}
    </div>
  );
};

export default FavoritesPage;