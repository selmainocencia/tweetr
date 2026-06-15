"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTweets, CATEGORIES } from "@/context/TweetsContext";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function LeftSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { counts } = useTweets();
  const [openCategory, setOpenCategory] = useState(null);

  const activeCategory = searchParams.get("category");
  const activeSub = searchParams.get("sub");

  const navLinks = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/favorites",
      label: "Saved",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
    },
    {
      href: "/about",
      label: "About",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      href: "/contact",
      label: "Contact",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  if (session) {
    navLinks.push({
      href: "/profile",
      label: "Profile",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    });
    navLinks.push({
      href: "/settings",
      label: "Settings",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    });
  }

  function isHomeActive() {
    return pathname === "/" && !activeCategory;
  }

  return (
    <aside className="w-16 xl:w-72 flex-shrink-0 sticky top-0 h-screen flex flex-col pt-1 pb-3 overflow-y-auto scrollbar-hide">
      <Link
        href="/"
        className="flex items-center justify-center xl:justify-start gap-3 p-3 xl:px-5 mb-1 rounded-full hover:bg-zinc-900 transition-colors w-fit mx-auto xl:mx-0"
      >
        <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </div>
        <div className="hidden xl:block">
          <p className="font-extrabold text-white text-xl leading-none">
            Tweetr
          </p>
          <p className="text-zinc-600 text-xs mt-0.5">Rights Platform</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-0.5 px-1 xl:px-3">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/" ? isHomeActive() : pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-5 p-3 xl:px-4 rounded-full transition-colors w-fit xl:w-full mx-auto xl:mx-0 ${
                isActive
                  ? "text-white font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              <span className="hidden xl:block text-xl">{link.label}</span>
            </Link>
          );
        })}

        {session?.user?.role === "admin" && (
          <Link
            href="/admin"
            className={`flex items-center gap-5 p-3 xl:px-4 rounded-full transition-colors w-fit xl:w-full mx-auto xl:mx-0 ${
              pathname === "/admin"
                ? "text-gold-500 font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <svg
              className="w-7 h-7 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" />
            </svg>
            <span className="hidden xl:block text-xl">Admin</span>
          </Link>
        )}
      </nav>

      <div className="hidden xl:block mt-3 px-3">
        <div className="border-t border-zinc-900 pt-4">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-2 px-1">
            Browse Categories
          </p>
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <div key={cat.value}>
                  <button
                    onClick={() => {
                      setOpenCategory(
                        openCategory === cat.value ? null : cat.value,
                      );
                      router.push(`/?category=${cat.value}`);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? "text-gold-500 bg-gold-500/10 font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs font-bold tabular-nums min-w-4 text-right ${isActive ? "text-gold-500" : "text-zinc-600"}`}
                      >
                        {counts[cat.value] ?? 0}
                      </span>
                      <svg
                        className={`w-3 h-3 transition-transform ${openCategory === cat.value ? "rotate-180" : ""}`}
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
                    </div>
                  </button>

                  {openCategory === cat.value && (
                    <div className="ml-4 pl-3 border-l border-zinc-800 py-1 space-y-0.5">
                      {cat.sub.map((s) => {
                        const isSubActive =
                          activeSub === s && activeCategory === cat.value;
                        return (
                          <button
                            key={s}
                            onClick={() =>
                              router.push(
                                `/?category=${cat.value}&sub=${encodeURIComponent(s)}`,
                              )
                            }
                            className={`block w-full text-left py-1.5 text-xs transition-colors ${
                              isSubActive
                                ? "text-gold-500 font-semibold"
                                : "text-zinc-500 hover:text-gold-500"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => router.push("/")}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
                !activeCategory
                  ? "text-gold-500 bg-gold-500/10 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>🌐</span>
                <span>All Posts</span>
              </span>
              <span
                className={`text-xs font-bold tabular-nums min-w-4 text-right ${!activeCategory ? "text-gold-500" : "text-zinc-600"}`}
              >
                {counts.all ?? 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3 px-1 xl:px-2">
        {status === "loading" ? (
          <div className="p-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
          </div>
        ) : session ? (
          <div className="group relative">
            <div className="flex items-center gap-3 p-3 xl:px-4 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer w-fit xl:w-full mx-auto xl:mx-0">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="hidden xl:block flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-white text-sm font-semibold truncate">
                    {session.user.name}
                  </p>
                  {session.user.verified && session.user.role === "org" && (
                    <VerifiedBadge />
                  )}
                </div>
                <p className="text-zinc-500 text-xs truncate">
                  @{session.user.username}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-zinc-600 hidden xl:block flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-50 w-52">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors"
                >
                  Settings & Password
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm text-gold-500 font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                >
                  Sign out @{session.user.username}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-2">
            <Link
              href="/register"
              className="hidden xl:block gold-gradient text-black font-bold py-3 rounded-full text-sm text-center hover:opacity-90 transition-opacity"
            >
              Join the Network
            </Link>
            <Link
              href="/login"
              className="hidden xl:block border border-zinc-700 text-white font-bold py-3 rounded-full text-sm text-center hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 hover:bg-zinc-900 transition-colors mx-auto"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
