"use client";

import { createContext, useState, useContext } from "react";

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
  const [commentsByTweet, setCommentsByTweet] = useState({});

  function getComments(tweetId) {
    return commentsByTweet[tweetId] || [];
  }

  function addComment(tweetId, comment) {
    setCommentsByTweet((prev) => ({
      ...prev,
      [tweetId]: [...(prev[tweetId] || []), comment],
    }));
  }

  function deleteComment(tweetId, commentId) {
    setCommentsByTweet((prev) => ({
      ...prev,
      [tweetId]: (prev[tweetId] || []).filter((c) => (c._id || c.id) !== commentId),
    }));
  }

  return (
    <CommentsContext.Provider value={{ getComments, addComment, deleteComment }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
}
