import {
  Wrench,
  Zap,
  Snowflake,
  Hammer,
  Box,
  Paintbrush,
  Flame,
  Car,
  LucideIcon,
} from "lucide-react";

const TRADE_ICONS: Record<string, LucideIcon> = {
  plumber: Wrench,
  electrician: Zap,
  "ac-technician": Snowflake,
  carpenter: Hammer,
  mason: Box,
  painter: Paintbrush,
  welder: Flame,
  mechanic: Car,
};

// Richer, more distinctive color system
const TRADE_COLORS: Record<string, { bg: string; icon: string; ring: string; gradient: string }> = {
  plumber:        { bg: "bg-blue-50",    icon: "text-blue-600",    ring: "ring-blue-200",    gradient: "from-blue-100 to-blue-50" },
  electrician:    { bg: "bg-amber-50",   icon: "text-amber-600",   ring: "ring-amber-200",   gradient: "from-amber-100 to-amber-50" },
  "ac-technician":{ bg: "bg-sky-50",     icon: "text-sky-600",     ring: "ring-sky-200",     gradient: "from-sky-100 to-sky-50" },
  carpenter:      { bg: "bg-orange-50",  icon: "text-orange-700",  ring: "ring-orange-200",  gradient: "from-orange-100 to-orange-50" },
  mason:          { bg: "bg-stone-100",  icon: "text-stone-600",   ring: "ring-stone-200",   gradient: "from-stone-200 to-stone-100" },
  painter:        { bg: "bg-fuchsia-50", icon: "text-fuchsia-600", ring: "ring-fuchsia-200", gradient: "from-fuchsia-100 to-fuchsia-50" },
  welder:         { bg: "bg-rose-50",    icon: "text-rose-600",    ring: "ring-rose-200",    gradient: "from-rose-100 to-rose-50" },
  mechanic:       { bg: "bg-slate-100",  icon: "text-slate-600",   ring: "ring-slate-200",   gradient: "from-slate-200 to-slate-100" },
};

interface TradeIconProps {
  tradeId: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBackground?: boolean;
  className?: string;
}

const SIZES = {
  sm: { container: "w-9 h-9", icon: "w-4 h-4" },
  md: { container: "w-11 h-11", icon: "w-5 h-5" },
  lg: { container: "w-14 h-14", icon: "w-7 h-7" },
  xl: { container: "w-18 h-18", icon: "w-9 h-9" },
};

export function TradeIcon({
  tradeId,
  size = "md",
  showBackground = true,
  className = "",
}: TradeIconProps) {
  const IconComponent = TRADE_ICONS[tradeId] || Wrench;
  const colors = TRADE_COLORS[tradeId] || TRADE_COLORS.plumber;
  const dimensions = SIZES[size];

  if (!showBackground) {
    return (
      <IconComponent
        className={`${dimensions.icon} ${colors.icon} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${dimensions.container} bg-gradient-to-br ${colors.gradient} ring-1 ${colors.ring} rounded-2xl flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <IconComponent className={`${dimensions.icon} ${colors.icon}`} />
    </div>
  );
}

export { TRADE_ICONS, TRADE_COLORS };
