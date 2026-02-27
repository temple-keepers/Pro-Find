import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, CheckCircle, ShieldCheck, GraduationCap, CircleDot, DollarSign, ChevronRight } from "lucide-react";
import { Provider } from "@/lib/types";
import { getTradeById } from "@/lib/data/trades";
import { getAreaById } from "@/lib/data/areas";
import { formatPriceRange } from "@/lib/utils/pricing";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { StarRating } from "@/components/ui/StarRating";
import { WhatsAppButton } from "./WhatsAppButton";
import { TrustBadge } from "./TrustBadge";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const primaryTrade = getTradeById(provider.trades[0]);
  const primaryAreas = provider.areas
    .slice(0, 3)
    .map((id) => getAreaById(id))
    .filter(Boolean);
  const moreAreas = provider.areas.length > 3 ? provider.areas.length - 3 : 0;

  const initials = provider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group card p-0 border border-gray-100/80 overflow-hidden hover:border-brand-green-200 relative">
      {/* Featured ribbon */}
      {provider.isFeatured && (
        <div className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-300 px-4 py-1.5 flex items-center gap-1.5">
          <span className="text-xs font-bold text-brand-green-900 tracking-wide">⭐ FEATURED PROVIDER</span>
        </div>
      )}

      {/* Tappable card body — link stretches over entire card content area */}
      <Link href={`/provider/${provider.id}`} className="block p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {provider.photoUrl ? (
              <Image
                src={provider.photoUrl}
                alt={provider.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green-100 to-brand-green-50 flex items-center justify-center ring-2 ring-brand-green-100">
                <span className="text-brand-green-700 font-bold text-xl">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-base text-text-primary group-hover:text-brand-green-600 transition-colors">
                  {provider.name}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {provider.idVerified ? (
                    <span className="badge-verified">
                      <ShieldCheck className="w-3 h-3" />
                      ID Verified
                    </span>
                  ) : provider.isVerified ? (
                    <span className="badge-verified">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : null}
                  {provider.bitCertified && (
                    <span className="badge-bit">
                      <GraduationCap className="w-3 h-3" />
                      BIT
                    </span>
                  )}
                  {provider.availableNow && (
                    <span className="badge-available">
                      <CircleDot className="w-3 h-3" />
                      Available
                    </span>
                  )}
                </div>
              </div>
              {primaryTrade && (
                <TradeIcon tradeId={primaryTrade.id} size="sm" />
              )}
            </div>

            {/* Rating + Trust Tier */}
            <div className="mt-2.5 flex items-center gap-2">
              <StarRating
                rating={provider.avgRating}
                reviewCount={provider.reviewCount}
              />
              <TrustBadge provider={provider} size="sm" />
            </div>
          </div>
        </div>

        {/* Details — compact grid */}
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 gap-x-4">
          {primaryTrade && (
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="text-base">{primaryTrade.icon}</span>
              <span className="text-sm">{primaryTrade.localName}</span>
              {provider.yearsExperience && (
                <span className="text-text-muted text-xs">· {provider.yearsExperience}yr</span>
              )}
            </div>
          )}

          {primaryAreas.length > 0 && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs truncate">
                {primaryAreas.map((a) => a!.shortName).join(", ")}
                {moreAreas > 0 && ` +${moreAreas}`}
              </span>
            </div>
          )}

          {provider.priceRangeLow && provider.priceRangeHigh && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs">
                {formatPriceRange(provider.priceRangeLow, provider.priceRangeHigh)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-text-muted">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">
              Since {new Date(provider.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </Link>

      {/* Action bar — sits above the card link, z-index ensures WhatsApp is independently clickable */}
      <div className="flex gap-2 px-5 py-3 bg-gray-50/80 border-t border-gray-100 relative z-10">
        <WhatsAppButton
          phone={provider.phone}
          providerName={provider.name}
          trade={primaryTrade?.localName}
          providerId={provider.id}
          sourcePage="search"
          size="sm"
          className="flex-1"
        />
        <Link
          href={`/provider/${provider.id}`}
          className="bg-white text-text-primary font-medium px-4 py-2 rounded-xl border border-gray-200 text-xs flex items-center gap-1 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          View Profile
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
