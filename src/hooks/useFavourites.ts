"use client";

import { useState, useEffect, useCallback } from 'react';

interface FavouritesStorage {
  favourites: string[];
  lastUpdated: string;
  version: number;
}

const STORAGE_KEY = 'productAnalyticsTools_favourites';
const STORAGE_VERSION = 1;

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favourites from localStorage on mount
  useEffect(() => {
    const loadFavourites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: FavouritesStorage = JSON.parse(stored);
          
          // Check version compatibility
          if (data.version === STORAGE_VERSION && Array.isArray(data.favourites)) {
            setFavourites(data.favourites);
          } else {
            // Migration or reset if version mismatch
            setFavourites([]);
            saveFavourites([]);
          }
        }
      } catch (error) {
        console.warn('Failed to load favourites from localStorage:', error);
        setFavourites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavourites();
  }, []);

  // Save favourites to localStorage
  const saveFavourites = useCallback((newFavourites: string[]) => {
    try {
      const data: FavouritesStorage = {
        favourites: newFavourites,
        lastUpdated: new Date().toISOString(),
        version: STORAGE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save favourites to localStorage:', error);
    }
  }, []);

  // Add a tool to favourites
  const addFavourite = useCallback((toolId: string) => {
    setFavourites(prevFavourites => {
      if (prevFavourites.includes(toolId)) {
        return prevFavourites; // Already in favourites
      }
      const newFavourites = [...prevFavourites, toolId];
      saveFavourites(newFavourites);
      return newFavourites;
    });
  }, [saveFavourites]);

  // Remove a tool from favourites
  const removeFavourite = useCallback((toolId: string) => {
    setFavourites(prevFavourites => {
      const newFavourites = prevFavourites.filter(id => id !== toolId);
      saveFavourites(newFavourites);
      return newFavourites;
    });
  }, [saveFavourites]);

  // Toggle favourite status
  const toggleFavourite = useCallback((toolId: string) => {
    if (favourites.includes(toolId)) {
      removeFavourite(toolId);
    } else {
      addFavourite(toolId);
    }
  }, [favourites, addFavourite, removeFavourite]);

  // Check if a tool is favourited
  const isFavourite = useCallback((toolId: string) => {
    return favourites.includes(toolId);
  }, [favourites]);

  // Clear all favourites
  const clearFavourites = useCallback(() => {
    setFavourites([]);
    saveFavourites([]);
  }, [saveFavourites]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data: FavouritesStorage = JSON.parse(e.newValue);
          if (data.version === STORAGE_VERSION && Array.isArray(data.favourites)) {
            setFavourites(data.favourites);
          }
        } catch (error) {
          console.warn('Failed to sync favourites from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    favourites,
    isLoading,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    isFavourite,
    clearFavourites,
    count: favourites.length,
  };
} 