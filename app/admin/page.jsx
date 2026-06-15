"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VerifiedBadge from "@/components/VerifiedBadge";

const ORG_TYPES = [
  "NGO / INGO",
  "Civil Society Organisation",
  "Community-Based Organisation",
  "Research Institution / University",
  "Legal Aid Organisation",
  "Media / Press Organisation",
  "Student / Youth Group",
  "Government Body (Observer)",
  "Other",
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [message, setMessage] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    orgName: "",
    orgType: "",
    country: "",
    website: "",
    bio: "",
  });

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({
          type: "success",
          text: `Verified organisation "${data.name}" created. Send credentials to ${data.email}.`,
        });
        setForm({
          name: "",
          username: "",
          email: "",
          password: "",
          orgName: "",
          orgType: "",
          country: "",
          website: "",
          bio: "",
        });
        fetchUsers();
        setTab("users");
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleVerified(userId, current) {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verified: !current }),
      });
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, verified: updated.verified } : u,
        ),
      );
    } catch {
      alert("Failed to update.");
    }
  }

  async function handleSaveEdit() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editingUser._id, ...editForm }),
      });
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...updated } : u)),
      );
      setEditingUser(null);
      setEditForm({});
      setMessage({ type: "success", text: "Account updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId, name) {
    if (!confirm(`Delete account "${name}"? This cannot be undone.`)) return;
    try {
      await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setMessage({ type: "success", text: `Account "${name}" deleted.` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete account." });
    }
  }

  function startEdit(user) {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      orgName: user.orgName || "",
      orgType: user.orgType || "",
      country: user.country || "",
      website: user.website || "",
      bio: user.bio || "",
    });
    setMessage(null);
  }

  if (status === "loading" || !session || !isAdmin) return null;

  const verifiedOrgs = users.filter((u) => u.verified && u.role === "org");
  const regularUsers = users.filter((u) => !u.role || u.role === "user");

  return (
    <div className="animate-fade-in p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Manage verified organisations and platform users
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-xl">
          <svg
            className="w-4 h-4 text-gold-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" />
          </svg>
          <span className="text-gold-500 text-xs font-bold uppercase tracking-widest">
            Admin Access
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length },
          { label: "Verified Orgs", value: verifiedOrgs.length },
          { label: "Individual Users", value: regularUsers.length },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 text-center"
          >
            <p className="text-2xl font-extrabold text-gold-500">{s.value}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
          </div>
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

      <div className="flex gap-2 mb-6">
        {[
          { key: "users", label: "All Users" },
          { key: "create", label: "Register Organisation" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setMessage(null);
              setEditingUser(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === t.key
                ? "gold-gradient text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-white font-bold">User Directory</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              Edit org accounts · Toggle verification · Delete any account
            </p>
          </div>

          {editingUser && (
            <div className="p-6 border-b border-zinc-800 bg-zinc-800/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">
                  Editing: {editingUser.name}
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-zinc-500 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Org Name", key: "orgName" },
                  { label: "Country", key: "country" },
                  { label: "Website", key: "website" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-zinc-400 text-xs mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={editForm[f.key] || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [f.key]: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-zinc-400 text-xs mb-1">
                    Organisation Type
                  </label>
                  <select
                    value={editForm.orgType || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, orgType: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500"
                  >
                    <option value="">Select type</option>
                    {ORG_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 text-xs mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="gold-gradient text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-14 bg-zinc-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 text-sm">
              No users yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold">
                          {u.name}
                        </span>
                        {u.verified && u.role === "org" && <VerifiedBadge />}
                      </div>
                      <p className="text-zinc-500 text-xs truncate">
                        @{u.username} · {u.email}
                      </p>
                      {u.orgName && (
                        <p className="text-zinc-600 text-xs">
                          {u.orgName}
                          {u.country ? ` · ${u.country}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        u.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : u.role === "org"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {u.role}
                    </span>

                    {u.role === "org" && (
                      <>
                        <button
                          onClick={() =>
                            handleToggleVerified(u._id, u.verified)
                          }
                          className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                            u.verified
                              ? "bg-gold-500/10 text-gold-500 hover:bg-zinc-800 hover:text-zinc-400"
                              : "bg-zinc-800 text-zinc-500 hover:bg-gold-500/10 hover:text-gold-500"
                          }`}
                        >
                          {u.verified ? "✓ Verified" : "Verify"}
                        </button>
                        <button
                          onClick={() => startEdit(u)}
                          className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-zinc-800 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "create" && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-white font-bold text-lg mb-1">
            Register a Verified Organisation
          </h2>
          <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
            Creates an account with the gold verified badge immediately. The
            user must change their temporary password on first login.
          </p>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
                Login Credentials
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="amnesty_intl"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="contact@organisation.org"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Temporary Password *
                  </label>
                  <input
                    type="text"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-5">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
                Organisation Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    placeholder="Amnesty International"
                    value={form.orgName}
                    onChange={(e) =>
                      setForm({ ...form, orgName: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Organisation Type
                  </label>
                  <select
                    value={form.orgType}
                    onChange={(e) =>
                      setForm({ ...form, orgType: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-sm"
                  >
                    <option value="">Select type</option>
                    {ORG_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Germany"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://organisation.org"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 text-xs mb-1.5">
                    Short Bio
                  </label>
                  <textarea
                    placeholder="Brief description of the organisation's mandate…"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed">
              This account will be created as{" "}
              <strong className="text-white">Verified Organisation</strong> with
              the gold badge immediately. Remember to send credentials to{" "}
              <strong className="text-white">
                {form.email || "the organisation"}
              </strong>{" "}
              manually.
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {creating ? "Creating…" : "Create Verified Organisation Account"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
