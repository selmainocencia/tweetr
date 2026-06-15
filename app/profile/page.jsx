"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TweetCard from "@/components/TweetCard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    async function fetchMyTweets() {
      try {
        const res = await fetch("/api/tweets");
        const all = await res.json();
        const mine = all.filter(
          (t) =>
            t.author === session.user.name ||
            t.author === session.user.username ||
            t.userId === session.user.id
        );
        setTweets(mine);
      } catch {
        setTweets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMyTweets();
  }, [session]);

  if (status === "loading" || !session) return null;

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="animate-fade-in">
      <div className="dark-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{session.user.name}</h1>
            <p className="text-zinc-500 text-sm">@{session.user.username || session.user.email?.split("@")[0]}</p>
            <p className="text-zinc-400 text-sm mt-1">{tweets.length} tweets</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Your Tweets</h2>

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
          You haven&apos;t posted any tweets yet.
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet._id || tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
