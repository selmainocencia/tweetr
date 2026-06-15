"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") {
    router.push("/");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid username or password.");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to Tweetr</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-5">
          No account?{" "}
          <Link href="/register" className="text-gold-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
