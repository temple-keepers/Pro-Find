"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { ArrowLeft, SlidersHorizontal, UserPlus, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion, getAreaById } from "@/lib/data/areas";
import { fetchProviders } from "@/lib/data";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { TradeIcon } from "@/components/ui/TradeIcon";

function SkeletonCard() {
  return (
    <div className="card p-0 border border-gray-100/80 overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex gap-2">
        <div className="h-8 bg-gray-200 rounded-xl flex-1" />
        <div className="h-8 bg-gray-100 rounded-xl w-28" />
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tradeParam = searchParams.get("trade") || "";
  const areaParam = searchParams.get("area") || "";
  const queryParam = searchParams.get("q") || "";

  const [selectedTrade, setSelectedTrade] = useState(tradeParam);
  const [selectedArea, setSelectedArea] = useState(areaParam);
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "newest">("rating");
  const [availableNow, setAvailableNow] = useState(false);
  const [bitOnly, setBitOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const areasByRegion = getAreasByRegion();
  const selectedTradeData = TRADES.find((t) => t.id === selectedTrade);
  const selectedAreaData = selectedArea ? getAreaById(selectedArea) : null;

  const [results, setResults] = useState<import("@/lib/types").Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const doSearch = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchProviders({
      trade: selectedTrade || undefined,
      area: selectedArea || undefined,
      query: queryParam || undefined,
      availableNow: availableNow || undefined,
      bitCertifiedOnly: bitOnly || undefined,
      sortBy,
    })
      .then((data) => setResults(data))
      .catch(() => {
        setResults([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [selectedTrade, selectedArea, queryParam, sortBy, availableNow, bitOnly]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  // Log search to analytics
  const logSearchEvent = useCallback(() => {
    fetch("/api/search-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryParam || undefined,
        trade: selectedTrade || undefined,
        area: selectedArea || undefined,
        resultsCount: results.length,
      }),
    }).catch(() => {});
  }, [queryParam, selectedTrade, selectedArea, results.length]);

  useEffect(() => {
    logSearchEvent();
  }, [logSearchEvent]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTrade) params.set("trade", selectedTrade);
    if (selectedArea) params.set("area", selectedArea);
    if (queryParam) params.set("q", queryParam);
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [selectedTrade, selectedArea, queryParam, router]);

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1 -ml-1 text-text-muted hover:text-text-primary"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                {selectedTradeData && (
                  <TradeIcon tradeId={selectedTradeData.id} size="sm" />
                )}
                <div>
                  <h1 className="font-semibold text-sm">
                    {selectedTradeData
                      ? selectedTradeData.localName
                      : "All Trades"}
                  </h1>
                  <p className="text-xs text-text-muted">
                    {selectedAreaData
                      ? selectedAreaData.name
                      : "All Areas"}{" "}
                    · {loading ? "…" : `${results.length} found`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-brand-green-50 text-brand-green-600"
                  : "text-text-muted hover:text-text-primary"
              }`}
              aria-label={showFilters ? "Hide filters" : "Show filters"}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 pb-1">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="input-field text-sm !py-2"
                >
                  <option value="">All Trades</option>
                  {TRADES.map((trade) => (
                    <option key={trade.id} value={trade.id}>
                      {trade.localName}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="input-field text-sm !py-2"
                >
                  <option value="">All Areas</option>
                  {Object.entries(areasByRegion).map(([region, areas]) => (
                    <optgroup key={region} label={region}>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs bg-surface-muted px-3 py-1.5 rounded-full border border-gray-200"
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="newest">Newest</option>
                </select>

                <button
                  onClick={() => setAvailableNow(!availableNow)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    availableNow
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-surface-muted border-gray-200 text-text-muted"
                  }`}
                >
                  🟢 Available Now
                </button>

                <button
                  onClick={() => setBitOnly(!bitOnly)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    bitOnly
                      ? "bg-brand-gold-50 border-brand-gold-200 text-brand-gold-800"
                      : "bg-surface-muted border-gray-200 text-text-muted"
                  }`}
                >
                  🎓 BIT Certified
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {loading ? (
          /* Skeleton loading cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          /* Error state with retry */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display text-xl mb-2">
              Something went wrong
            </h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              We couldn&apos;t load results. Check your connection and try again.
            </p>
            <button onClick={doSearch} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="font-display text-xl mb-2">
              No {selectedTradeData?.localName || "tradespeople"} found
              {selectedAreaData ? ` in ${selectedAreaData.name}` : ""}
            </h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              We&apos;re still growing. Know a good{" "}
              {selectedTradeData?.localName.toLowerCase() || "tradesperson"}?
              Help your neighbours by suggesting them.
            </p>
            <Link href="/suggest" className="btn-primary inline-flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Suggest a Tradesperson
            </Link>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted mb-3">
              Don&apos;t see who you need?
            </p>
            <Link
              href="/suggest"
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Suggest Someone Good
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-warm flex items-center justify-center">
          <div className="animate-pulse text-text-muted">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
