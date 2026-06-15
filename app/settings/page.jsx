"use client";

import { useState, useEffect } from "react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("password");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    website: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mustChange, setMustChange] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.mustChangePassword) {
      setMustChange(true);
      setTab("password");
    }
  }, [session]);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({
          type: "success",
          text: "Password updated successfully. You can now use the platform.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setMustChange(false);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          bio: profileForm.bio,
          website: profileForm.website,
          country: profileForm.country,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || !session) return null;

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {mustChange && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-gold-500 font-bold text-sm">
              Action Required — Change Your Password
            </p>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Your account was registered by the Tweetr team. You must change
              your temporary password before accessing the platform.
            </p>
          </div>
        </div>
      )}

      <div className="dark-card rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-white">
              {session.user.name}
            </h1>
            {session.user.verified && session.user.role === "org" && (
              <VerifiedBadge />
            )}
          </div>
          <p className="text-zinc-500 text-sm">@{session.user.username}</p>
          {session.user.role === "org" && (
            <span className="inline-block mt-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg font-medium">
              Organisation Account
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["password", "profile"].map((t) => (
          <button
            key={t}
            onClick={() => {
              if (!mustChange || t === "password") {
                setTab(t);
                setMessage(null);
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === t
                ? "gold-gradient text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            } ${mustChange && t !== "password" ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            {t === "password" ? "Change Password" : "Edit Profile"}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 mb-5 text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {tab === "password" && (
        <div className="dark-card rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">
            {mustChange ? "Set Your New Password" : "Change Password"}
          </h2>
          <p className="text-zinc-500 text-xs mb-6">
            Minimum 6 characters. Choose a strong password you have not used
            before.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                {mustChange ? "Temporary Password" : "Current Password"}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {tab === "profile" && !mustChange && (
        <div className="dark-card rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">Edit Profile</h2>
          <p className="text-zinc-500 text-xs mb-6">
            Update your public profile information.
          </p>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                placeholder="Brief description of your work or organisation's mandate…"
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                rows={3}
                maxLength={280}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm resize-none"
              />
              <p className="text-zinc-700 text-xs mt-1">
                {280 - profileForm.bio.length} characters remaining
              </p>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Website
              </label>
              <input
                type="url"
                placeholder="https://your-organisation.org"
                value={profileForm.website}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, website: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Country
              </label>
              <input
                type="text"
                placeholder="Germany"
                value={profileForm.country}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, country: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
