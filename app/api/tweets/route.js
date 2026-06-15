import { NextResponse } from "next/server";

const MOCK = [
  {
    id: "1",
    author: "John Doe",
    handle: "@john",
    content:
      "Just shipped a new feature! Next.js App Router is genuinely amazing. 🚀",
    likes: 24,
    comments: 3,
    retweets: 0,
    postType: "advocacy",
    subCategory: "Campaigns & Mobilisation",
    verified: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    author: "Jane Smith",
    handle: "@jane",
    content:
      "MongoDB + Mongoose + Next.js = the perfect stack for modern web apps. 💛",
    likes: 41,
    comments: 7,
    retweets: 0,
    postType: "research",
    subCategory: "Reports & Analysis",
    verified: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "3",
    author: "Demo User",
    handle: "@demo",
    content:
      "Tailwind CSS has completely changed how I think about styling. 🎨",
    likes: 18,
    comments: 2,
    retweets: 0,
    postType: "update",
    subCategory: "News & Alerts",
    verified: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment");
    return NextResponse.json(MOCK);
  }
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    const { User } = await import("@/models/User");
    await makeSureDbIsReady();
    const tweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      tweets.map(async (tweet) => {
        if (tweet.userId) {
          try {
            const user = await User.findById(tweet.userId)
              .select("verified role")
              .lean();
            return {
              ...tweet,
              verified: !!(user?.verified && user?.role === "org"),
            };
          } catch {
            return { ...tweet, verified: false };
          }
        }
        return { ...tweet, verified: false };
      }),
    );
    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Tweets API DB error:", err.message);
    return NextResponse.json(MOCK);
  }
}

export async function POST(req) {
  const body = await req.json();
  const {
    content,
    author,
    handle,
    userId,
    postType,
    subCategory,
    isRetweet,
    retweetedFrom,
  } = body;
  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    const { User } = await import("@/models/User");
    await makeSureDbIsReady();
    const tweet = await Tweet.create({
      content: content.trim(),
      author: author || "Anonymous",
      handle: handle || "@user",
      likes: 0,
      comments: 0,
      retweets: 0,
      userId,
      postType,
      subCategory,
      isRetweet: isRetweet || false,
      retweetedFrom: retweetedFrom || "",
    });
    let verified = false;
    if (userId) {
      try {
        const user = await User.findById(userId).select("verified role").lean();
        verified = !!(user?.verified && user?.role === "org");
      } catch {}
    }
    return NextResponse.json(
      { ...tweet.toObject(), verified },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST tweet error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    await makeSureDbIsReady();
    await Tweet.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
