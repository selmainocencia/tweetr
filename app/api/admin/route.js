import { NextResponse } from "next/server";

async function tryDb() {
  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { User } = await import("@/models/User");
    await makeSureDbIsReady();
    return { User, db: true };
  } catch {
    return { db: false };
  }
}

export async function GET() {
  const { User, db } = await tryDb();
  if (!db)
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const {
    name,
    username,
    email,
    password,
    orgName,
    orgType,
    country,
    website,
    bio,
  } = body;
  if (!name || !username || !email || !password) {
    return NextResponse.json(
      { error: "Name, username, email and password are required." },
      { status: 400 },
    );
  }
  const { User, db } = await tryDb();
  if (!db)
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return NextResponse.json(
        { error: "Username or email already exists." },
        { status: 400 },
      );
    const { default: bcrypt } = await import("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      orgName: orgName || "",
      orgType: orgType || "",
      country: country || "",
      website: website || "",
      bio: bio || "",
      role: "org",
      verified: true,
      mustChangePassword: true,
    });
    return NextResponse.json(
      {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const body = await req.json();
  const {
    userId,
    verified,
    role,
    name,
    email,
    orgName,
    orgType,
    country,
    website,
    bio,
  } = body;
  const { User, db } = await tryDb();
  if (!db)
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  try {
    const update = {};
    if (typeof verified === "boolean") update.verified = verified;
    if (role) update.role = role;
    if (name) update.name = name;
    if (email) update.email = email;
    if (orgName !== undefined) update.orgName = orgName;
    if (orgType !== undefined) update.orgType = orgType;
    if (country !== undefined) update.country = country;
    if (website !== undefined) update.website = website;
    if (bio !== undefined) update.bio = bio;
    const user = await User.findByIdAndUpdate(userId, update, { new: true })
      .select("-password")
      .lean();
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { userId } = await req.json();
  const { User, db } = await tryDb();
  if (!db)
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  try {
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
