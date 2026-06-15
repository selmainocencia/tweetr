export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-6 mt-8">
      <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-600 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </div>
          <span>Tweetr · Built with Next.js & MongoDB</span>
        </div>
        <span>© {new Date().getFullYear()} Tweetr Clone</span>
      </div>
    </footer>
  );
}
