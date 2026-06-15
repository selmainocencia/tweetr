"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import TweetCard from "@/components/TweetCard";

export default function FavoritesPage() {
  const { favoriteTweetIds } = useFavorites();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favoriteTweetIds.length === 0) {
        setTweets([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/tweets");
        const all = await res.json();
        const favs = all.filter((t) =>
          favoriteTweetIds.includes(t._id || t.id)
        );
        setTweets(favs);
      } catch {
        setTweets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [favoriteTweetIds]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Favorites</h1>
        <p className="text-zinc-500 text-sm">Tweets you&apos;ve saved</p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="dark-card rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tweets.length === 0 && (
        <div className="dark-card rounded-2xl p-10 text-center text-zinc-500">
          <svg className="w-10 h-10 mx-auto mb-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p>No favorites yet.</p>
          <p className="text-sm mt-1">Bookmark tweets to see them here.</p>
        </div>
      )}

      {!loading && tweets.length > 0 && (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet._id || tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}
