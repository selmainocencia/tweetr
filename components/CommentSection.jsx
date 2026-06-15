"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useComments } from "@/context/CommentsContext";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function CommentSection({ tweetId }) {
  const { data: session } = useSession();
  const { getComments, addComment } = useComments();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [tweetId]);

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments?tweetId=${tweetId}`);
      const data = await res.json();
      if (data.source === "database") {
        setComments(data.comments);
      } else {
        setComments(getComments(tweetId));
      }
    } catch {
      setComments(getComments(tweetId));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || !session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId, author: session.user.name, text: text.trim() }),
      });
      const data = await res.json();
      if (data.source === "database") {
        await loadComments();
      } else {
        addComment(tweetId, data.comment);
        setComments((prev) => [...prev, data.comment]);
      }
      setText("");
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="dark-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold">Comments <span className="text-zinc-500 font-normal text-sm ml-1">{comments.length}</span></h3>
      </div>

      {session ? (
        <div className="px-5 py-4 border-b border-zinc-800">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment…"
                rows={2}
                className="w-full bg-transparent text-white placeholder-zinc-600 resize-none focus:outline-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim() || loading}
                  className="gold-gradient text-black text-xs font-bold px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {loading ? "Posting…" : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-4 border-b border-zinc-800 text-zinc-500 text-sm">
          <a href="/login" className="text-gold-500 hover:underline">Sign in</a> to comment.
        </div>
      )}

      <div className="divide-y divide-zinc-900">
        {comments.length === 0 && (
          <p className="px-5 py-6 text-zinc-600 text-sm text-center">No comments yet. Start the conversation!</p>
        )}
        {comments.map((c) => {
          const cId = c._id || c.id;
          const cInitials = c.author
            ? c.author.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "U";
          return (
            <div key={cId} className="px-5 py-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs flex-shrink-0">
                {cInitials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">{c.author}</span>
                  <span className="text-zinc-600 text-xs">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-zinc-300 text-sm">{c.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
