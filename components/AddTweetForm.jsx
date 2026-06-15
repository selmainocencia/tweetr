"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const MAX_CHARS = 280;

const CATEGORIES = [
  {
    value: "advocacy",
    label: "📢 Advocacy",
    sub: [
      "Campaigns & Mobilisation",
      "Policy & Legal Action",
      "International Mechanisms",
    ],
  },
  {
    value: "case",
    label: "📋 Rights Case",
    sub: [
      "Civil & Political Rights",
      "Economic & Social Rights",
      "Environmental & Cultural Rights",
    ],
  },
  {
    value: "research",
    label: "🔬 Research",
    sub: ["Reports & Analysis", "Field Documentation", "Data & Evidence"],
  },
  {
    value: "resource",
    label: "📁 Resource",
    sub: ["Toolkits & Training", "Legal Frameworks", "Funding & Opportunities"],
  },
  {
    value: "update",
    label: "🔔 Update",
    sub: ["News & Alerts", "Decisions & Rulings", "Events & Announcements"],
  },
];

const PLACEHOLDERS = {
  advocacy: "Share a campaign, call to action, or advocacy message…",
  case: "Describe the rights violation — include location, date, affected parties (anonymise if needed)…",
  research: "Share your findings, cite your sources, link to full reports…",
  resource: "Share a document, toolkit, legal framework, or training material…",
  update: "Share a news alert, court decision, or event announcement…",
};

export default function AddTweetForm({ onNewTweet }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("advocacy");
  const [subCategory, setSubCategory] = useState(CATEGORIES[0].sub[0]);
  const [loading, setLoading] = useState(false);

  const charsLeft = MAX_CHARS - content.length;
  const isOver = charsLeft < 0;

  const currentCat = CATEGORIES.find((c) => c.value === postType);

  function handleCategoryChange(val) {
    setPostType(val);
    const cat = CATEGORIES.find((c) => c.value === val);
    setSubCategory(cat.sub[0]);
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || isOver || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          author: session?.user?.name || "Anonymous",
          handle: `@${session?.user?.username || session?.user?.email?.split("@")[0] || "user"}`,
          userId: session?.user?.id,
          postType,
          subCategory,
        }),
      });
      if (!res.ok) throw new Error("Failed to post");
      const tweet = await res.json();
      onNewTweet?.(tweet);
      setContent("");
      setPostType("advocacy");
      setSubCategory(CATEGORIES[0].sub[0]);
    } catch {
      alert("Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark-card rounded-2xl p-5 mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  postType === cat.value
                    ? "gold-gradient text-black"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-3">
            <label className="block text-zinc-600 text-xs mb-1.5 uppercase tracking-widest font-semibold">
              Subcategory
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentCat.sub.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubCategory(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors border ${
                    subCategory === s
                      ? "border-gold-500 text-gold-500 bg-gold-500/10"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDERS[postType]}
            rows={3}
            className="w-full bg-transparent text-white placeholder-zinc-600 resize-none focus:outline-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
            <span
              className={`text-xs ${isOver ? "text-red-400" : charsLeft < 40 ? "text-yellow-500" : "text-zinc-600"}`}
            >
              {charsLeft} characters remaining
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isOver || loading}
              className="gold-gradient text-black font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
