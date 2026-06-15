import { NextResponse } from "next/server";

const mockTweets = [
  { id: "1", author: "John Doe", handle: "@john", content: "Just shipped a new feature! Next.js App Router is genuinely amazing for building full-stack apps. 🚀", likes: 24, comments: 3, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", author: "Jane Smith", handle: "@jane", content: "MongoDB + Mongoose + Next.js = the perfect stack for modern web apps. Who agrees? 💛", likes: 41, comments: 7, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "3", author: "Demo User", handle: "@demo", content: "Tailwind CSS has completely changed how I think about styling. Never going back to plain CSS. 🎨", likes: 18, comments: 2, createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "4", author: "John Doe", handle: "@john", content: "Context API for global state management in React is underrated. Simple, powerful, no extra dependencies.", likes: 33, comments: 5, createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
];

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    await makeSureDbIsReady();
    const tweet = await Tweet.findById(id).lean();
    if (tweet) return NextResponse.json(tweet);
  } catch {
    // fall through
  }

  const tweet = mockTweets.find((t) => t.id === id);
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }
  return NextResponse.json(tweet);
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    await makeSureDbIsReady();
    const tweet = await Tweet.findByIdAndUpdate(id, body, { new: true }).lean();
    if (tweet) return NextResponse.json(tweet);
  } catch {
    // fall through
  }

  return NextResponse.json({ success: true });
}
