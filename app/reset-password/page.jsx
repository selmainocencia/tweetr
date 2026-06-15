"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) router.push("/forgot-password");
  }, [token, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Choose a strong password you haven&apos;t used before.
          </p>
        </div>

        {success ? (
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
              Password Updated!
            </h2>
            <p className="text-zinc-400 text-sm mb-1">
              Your password has been changed successfully.
            </p>
            <p className="text-zinc-600 text-xs">Redirecting you to sign in…</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-zinc-500 text-sm mt-5">
          <Link href="/login" className="text-gold-500 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
