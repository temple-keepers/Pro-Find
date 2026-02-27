import { Shield, ShieldCheck } from "lucide-react";
import type { Provider } from "@/lib/types";
import { getProviderTrustTier, type TrustTierConfig } from "@/lib/data/trust";

interface TrustBadgeProps {
  provider: Pick<
    Provider,
    "isVerified" | "idVerified" | "reviewCount" | "avgRating" | "yearsExperience" | "bitCertified" | "isClaimed"
  >;
  size?: "sm" | "md";
}

function TierIcon({ tier, className }: { tier: TrustTierConfig; className?: string }) {
  if (tier.id === "new") return <Shield className={className} />;
  return <ShieldCheck className={className} />;
}

export function TrustBadge({ provider, size = "sm" }: TrustBadgeProps) {
  const tier = getProviderTrustTier(provider);

  // Don't show badge for "new" tier — not meaningful yet
  if (tier.id === "new") return null;

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${padding} rounded-full font-semibold ring-1 ${tier.bgColor} ${tier.color} ${tier.ringColor} ${textSize}`}
      title={`Trust score: ${tier.label}`}
    >
      <TierIcon tier={tier} className={iconSize} />
      {tier.label}
    </span>
  );
}
