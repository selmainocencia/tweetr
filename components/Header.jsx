"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const CATEGORIES = [
  {
    value: "advocacy",
    label: "Advocacy",
    icon: "📢",
    color: "text-gold-500",
    sub: [
      "Campaigns & Mobilisation",
      "Policy & Legal Action",
      "International Mechanisms",
    ],
  },
  {
    value: "case",
    label: "Rights Cases",
    icon: "📋",
    color: "text-red-400",
    sub: [
      "Civil & Political Rights",
      "Economic & Social Rights",
      "Environmental & Cultural Rights",
    ],
  },
  {
    value: "research",
    label: "Research",
    icon: "🔬",
    color: "text-blue-400",
    sub: ["Reports & Analysis", "Field Documentation", "Data & Evidence"],
  },
  {
    value: "resource",
    label: "Resources",
    icon: "📁",
    color: "text-green-400",
    sub: ["Toolkits & Training", "Legal Frameworks", "Funding & Opportunities"],
  },
  {
    value: "update",
    label: "Updates",
    icon: "🔔",
    color: "text-purple-400",
    sub: ["News & Alerts", "Decisions & Rulings", "Events & Announcements"],
  },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileCategory, setMobileCategory] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center transition-transform group-hover:scale-110">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-white text-base leading-none">
                Tweetr
              </span>
              <p className="text-zinc-600 text-xs leading-none">
                Rights Platform
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-gold-500 bg-gold-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/profile"
                    ? "text-gold-500 bg-gold-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                My Profile
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <svg
                    className="w-4 h-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors"
                    >
                      Saved Posts
                    </Link>
                    <div className="border-t border-zinc-800" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-black font-semibold px-4 py-1.5 rounded-xl gold-gradient hover:opacity-90 transition-opacity"
                >
                  Join
                </Link>
              </div>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="hidden md:block border-t border-zinc-900"
          ref={dropdownRef}
        >
          <div className="flex items-center gap-1 py-1.5">
            <span className="text-zinc-600 text-xs font-semibold uppercase tracking-widest mr-2 flex-shrink-0">
              Browse:
            </span>
            {CATEGORIES.map((cat) => (
              <div key={cat.value} className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === cat.value ? null : cat.value,
                    )
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeDropdown === cat.value
                      ? "gold-gradient text-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${activeDropdown === cat.value ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {activeDropdown === cat.value && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
                    <div
                      className={`px-4 py-3 border-b border-zinc-800 flex items-center gap-2`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className={`font-bold text-sm ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="py-1.5">
                      {cat.sub.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setActiveDropdown(null);
                            router.push(
                              `/?category=${cat.value}&sub=${encodeURIComponent(sub)}`,
                            );
                          }}
                          className="block w-full text-left px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          router.push(`/?category=${cat.value}`);
                        }}
                        className={`text-xs font-semibold ${cat.color} hover:opacity-80 transition-opacity`}
                      >
                        View all {cat.label} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-black animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-gold-500 bg-gold-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 pb-1">
              <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest px-4 mb-2">
                Browse Categories
              </p>
              {CATEGORIES.map((cat) => (
                <div key={cat.value}>
                  <button
                    onClick={() =>
                      setMobileCategory(
                        mobileCategory === cat.value ? null : cat.value,
                      )
                    }
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <svg
                      className={`w-3 h-3 transition-transform ${mobileCategory === cat.value ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {mobileCategory === cat.value && (
                    <div className="ml-4 mb-1 border-l border-zinc-800 pl-4 space-y-0.5">
                      {cat.sub.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileCategory(null);
                            router.push(
                              `/?category=${cat.value}&sub=${encodeURIComponent(sub)}`,
                            );
                          }}
                          className="block w-full text-left py-2 text-xs text-zinc-500 hover:text-gold-500 transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-zinc-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm text-zinc-400 border border-zinc-700 py-2.5 rounded-xl hover:bg-zinc-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm text-black font-bold gold-gradient py-2.5 rounded-xl"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
