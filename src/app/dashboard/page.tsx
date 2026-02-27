"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  MessageCircle,
  Star,
  FileText,
  ClipboardList,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  ChevronRight,
  Clock,
  UserPlus,
  Send,
  Briefcase,
  GraduationCap,
  LogOut,
  Loader2,
} from "lucide-react";
import { useProviderAuth } from "@/components/auth/AuthContext";
import { getTradeById } from "@/lib/data/trades";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { StarRating } from "@/components/ui/StarRating";

interface ProviderData {
  id: string;
  name: string;
  phone: string;
  trades: string[];
  areas: string[];
  avgRating: number;
  reviewCount: number;
  availableNow: boolean;
  isClaimed: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  bitCertified: boolean;
  yearsExperience?: number;
  description?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  comingSoon,
  color = "bg-surface-muted",
  iconColor = "text-text-muted",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  comingSoon?: boolean;
  color?: string;
  iconColor?: string;
}) {
  return (
    <div className="card p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {trend && (
          <span className="text-xs text-brand-green-600 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
        {comingSoon && (
          <span className="text-[10px] text-text-muted bg-surface-muted px-1.5 py-0.5 rounded-full">
            Soon
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold mt-3 ${comingSoon ? "text-text-muted" : ""}`}>
        {comingSoon ? "0" : value}
      </p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  description,
  href,
  color = "bg-surface-muted",
  iconColor = "text-text-muted",
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  color?: string;
  iconColor?: string;
}) {
  return (
    <Link
      href={href}
      className="card p-4 border border-gray-100 flex items-center gap-3 hover:border-brand-green-200 transition-colors group"
    >
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-text-muted truncate">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-green-500 transition-colors" />
    </Link>
  );
}

export default function DashboardPage() {
  const { provider: session, user, isAdmin, isLoading: authLoading, logout } = useProviderAuth();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableNow, setAvailableNow] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Fetch full provider data from API
  useEffect(() => {
    if (!session?.id) return;

    async function fetchProvider() {
      try {
        const res = await fetch(`/api/providers/${session!.id}/profile`);
        if (res.ok) {
          const data = await res.json();
          setProviderData(data.provider);
          setAvailableNow(data.provider.availableNow);
        }
      } catch (err) {
        console.error("Failed to fetch provider:", err);
      }
      setLoading(false);
    }
    fetchProvider();
  }, [session]);

  const handleToggleAvailability = async () => {
    if (!session?.id) return;
    setToggling(true);
    try {
      await fetch(`/api/providers/${session.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableNow: !availableNow }),
      });
      setAvailableNow(!availableNow);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
    setToggling(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null; // Will redirect via auth context

  if (!session && !isAdmin) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <p className="text-lg font-semibold mb-2">No provider profile found</p>
          <p className="text-sm text-text-muted mb-4">Your account doesn&apos;t have a linked provider profile yet.</p>
          <button onClick={logout} className="btn-secondary">Log out</button>
        </div>
      </div>
    );
  }

  const provider = providerData;
  const primaryTrade = provider?.trades?.[0] ? getTradeById(provider.trades[0]) : null;

  // Admin with no real provider — redirect to full admin console
  if (isAdmin && session?.id === "admin" && !providerData) {
    if (typeof window !== "undefined") window.location.href = "/admin";
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  const initials = (provider?.name || session?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Profile completeness score
  const completenessChecks = provider
    ? [
        { label: "Phone number", done: !!provider.phone },
        { label: "Description", done: !!provider.description },
        { label: "Trades selected", done: provider.trades.length > 0 },
        { label: "Areas served", done: provider.areas.length > 0 },
        { label: "Years of experience", done: !!provider.yearsExperience },
        { label: "At least one review", done: provider.reviewCount > 0 },
        { label: "BIT certified", done: provider.bitCertified },
      ]
    : [];
  const completedCount = completenessChecks.filter((c) => c.done).length;
  const completenessPercent = completenessChecks.length
    ? Math.round((completedCount / completenessChecks.length) * 100)
    : 0;
  const nextTodo = completenessChecks.find((c) => !c.done);

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green-100 to-brand-green-50 flex items-center justify-center flex-shrink-0 ring-2 ring-brand-green-100">
              <span className="text-brand-green-700 font-bold text-lg">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold truncate">{provider?.name || session?.name || "Provider"}</h1>
                {primaryTrade && (
                  <TradeIcon tradeId={primaryTrade.id} size="sm" />
                )}
              </div>
              {provider && (
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={provider.avgRating} reviewCount={provider.reviewCount} />
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* Availability Toggle */}
        <div
          className={`card p-4 border-2 transition-colors ${
            availableNow
              ? "border-emerald-300 bg-emerald-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  availableNow ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="font-semibold text-sm">
                  {availableNow ? "You're Available" : "You're Unavailable"}
                </p>
                <p className="text-xs text-text-muted">
                  {availableNow
                    ? "Customers can see you're taking work right now"
                    : "Turn on to show customers you're available"}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleAvailability}
              disabled={toggling}
              className="text-brand-green-500 hover:text-brand-green-600 transition-colors disabled:opacity-50"
            >
              {availableNow ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Profile Completeness */}
        {provider && completenessPercent < 100 && (
          <div className="card p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Profile Strength</p>
              <span className="text-xs font-bold text-brand-green-600">
                {completenessPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="bg-brand-green-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            {nextTodo && (
              <p className="text-xs text-text-muted">
                <span className="font-medium text-text-secondary">Next step:</span>{" "}
                Add your {nextTodo.label.toLowerCase()}.{" "}
                <Link
                  href="/dashboard/profile"
                  className="text-brand-green-600 font-medium hover:underline"
                >
                  Complete profile →
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            This Month
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={MessageCircle}
              label="WhatsApp Taps"
              value={0}
              comingSoon
              color="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              icon={Eye}
              label="Profile Views"
              value={0}
              comingSoon
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              icon={Star}
              label="Reviews"
              value={provider?.reviewCount || 0}
              color="bg-brand-gold-50"
              iconColor="text-brand-gold-700"
            />
            <StatCard
              icon={FileText}
              label="Quotes Sent"
              value={0}
              comingSoon
              color="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <QuickAction
              icon={UserPlus}
              label="Edit My Profile"
              description="Update your services, areas, and description"
              href="/dashboard/profile"
              color="bg-brand-green-50"
              iconColor="text-brand-green-600"
            />
            <QuickAction
              icon={FileText}
              label="Create a Quote"
              description="Generate a professional quote to send via WhatsApp"
              href="/dashboard/quotes"
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
            <QuickAction
              icon={ClipboardList}
              label="My Jobs"
              description="Track your active jobs and milestones"
              href="/dashboard/jobs"
              color="bg-purple-50"
              iconColor="text-purple-600"
            />
            <QuickAction
              icon={Send}
              label="Request a Review"
              description="Send a review link to a past customer"
              href="/dashboard/request-review"
              color="bg-brand-gold-50"
              iconColor="text-brand-gold-700"
            />
          </div>
        </div>

        {/* BIT Badge Prompt */}
        {provider && !provider.bitCertified && (
          <div className="card p-4 border border-brand-gold-200 bg-brand-gold-50">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-brand-gold-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Got a BIT Certificate?</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Upload your Board of Industrial Training certificate to get a
                  verified badge on your profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile link */}
        <div className="text-center py-4">
          <Link
            href={`/provider/${session?.id || ""}`}
            className="text-sm text-brand-green-500 font-medium hover:underline"
          >
            View my public profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
