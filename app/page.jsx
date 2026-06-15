"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import TweetCard from "@/components/TweetCard";
import AddTweetForm from "@/components/AddTweetForm";
import { useTweets, CATEGORIES } from "@/context/TweetsContext";

const STATS = [
  { value: "12,400+", label: "Advocates" },
  { value: "340+", label: "Organisations" },
  { value: "89", label: "Countries" },
  { value: "52,000+", label: "Cases Shared" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tweets, loading, addTweet, removeTweet } = useTweets();

  const activeCategory = searchParams.get("category") || null;
  const activeSub = searchParams.get("sub") || null;
  const activeCat = CATEGORIES.find((c) => c.value === activeCategory);

  const filtered = tweets.filter((t) => {
    if (!activeCategory) return true;
    const tweetType = t.postType || "advocacy";
    if (tweetType !== activeCategory) return false;
    if (activeSub && t.subCategory !== activeSub) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      {!session && (
        <>
          <div className="gold-gradient p-8 md:p-12 text-center">
            <span className="inline-block bg-black/10 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              Thematic Human Rights Platform
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3 leading-tight">
              Aggregate. Advocate. Act.
            </h1>
            <p className="text-black/70 text-base mb-6 max-w-xl mx-auto">
              A dedicated platform for NGOs, CSOs, activists, researchers, and
              citizens working on fundamental rights, free from distraction.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/register"
                className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-zinc-900 transition-colors"
              >
                Join the Network
              </Link>
              <Link
                href="/about"
                className="bg-white/30 text-black font-semibold px-8 py-3 rounded-full hover:bg-white/50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-px bg-zinc-900 border-b border-zinc-900">
            {STATS.map((s) => (
              <div key={s.label} className="bg-black p-4 text-center">
                <p className="text-xl font-extrabold text-gold-500">
                  {s.value}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div>
          {activeCategory ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeCat?.icon}</span>
              <div>
                <h1 className="text-white font-bold text-base leading-none">
                  {activeCat?.label}
                </h1>
                {activeSub && (
                  <p className="text-zinc-500 text-xs mt-0.5">› {activeSub}</p>
                )}
              </div>
            </div>
          ) : (
            <h1 className="text-white font-bold text-base">
              {session ? "Advocacy Feed" : "Latest from the Network"}
            </h1>
          )}
        </div>
        {activeCategory && (
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}
      </div>

      {activeCategory && activeCat && (
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-zinc-900">
          <button
            onClick={() => router.push(`/?category=${activeCategory}`)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              !activeSub
                ? "border-gold-500 text-gold-500 bg-gold-500/10"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
            }`}
          >
            All {activeCat.label}
          </button>
          {activeCat.sub.map((s) => (
            <button
              key={s}
              onClick={() =>
                router.push(
                  `/?category=${activeCategory}&sub=${encodeURIComponent(s)}`,
                )
              }
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                activeSub === s
                  ? "border-gold-500 text-gold-500 bg-gold-500/10"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {session && (
        <div className="border-b border-zinc-900 px-4 py-4">
          <AddTweetForm onNewTweet={addTweet} />
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-5 px-4 py-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-5 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-5 px-4 py-5">
          {filtered.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-16 text-center text-zinc-500">
              <p>No posts in this category yet.</p>
              {session && (
                <p className="text-sm mt-1 text-zinc-600">
                  Be the first to post here.
                </p>
              )}
            </div>
          ) : (
            filtered.map((tweet) => (
              <TweetCard
                key={tweet._id || tweet.id}
                tweet={tweet}
                onDelete={removeTweet}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
