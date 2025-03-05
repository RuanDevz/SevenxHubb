import { useState, useEffect } from 'react';
import { Video } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (fileCode: string) => {
    setFavorites(prev => {
      if (prev.includes(fileCode)) {
        return prev.filter(code => code !== fileCode);
      }
      return [...prev, fileCode];
    });
  };

  const isFavorite = (fileCode: string) => favorites.includes(fileCode);

  return { favorites, toggleFavorite, isFavorite };
};