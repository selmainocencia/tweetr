import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { name, username, email, password } = body;

  if (!name || !username || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { User } = await import("@/models/User");
    const { default: bcrypt } = await import("bcryptjs");
    await makeSureDbIsReady();

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return NextResponse.json({ error: "Username or email already taken." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, password: hashed });
    return NextResponse.json({ id: user._id, name, username, email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed. Try again." }, { status: 500 });
  }
}
