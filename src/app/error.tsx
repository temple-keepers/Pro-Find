"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ProFind error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-display text-2xl mb-2">Something went wrong</h2>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          We hit an unexpected problem. This might be a temporary issue — try
          refreshing the page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
