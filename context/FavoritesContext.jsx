"use client";

import { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoriteTweetIds, setFavoriteTweetIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favoriteTweets");
      if (stored) setFavoriteTweetIds(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("favoriteTweets", JSON.stringify(favoriteTweetIds));
    } catch {
      // ignore
    }
  }, [favoriteTweetIds]);

  function toggleFavorite(id) {
    setFavoriteTweetIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function isFavorite(id) {
    return favoriteTweetIds.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{ favoriteTweetIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
