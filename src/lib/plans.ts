// ============================================
// ProFind Guyana — Plans & Feature Gating
// ============================================

export interface PlanFeatures {
  maxPhotos: number;
  quoteToolAccess: boolean;
  jobTracker: boolean;
  analytics: boolean;
  featured: boolean;
  proBadge: boolean;
  respondReviews: boolean;
  maxProducts?: number; // shops only (-1 = unlimited)
}

export interface Plan {
  id: string;
  name: string;
  userType: "provider" | "shop";
  priceMonthly: number;  // GYD
  priceYearly: number;
  features: PlanFeatures;
  badge?: string;
  tagline?: string;
}

export const PROVIDER_PLANS: Plan[] = [
  {
    id: "provider_free",
    name: "Free",
    userType: "provider",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Get discovered",
    features: {
      maxPhotos: 2,
      quoteToolAccess: false,
      jobTracker: false,
      analytics: false,
      featured: false,
      proBadge: false,
      respondReviews: false,
    },
  },
  {
    id: "provider_pro",
    name: "Pro",
    userType: "provider",
    priceMonthly: 5000,
    priceYearly: 48000,
    badge: "⭐",
    tagline: "Grow your business",
    features: {
      maxPhotos: 8,
      quoteToolAccess: true,
      jobTracker: true,
      analytics: true,
      featured: false,
      proBadge: true,
      respondReviews: true,
    },
  },
  {
    id: "provider_boost",
    name: "Pro + Boost",
    userType: "provider",
    priceMonthly: 10000,
    priceYearly: 96000,
    badge: "🚀",
    tagline: "Maximum visibility",
    features: {
      maxPhotos: 8,
      quoteToolAccess: true,
      jobTracker: true,
      analytics: true,
      featured: true,
      proBadge: true,
      respondReviews: true,
    },
  },
];

export const SHOP_PLANS: Plan[] = [
  {
    id: "shop_free",
    name: "Free",
    userType: "shop",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Get started",
    features: {
      maxPhotos: 0,
      quoteToolAccess: false,
      jobTracker: false,
      analytics: false,
      featured: false,
      proBadge: false,
      respondReviews: false,
      maxProducts: 10,
    },
  },
  {
    id: "shop_pro",
    name: "Pro",
    userType: "shop",
    priceMonthly: 5000,
    priceYearly: 48000,
    badge: "⭐",
    tagline: "Unlimited listings",
    features: {
      maxPhotos: 0,
      quoteToolAccess: false,
      jobTracker: false,
      analytics: true,
      featured: false,
      proBadge: true,
      respondReviews: false,
      maxProducts: -1,
    },
  },
  {
    id: "shop_boost",
    name: "Pro + Boost",
    userType: "shop",
    priceMonthly: 10000,
    priceYearly: 96000,
    badge: "🚀",
    tagline: "Top of every search",
    features: {
      maxPhotos: 0,
      quoteToolAccess: false,
      jobTracker: false,
      analytics: true,
      featured: true,
      proBadge: true,
      respondReviews: false,
      maxProducts: -1,
    },
  },
];

export function getPlanById(id: string): Plan | undefined {
  return [...PROVIDER_PLANS, ...SHOP_PLANS].find((p) => p.id === id);
}

export function getFeatures(planId: string): PlanFeatures {
  const plan = getPlanById(planId);
  if (!plan) {
    // Default to free
    return {
      maxPhotos: 2,
      quoteToolAccess: false,
      jobTracker: false,
      analytics: false,
      featured: false,
      proBadge: false,
      respondReviews: false,
      maxProducts: 10,
    };
  }
  return plan.features;
}

export function isPro(planId: string): boolean {
  return planId === "provider_pro" || planId === "provider_boost"
    || planId === "shop_pro" || planId === "shop_boost";
}

export function isBoost(planId: string): boolean {
  return planId === "provider_boost" || planId === "shop_boost";
}

export function formatGYD(amount: number): string {
  return new Intl.NumberFormat("en-GY").format(amount);
}
