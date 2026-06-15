"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TweetCard from "@/components/TweetCard";
import CommentSection from "@/components/CommentSection";

export default function TweetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTweet() {
      try {
        const res = await fetch(`/api/tweets/${id}`);
        if (!res.ok) throw new Error("Tweet not found");
        const data = await res.json();
        setTweet(data);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchTweet();
  }, [id, router]);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="dark-card rounded-2xl p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-4 bg-zinc-800 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tweet) return null;

  return (
    <div className="animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold-500 mb-5 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to feed
      </Link>

      <TweetCard tweet={tweet} showFull />

      <div className="mt-4">
        <CommentSection tweetId={tweet._id || tweet.id} />
      </div>
    </div>
  );
}
