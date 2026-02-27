import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

export default function ProviderNotFound() {
  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">👷</div>
        <h1 className="font-display text-2xl mb-2">Tradesperson not found</h1>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          This profile may have been removed or the link might be incorrect.
          Try searching for them instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/search"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Directory
          </Link>
          <Link
            href="/suggest"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Suggest Someone
          </Link>
        </div>
      </div>
    </div>
  );
}
