import Link from "next/link";
import { Search, Home, UserPlus } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-display text-3xl mb-2">Page Not Found</h1>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          We couldn&apos;t find what you&apos;re looking for. It might have been
          moved or doesn&apos;t exist yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/search"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find Tradespeople
          </Link>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-text-muted mb-2">
            Know a good tradesperson?
          </p>
          <Link
            href="/suggest"
            className="text-brand-green-500 text-sm font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <UserPlus className="w-4 h-4" />
            Suggest them to your neighbours
          </Link>
        </div>
      </div>
    </div>
  );
}
