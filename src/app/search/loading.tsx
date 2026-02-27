export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="bg-white border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card p-4 border border-gray-100 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-36" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
