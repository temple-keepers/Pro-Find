export default function ProviderLoading() {
  return (
    <div className="min-h-screen bg-surface-warm pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 h-11" />
      </div>
      <div className="max-w-3xl mx-auto px-4">
        <div className="card p-5 mt-4 border border-gray-100 animate-pulse">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded-lg w-48" />
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          </div>
          <div className="h-16 bg-gray-100 rounded-lg mt-4" />
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="card p-5 mt-3 border border-gray-100 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 bg-gray-100 rounded-full w-20" />
            ))}
          </div>
        </div>
        <div className="card p-5 mt-3 border border-gray-100 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
