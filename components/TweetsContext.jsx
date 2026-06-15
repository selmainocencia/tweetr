"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const TweetsContext = createContext();

const CATEGORIES = [
  { value: "advocacy", label: "Advocacy", icon: "📢" },
  { value: "case", label: "Rights Cases", icon: "📋" },
  { value: "research", label: "Research", icon: "🔬" },
  { value: "resource", label: "Resources", icon: "📁" },
  { value: "update", label: "Updates", icon: "🔔" },
];

export function TweetsProvider({ children }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = useCallback(async () => {
    try {
      const res = await fetch("/api/tweets");
      const data = await res.json();
      setTweets(Array.isArray(data) ? data : []);
    } catch {
      setTweets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  function addTweet(tweet) {
    setTweets((prev) => [tweet, ...prev]);
  }

  function removeTweet(id) {
    setTweets((prev) => prev.filter((t) => (t._id || t.id) !== id));
  }

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = tweets.filter((t) => t.postType === cat.value).length;
    return acc;
  }, {});
  counts.all = tweets.length;

  return (
    <TweetsContext.Provider
      value={{ tweets, loading, addTweet, removeTweet, counts, fetchTweets }}
    >
      {children}
    </TweetsContext.Provider>
  );
}

export function useTweets() {
  const ctx = useContext(TweetsContext);
  if (!ctx) throw new Error("useTweets must be used within TweetsProvider");
  return ctx;
}

export { CATEGORIES };
