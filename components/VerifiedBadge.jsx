"use client";

export default function VerifiedBadge({ size = "sm" }) {
  const dimensions = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const check = size === "lg" ? "w-3 h-3" : "w-2.5 h-2.5";

  return (
    <div className="relative group flex-shrink-0">
      <div
        className={`${dimensions} rounded-md gold-gradient flex items-center justify-center`}
      >
        <svg
          className={`${check} text-black`}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
        <div className="bg-zinc-900 border border-gold-500/40 text-gold-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-2xl">
          Verified Organisation
        </div>
        <div className="w-2 h-2 bg-zinc-900 border-r border-b border-gold-500/40 rotate-45 mx-auto -mt-1" />
      </div>
    </div>
  );
}
