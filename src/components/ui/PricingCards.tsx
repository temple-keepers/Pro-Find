"use client";

import { useState } from "react";
import {
  Check, X, Star, Zap, TrendingUp, BarChart3, Camera,
  FileText, Briefcase, MessageSquare, Crown, Rocket,
  ShoppingBag, Package, BadgeCheck,
} from "lucide-react";
import type { Plan } from "@/lib/plans";
import { formatGYD } from "@/lib/plans";

interface PricingCardsProps {
  plans: Plan[];
  currentPlanId: string;
  userType: "provider" | "shop";
  onSelectPlan: (planId: string) => void;
}

const PROVIDER_FEATURE_LIST = [
  { key: "proBadge", label: "⭐ Pro Badge on profile", icon: BadgeCheck },
  { key: "maxPhotos", label: "Work photos", icon: Camera, format: (v: number) => v === 2 ? "Up to 2" : "Up to 8" },
  { key: "analytics", label: "Profile analytics & insights", icon: BarChart3 },
  { key: "quoteToolAccess", label: "Quick Quote tool", icon: FileText },
  { key: "jobTracker", label: "Job tracker & milestones", icon: Briefcase },
  { key: "respondReviews", label: "Respond to reviews", icon: MessageSquare },
  { key: "featured", label: "Featured at top of search", icon: Rocket },
];

const SHOP_FEATURE_LIST = [
  { key: "maxProducts", label: "Product listings", icon: Package, format: (v: number) => v === -1 ? "Unlimited" : `Up to ${v}` },
  { key: "proBadge", label: "⭐ Verified Shop badge", icon: BadgeCheck },
  { key: "analytics", label: "Shop analytics & insights", icon: BarChart3 },
  { key: "featured", label: "Featured in search results", icon: Rocket },
];

export function PricingCards({ plans, currentPlanId, userType, onSelectPlan }: PricingCardsProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const featureList = userType === "provider" ? PROVIDER_FEATURE_LIST : SHOP_FEATURE_LIST;

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            billing === "monthly" ? "bg-brand-green-500 text-white shadow-sm" : "text-text-secondary hover:bg-gray-100"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
            billing === "yearly" ? "bg-brand-green-500 text-white shadow-sm" : "text-text-secondary hover:bg-gray-100"
          }`}
        >
          Yearly
          <span className="absolute -top-2 -right-2 bg-brand-gold-400 text-brand-gold-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            -20%
          </span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPro = plan.priceMonthly > 0 && !plan.features.featured;
          const isBoost = plan.features.featured;
          const price = billing === "monthly" ? plan.priceMonthly : Math.round((plan.priceYearly || 0) / 12);

          return (
            <div
              key={plan.id}
              className={`relative card border-2 p-5 transition-all ${
                isBoost
                  ? "border-brand-gold-400 shadow-lg shadow-brand-gold-200/30"
                  : isPro
                  ? "border-brand-green-400 shadow-md"
                  : "border-gray-200"
              } ${isCurrent ? "ring-2 ring-brand-green-300 ring-offset-2" : ""}`}
            >
              {/* Recommended badge */}
              {isPro && !isBoost && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              {isBoost && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Best Value
                </div>
              )}

              {/* Plan name + icon */}
              <div className="text-center mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
                  isBoost ? "bg-brand-gold-100" : isPro ? "bg-brand-green-100" : "bg-gray-100"
                }`}>
                  {isBoost ? <Rocket className="w-6 h-6 text-brand-gold-600" /> :
                   isPro ? <Crown className="w-6 h-6 text-brand-green-600" /> :
                   <Star className="w-6 h-6 text-gray-400" />}
                </div>
                <h3 className="font-display text-lg">{plan.name}</h3>
                <p className="text-xs text-text-muted">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-5">
                {plan.priceMonthly === 0 ? (
                  <div className="text-3xl font-bold text-text-primary">Free</div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-text-muted">$</span>
                      <span className="text-3xl font-bold text-text-primary">{formatGYD(price)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      GYD / month{billing === "yearly" ? " (billed yearly)" : ""}
                    </p>
                    {billing === "yearly" && plan.priceYearly && (
                      <p className="text-xs text-brand-green-600 font-medium mt-1">
                        Save ${formatGYD(plan.priceMonthly * 12 - plan.priceYearly)}/year
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-5">
                {featureList.map((feat) => {
                  const value = plan.features[feat.key as keyof typeof plan.features];
                  const enabled = typeof value === "boolean" ? value : typeof value === "number" ? value !== 0 : !!value;

                  return (
                    <li key={feat.key} className="flex items-start gap-2 text-sm">
                      {enabled ? (
                        <Check className="w-4 h-4 text-brand-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={enabled ? "text-text-primary" : "text-text-muted"}>
                        {feat.format && typeof value === "number"
                          ? `${feat.format(value as number)}`
                          : feat.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div className="text-center py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-text-muted">
                  Current Plan
                </div>
              ) : plan.priceMonthly === 0 ? (
                <div className="text-center py-2.5 rounded-xl bg-gray-50 text-sm text-text-muted">
                  Included
                </div>
              ) : (
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isBoost
                      ? "bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 text-white hover:shadow-lg"
                      : "bg-brand-green-500 text-white hover:bg-brand-green-600 hover:shadow-md"
                  }`}
                >
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
