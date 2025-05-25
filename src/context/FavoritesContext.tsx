'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment } from '@/types/equipment';
import { equipment } from '@/data/equipment';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (equipmentId: string) => void;
  removeFavorite: (equipmentId: string) => void;
  isFavorite: (equipmentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (equipmentId: string) => {
    setFavorites(prev => [...prev, equipmentId]);
  };

  const removeFavorite = (equipmentId: string) => {
    setFavorites(prev => prev.filter(id => id !== equipmentId));
  };

  const isFavorite = (equipmentId: string) => {
    return favorites.includes(equipmentId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 