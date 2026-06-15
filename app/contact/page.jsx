"use client";

import { useState } from "react";

const TOPICS = [
  "General Enquiry",
  "Press & Media",
  "Partnership Proposal",
  "Platform Abuse / Safety",
  "Technical Support",
];

const contacts = [
  {
    icon: "📬",
    title: "General Enquiries",
    desc: "Platform information, onboarding and general support for new users and organisations.",
  },
  {
    icon: "⚖️",
    title: "Rights & Policy",
    desc: "Community standards, content policy, rights frameworks and moderation questions.",
  },
  {
    icon: "🔬",
    title: "Research & Data",
    desc: "Academic collaboration, data access requests, citation support and research partnerships.",
  },
  {
    icon: "🛡️",
    title: "Safety & Trust",
    desc: "Abuse reports, source protection, urgent safety concerns and threat assessments.",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    desc: "Organisation verification, institutional partnerships, coalition building and integration requests.",
  },
  {
    icon: "📰",
    title: "Press & Media",
    desc: "Media enquiries, press kits, interview requests and editorial collaboration.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    email: "",
    topic: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formsubmit.co/info@selmainocencia.de", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          organisation: form.organisation,
          email: form.email,
          topic: form.topic,
          message: form.message,
        }),
      });
    } catch {
      // show success regardless
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in p-6">
      <div className="text-center mb-8">
        <span className="inline-block bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
          Get In Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Contact Tweetr
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          We are here for organisations seeking verification, researchers
          requesting collaboration, advocates needing support, and anyone who
          believes in the power of connected, purposeful rights work.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold text-lg mb-2">
          Our Contact Channels
        </h2>
        <div className="w-10 h-1 bg-gold-500 rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div
              key={c.title}
              className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700"
            >
              <span className="text-xl block mb-2">{c.icon}</span>
              <h3 className="text-white font-semibold text-sm mb-1">
                {c.title}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-8">
        {sent ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-black"
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
            <h2 className="text-white font-bold text-xl mb-2">
              Message Received
            </h2>
            <p className="text-zinc-400 text-sm mb-1">
              Thank you for reaching out to Tweetr.
            </p>
            <p className="text-zinc-500 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
              Our team reviews all messages and responds within 2 working days.
              Safety and urgent advocacy concerns are always prioritised.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setForm({
                  name: "",
                  organisation: "",
                  email: "",
                  topic: "",
                  message: "",
                });
              }}
              className="gold-gradient text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-white font-bold text-lg mb-1">
              Send a Message
            </h2>
            <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
              Use this form for general enquiries, partnership proposals, press
              requests and support.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    Organisation
                  </label>
                  <input
                    type="text"
                    placeholder="NGO, CSO, University, etc."
                    value={form.organisation}
                    onChange={(e) =>
                      setForm({ ...form, organisation: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your@organisation.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Topic *
                </label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  required
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-sm"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  placeholder="Please describe your enquiry in detail…"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
