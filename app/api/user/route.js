import { NextResponse } from "next/server";

export async function PATCH(req) {
  const body = await req.json();
  const { userId, currentPassword, newPassword, bio, website, country } = body;

  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { User } = await import("@/models/User");
    const { default: bcrypt } = await import("bcryptjs");
    await makeSureDbIsReady();

    const user = await User.findById(userId).catch(() => null);
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Account not found in database. Please use a registered account.",
        },
        { status: 400 },
      );
    }

    if (newPassword) {
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid)
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 },
        );
      if (newPassword.length < 6)
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 },
        );
      user.password = await bcrypt.hash(newPassword, 10);
      user.mustChangePassword = false;
    }

    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (country !== undefined) user.country = country;

    await user.save();
    return NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
