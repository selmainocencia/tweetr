"use client";

import { useState } from "react";

const TRENDING = [
  { tag: "#FreedomOfExpression", count: "2.4k posts" },
  { tag: "#DigitalRights", count: "1.8k posts" },
  { tag: "#RightToEducation", count: "1.2k posts" },
  { tag: "#ClimateJustice", count: "980 posts" },
  { tag: "#WomensRights", count: "763 posts" },
  { tag: "#RefugeeRights", count: "641 posts" },
];

const WHO_FOR = [
  "🏢 NGOs & Civil Society Orgs",
  "🧑‍🎓 Researchers & Academics",
  "✊ Activists & Advocates",
  "👥 Community-Based Orgs",
  "📰 Human Rights Journalists",
  "🏫 Student Rights Groups",
];

export default function RightSidebar() {
  const [search, setSearch] = useState("");

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-4 sticky top-0 h-screen overflow-y-auto scrollbar-hide pt-3 px-4 pb-4">
      <div className="relative">
        <svg
          className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search Tweetr"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500 focus:bg-black transition-colors text-sm"
        />
      </div>

      <div className="dark-card rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-zinc-800">
          <h2 className="text-white font-bold text-lg">Trending Topics</h2>
          <p className="text-zinc-500 text-xs mt-0.5">In human rights</p>
        </div>
        <div className="divide-y divide-zinc-900">
          {TRENDING.map((item, i) => (
            <div
              key={item.tag}
              className="px-4 py-3 hover:bg-zinc-900/50 transition-colors cursor-pointer"
            >
              <p className="text-zinc-500 text-xs mb-0.5">#{i + 1} · Rights</p>
              <p className="text-white font-semibold text-sm">{item.tag}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dark-card rounded-2xl p-4">
        <h2 className="text-white font-bold text-lg mb-3">Who Uses Tweetr</h2>
        <div className="space-y-2">
          {WHO_FOR.map((item) => (
            <p key={item} className="text-zinc-400 text-sm">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="dark-card rounded-2xl p-4 border-l-2 border-gold-500">
        <p className="text-zinc-400 text-xs leading-relaxed italic">
          &ldquo;All human beings are born free and equal in dignity and
          rights.&rdquo;
        </p>
        <p className="text-zinc-600 text-xs mt-2">— UDHR, Article 1 (1948)</p>
      </div>

      <p className="text-zinc-700 text-xs px-1 leading-relaxed">
        Tweetr · All rights reserved · Contexto · © {new Date().getFullYear()}
      </p>
    </aside>
  );
}
