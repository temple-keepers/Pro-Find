"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { getAreasByRegion } from "@/lib/data/areas";
import { findTradesByProblem } from "@/lib/data/trades";

const POPULAR_SEARCHES = [
  "Leaking pipe",
  "AC not cooling",
  "Breaker keeps tripping",
  "Build gate",
  "Kitchen cabinets",
  "Paint house exterior",
  "Blocked drain",
  "Car not starting",
];

export function HeroSearch() {
  const router = useRouter();
  const areasByRegion = getAreasByRegion();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) {
      const matchedTrades = findTradesByProblem(query.trim());
      if (matchedTrades.length === 1) {
        params.set("trade", matchedTrades[0].id);
      } else {
        params.set("q", query.trim());
      }
    }

    if (area) {
      params.set("area", area);
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagClick = (tag: string) => {
    const matchedTrades = findTradesByProblem(tag);
    const params = new URLSearchParams();
    if (matchedTrades.length === 1) {
      params.set("trade", matchedTrades[0].id);
    } else {
      params.set("q", tag);
    }
    if (area) params.set("area", area);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="bg-white rounded-3xl p-2 shadow-elevated ring-1 ring-black/5">
          <div className="flex flex-col gap-2">
            {/* Search input — large and prominent */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "leaking pipe" or "AC not cooling"...'
                aria-label="Search for a trade or describe your problem"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-0 text-text-primary font-medium placeholder:text-gray-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-green-500/20 transition-all text-base"
              />
            </div>
            {/* Area + Button row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  aria-label="Select your area"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 border-0 text-text-secondary text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-green-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Areas</option>
                  {Object.entries(areasByRegion).map(([region, areas]) => (
                    <optgroup key={region} label={region}>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-brand-green-500 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-brand-green-600 active:scale-[0.97] transition-all shadow-lg shadow-brand-green-500/30 flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Find
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Popular search tags */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="text-xs text-green-200/70 mr-1 self-center">Popular:</span>
        {POPULAR_SEARCHES.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-green-100 border border-white/15 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
