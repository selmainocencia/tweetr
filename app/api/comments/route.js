import { NextResponse } from "next/server";

const mockComments = {};

async function tryDb() {
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Comment } = await import("@/models/Comment");
    await makeSureDbIsReady();
    return { Comment, db: true };
  } catch {
    return { db: false };
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tweetId = searchParams.get("tweetId");
  if (!tweetId) {
    return NextResponse.json({ error: "tweetId required" }, { status: 400 });
  }

  const { Comment, db } = await tryDb();
  if (db) {
    try {
      const comments = await Comment.find({ tweetId }).sort({ createdAt: 1 }).lean();
      return NextResponse.json({ comments, source: "database" });
    } catch {
      // fall through
    }
  }

  return NextResponse.json({ comments: mockComments[tweetId] || [], source: "mock" });
}

export async function POST(req) {
  const body = await req.json();
  const { tweetId, author, text } = body;
  if (!tweetId || !text?.trim()) {
    return NextResponse.json({ error: "tweetId and text required" }, { status: 400 });
  }

  const { Comment, db } = await tryDb();
  if (db) {
    try {
      const comment = await Comment.create({ tweetId, author, text: text.trim() });
      return NextResponse.json({ comment, source: "database" }, { status: 201 });
    } catch {
      // fall through
    }
  }

  const comment = {
    id: Date.now().toString(),
    tweetId,
    author: author || "Anonymous",
    text: text.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  if (!mockComments[tweetId]) mockComments[tweetId] = [];
  mockComments[tweetId].push(comment);
  return NextResponse.json({ comment, source: "mock" }, { status: 201 });
}

export async function DELETE(req) {
  const { id, tweetId } = await req.json();

  const { Comment, db } = await tryDb();
  if (db) {
    try {
      await Comment.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    } catch {
      // fall through
    }
  }

  if (tweetId && mockComments[tweetId]) {
    mockComments[tweetId] = mockComments[tweetId].filter((c) => c.id !== id);
  }
  return NextResponse.json({ success: true });
}
