"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">
              Check your email
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-1">
              If an account exists for{" "}
              <strong className="text-white">{email}</strong>, you will receive
              a reset link shortly.
            </p>
            <p className="text-zinc-600 text-xs mb-6">
              The link expires in 1 hour. Check your spam folder if you
              don&apos;t see it.
            </p>
            <Link
              href="/login"
              className="gold-gradient text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm inline-block"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-zinc-500 text-sm mt-5">
          Remember your password?{" "}
          <Link href="/login" className="text-gold-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
