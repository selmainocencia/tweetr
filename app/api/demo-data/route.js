import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { Tweet } = await import("@/models/Tweet");
    const { User } = await import("@/models/User");
    const { default: bcrypt } = await import("bcryptjs");
    await makeSureDbIsReady();

    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      const hash = async (p) => bcrypt.hash(p, 10);
      await User.insertMany([
        { name: "John Doe", username: "john", email: "john@example.com", password: await hash("password123") },
        { name: "Jane Smith", username: "jane", email: "jane@example.com", password: await hash("password123") },
        { name: "Demo User", username: "demo", email: "demo@example.com", password: await hash("demo") },
      ]);
    }

    const existingTweets = await Tweet.countDocuments();
    if (existingTweets === 0) {
      await Tweet.insertMany([
        { author: "John Doe", handle: "@john", content: "Just shipped a new feature! Next.js App Router is genuinely amazing. 🚀", likes: 24, comments: 3 },
        { author: "Jane Smith", handle: "@jane", content: "MongoDB + Mongoose + Next.js = the perfect stack 💛", likes: 41, comments: 7 },
        { author: "Demo User", handle: "@demo", content: "Tailwind CSS changed how I think about styling 🎨", likes: 18, comments: 2 },
      ]);
    }

    return NextResponse.json({ message: "Demo data seeded successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
