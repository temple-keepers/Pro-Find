export default function RootLoading() {
  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-green-100 flex items-center justify-center animate-pulse">
          <svg
            className="w-5 h-5 text-brand-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-text-muted animate-pulse">Loading&hellip;</p>
      </div>
    </div>
  );
}
