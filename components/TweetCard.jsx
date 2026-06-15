"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useFavorites } from "@/context/FavoritesContext";
import VerifiedBadge from "@/components/VerifiedBadge";

const CATEGORY_STYLES = {
  advocacy: {
    label: "Advocacy",
    icon: "📢",
    badge: "bg-gold-500/10 text-gold-500 border-gold-500/20",
  },
  case: {
    label: "Rights Case",
    icon: "📋",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  research: {
    label: "Research",
    icon: "🔬",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  resource: {
    label: "Resource",
    icon: "📁",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  update: {
    label: "Update",
    icon: "🔔",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function TweetCard({ tweet, onDelete, showFull = false }) {
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [liked, setLiked] = useState(false);
  const [retweets, setRetweets] = useState(tweet.retweets || 0);
  const [retweeted, setRetweeted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = tweet._id || tweet.id;
  const favorited = isFavorite(id);
  const catStyle = CATEGORY_STYLES[tweet.postType] || CATEGORY_STYLES.advocacy;

  const initials = tweet.author
    ? tweet.author
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  async function handleLike() {
    if (!session) return;
    const newLikes = liked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setLiked(!liked);
    try {
      await fetch(`/api/tweets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newLikes }),
      });
    } catch {
      setLikes(likes);
      setLiked(liked);
    }
  }

  async function handleRetweet() {
    if (!session || retweeted) return;
    setRetweets((r) => r + 1);
    setRetweeted(true);
    try {
      await fetch("/api/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: tweet.content,
          author: session.user.name,
          handle: `@${session.user.username || session.user.email?.split("@")[0] || "user"}`,
          userId: session.user.id,
          isRetweet: true,
          retweetedFrom: tweet.author,
          postType: tweet.postType,
          subCategory: tweet.subCategory,
        }),
      });
    } catch {
      setRetweets((r) => r - 1);
      setRetweeted(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await fetch("/api/tweets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      onDelete?.(id);
    } catch {
      setDeleting(false);
    }
  }

  const isOwner =
    session &&
    (session.user.name === tweet.author || session.user.id === tweet.userId);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-5 hover:border-zinc-500 transition-all animate-fade-in">
      {tweet.isRetweet && (
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-3 ml-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
          </svg>
          <span>
            {tweet.author} reshared from {tweet.retweetedFrom}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm">
                  {tweet.author}
                </span>
                {tweet.verified && <VerifiedBadge />}
                <span className="text-zinc-500 text-xs hidden sm:block">
                  {tweet.handle}
                </span>
                {tweet.createdAt && (
                  <span className="text-zinc-500 text-xs">
                    · {timeAgo(tweet.createdAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${catStyle.badge}`}
                >
                  <span>{catStyle.icon}</span>
                  <span>{catStyle.label}</span>
                </span>
                {tweet.subCategory && (
                  <span className="text-zinc-500 text-xs">
                    › {tweet.subCategory}
                  </span>
                )}
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                aria-label="Delete post"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>

          <p
            className={`text-white leading-relaxed ${showFull ? "text-base" : "text-sm line-clamp-4"}`}
          >
            {tweet.content}
          </p>

          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-zinc-800">
            <Link
              href={`/tweet/${id}`}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-gold-500 transition-colors text-xs"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{tweet.comments || 0}</span>
            </Link>

            <button
              onClick={handleRetweet}
              disabled={!session || retweeted}
              className={`flex items-center gap-1.5 transition-colors text-xs ${
                retweeted
                  ? "text-green-500"
                  : "text-zinc-500 hover:text-green-400"
              } disabled:opacity-40`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
              </svg>
              <span>{retweets}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors text-xs ${
                liked ? "text-red-500" : "text-zinc-500 hover:text-red-400"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likes}</span>
            </button>

            <button
              onClick={() => toggleFavorite(id)}
              className={`flex items-center gap-1.5 transition-colors text-xs ${
                favorited
                  ? "text-gold-500"
                  : "text-zinc-500 hover:text-gold-500"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={favorited ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
