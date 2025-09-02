"use client";

import { useState, useEffect, useCallback } from 'react';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

interface FavoritesStorage {
  favorites: string[];
  lastUpdated: string;
  version: number;
}

const STORAGE_KEY = 'productAnalyticsTools_favorites';
const STORAGE_VERSION = 1;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount (only in browser)
  useEffect(() => {
    if (!isBrowser) {
      setIsLoading(false);
      return;
    }

    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: FavoritesStorage = JSON.parse(stored);

          // Check version compatibility
          if (data.version === STORAGE_VERSION && Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
          } else {
            // Migration or reset if version mismatch
            setFavorites([]);
            saveFavorites([]);
          }
        }
      } catch (error) {
        console.warn('Failed to load favorites from localStorage:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage (only in browser)
  const saveFavorites = useCallback((newFavorites: string[]) => {
    if (!isBrowser) return;

    try {
      const data: FavoritesStorage = {
        favorites: newFavorites,
        lastUpdated: new Date().toISOString(),
        version: STORAGE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, []);

  // Add a tool to favorites
  const addFavorite = useCallback((toolId: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(toolId)) {
        return prevFavorites; // Already in favorites
      }
      const newFavorites = [...prevFavorites, toolId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // Remove a tool from favorites
  const removeFavorite = useCallback((toolId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(id => id !== toolId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Check if a tool is favorited
  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, [saveFavorites]);

  // Listen for storage changes across tabs (only in browser)
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data: FavoritesStorage = JSON.parse(e.newValue);
          if (data.version === STORAGE_VERSION && Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
          }
        } catch (error) {
          console.warn('Failed to sync favorites from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
} 