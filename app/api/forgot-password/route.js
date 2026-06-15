import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    const { makeSureDbIsReady } = await import("@/lib/db");
    const { User } = await import("@/models/User");
    await makeSureDbIsReady();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: user.email,
        subject: "Reset your Tweetr password",
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; background: #0d0d00; padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #e6a80b, #f6ca4a); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: black; font-weight: bold; font-size: 20px;">T</span>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0;">Reset Your Password</h1>
              <p style="color: #71717a; font-size: 14px; margin-top: 8px;">Tweetr — Rights Platform</p>
            </div>

            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Hi ${user.name},</p>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new password.
              This link expires in <strong style="color: #e6a80b;">1 hour</strong>.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                style="background: linear-gradient(135deg, #e6a80b, #f6ca4a); color: #000000; font-weight: 700;
                       padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #52525b; font-size: 13px; line-height: 1.6;">
              If you did not request a password reset, you can safely ignore this email.
              Your password will not be changed.
            </p>

            <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />

            <p style="color: #3f3f46; font-size: 12px; text-align: center;">
              Tweetr · Rights Platform · All rights reserved · Contexto ${new Date().getFullYear()}
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
