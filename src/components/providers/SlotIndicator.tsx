"use client";

import { Shield } from "lucide-react";

interface SlotIndicatorProps {
  filled: number;
  limit: number;
  tradeName: string;
  area?: string;
  /** "inline" for compact/search, "hero" for trade landing pages */
  variant?: "inline" | "hero";
}

export function SlotIndicator({
  filled,
  limit,
  tradeName,
  area,
  variant = "inline",
}: SlotIndicatorProps) {
  const remaining = Math.max(limit - filled, 0);
  const pct = Math.min((filled / limit) * 100, 100);
  const almostFull = remaining <= 2 && remaining > 0;
  const full = remaining === 0;

  if (variant === "hero") {
    return (
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
        <Shield className="w-4 h-4 text-brand-gold-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  full
                    ? "bg-red-400"
                    : almostFull
                    ? "bg-brand-gold-400"
                    : "bg-brand-green-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-white/80 font-medium tabular-nums">
              {filled}/{limit}
            </span>
          </div>
          <p className="text-xs text-green-200/80">
            {full ? (
              <>All {limit} verified {tradeName.toLowerCase()} slots filled</>
            ) : almostFull ? (
              <span className="text-brand-gold-300 font-medium">
                Only {remaining} spot{remaining !== 1 ? "s" : ""} left for verified {tradeName.toLowerCase()}s
                {area ? ` in ${area}` : ""}
              </span>
            ) : (
              <>
                {filled} verified {tradeName.toLowerCase()}{filled !== 1 ? "s" : ""}
                {area ? ` in ${area}` : ""} — {remaining} spot{remaining !== 1 ? "s" : ""} available
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Inline (search results) variant
  return (
    <div className="flex items-center gap-2.5 bg-surface-muted rounded-xl px-3.5 py-2 border border-gray-100">
      <Shield className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                full
                  ? "bg-red-400"
                  : almostFull
                  ? "bg-brand-gold-500"
                  : "bg-brand-green-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-text-muted font-medium tabular-nums">
            {filled}/{limit}
          </span>
        </div>
      </div>
      <span className="text-xs text-text-secondary">
        {almostFull ? (
          <span className="text-brand-gold-700 font-semibold">
            {remaining} spot{remaining !== 1 ? "s" : ""} left
          </span>
        ) : full ? (
          <span className="text-red-600 font-semibold">Full</span>
        ) : (
          <>
            {filled} verified {tradeName.toLowerCase()}{filled !== 1 ? "s" : ""}
          </>
        )}
      </span>
    </div>
  );
}
