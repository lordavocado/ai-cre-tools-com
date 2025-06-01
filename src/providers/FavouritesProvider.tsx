"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useFavourites } from '@/hooks/useFavourites';

interface FavouritesContextType {
  favourites: string[];
  isLoading: boolean;
  addFavourite: (toolId: string) => void;
  removeFavourite: (toolId: string) => void;
  toggleFavourite: (toolId: string) => void;
  isFavourite: (toolId: string) => boolean;
  clearFavourites: () => void;
  count: number;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

interface FavouritesProviderProps {
  children: ReactNode;
}

export function FavouritesProvider({ children }: FavouritesProviderProps) {
  const favouritesHook = useFavourites();

  return (
    <FavouritesContext.Provider value={favouritesHook}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavouritesContext() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavouritesContext must be used within a FavouritesProvider');
  }
  return context;
} 