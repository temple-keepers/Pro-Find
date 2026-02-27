"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, Store, Package, FileText, TrendingUp, Crown,
  ShieldX, Loader2, ChevronRight, Eye, Plus, Search,
  Star, MessageCircle, DollarSign, BarChart3, ArrowUpRight,
  UserPlus, ShoppingBag, Zap, Clock, CheckCircle, XCircle,
  AlertCircle, Trash2, Edit2, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { TRADES } from "@/lib/data/trades";

// ============================================
// Types
// ============================================
interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalShops: number;
  totalProducts: number;
  totalQuoteRequests: number;
  openQuoteRequests: number;
  proProviders: number;
  proShops: number;
  recentSignups: number;
}

interface ProviderRow {
  id: string;
  name: string;
  phone: string;
  trades: string[];
  areas: string[];
  avgRating: number;
  reviewCount: number;
  plan: string;
  isFeatured: boolean;
  isActive: boolean;
  isClaimed: boolean;
  createdAt: string;
}

interface ShopRow {
  id: string;
  name: string;
  phone: string;
  area: string;
  plan: string;
  productCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
}

interface QuoteRow {
  id: string;
  customerName: string;
  customerPhone: string;
  trade: string;
  urgency: string;
  status: string;
  createdAt: string;
}

type Tab = "overview" | "providers" | "shops" | "users" | "quotes" | "add-provider";

// ============================================
// Main Admin Console
// ============================================
export default function AdminConsolePage() {
  const { appUser, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  if (!appUser) { router.push("/login"); return null; }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="card p-8 border border-gray-100 max-w-sm w-full text-center">
          <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h1 className="font-display text-xl mb-2">Access Denied</h1>
          <p className="text-sm text-text-muted mb-4">Admin only.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "providers", label: "Providers", icon: Users },
    { id: "shops", label: "Shops", icon: Store },
    { id: "users", label: "Users", icon: Crown },
    { id: "quotes", label: "Quote Requests", icon: FileText },
    { id: "add-provider", label: "Add Provider", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-sm">👑</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Admin Console</h1>
              <p className="text-xs text-gray-400">{appUser.email}</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            View Site <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-surface-warm text-text-primary"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "providers" && <ProvidersTab />}
        {activeTab === "shops" && <ShopsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "quotes" && <QuotesTab />}
        {activeTab === "add-provider" && (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted mb-3">The Add Provider tool opens in its own page.</p>
            <Link href="/admin/add-providers" className="btn-primary">Open Add Providers Tool</Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Overview Tab
// ============================================
function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) { const data = await res.json(); setStats(data); }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-green-500" /></div>;
  if (!stats) return <p className="text-center text-text-muted py-8">Failed to load stats</p>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Providers", value: stats.totalProviders, icon: Users, color: "bg-brand-green-50 text-brand-green-600" },
    { label: "Shops", value: stats.totalShops, icon: Store, color: "bg-brand-gold-50 text-brand-gold-700" },
    { label: "Products Listed", value: stats.totalProducts, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Quote Requests", value: stats.totalQuoteRequests, icon: FileText, color: "bg-orange-50 text-orange-600" },
    { label: "Open Quotes", value: stats.openQuoteRequests, icon: Clock, color: "bg-red-50 text-red-500" },
    { label: "Pro Providers", value: stats.proProviders, icon: Star, color: "bg-emerald-50 text-emerald-600" },
    { label: "Pro Shops", value: stats.proShops, icon: Zap, color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-4 border border-gray-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-text-muted">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Add Provider", href: "/admin/add-providers", icon: UserPlus, color: "bg-brand-green-50 text-brand-green-600" },
          { label: "Browse Search", href: "/search", icon: Search, color: "bg-blue-50 text-blue-600" },
          { label: "Materials Shop", href: "/shop", icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
          { label: "Price Guide", href: "/price-guide", icon: DollarSign, color: "bg-brand-gold-50 text-brand-gold-700" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.label} href={a.href}
              className="card p-4 border border-gray-100 flex items-center gap-3 hover:border-brand-green-200 transition-colors group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{a.label}</span>
              <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-brand-green-500" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Providers Tab
// ============================================
function ProvidersTab() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/providers");
        if (res.ok) { const data = await res.json(); setProviders(data.providers || []); }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = providers.filter((p) =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  const getTradeNames = (ids: string[]) => ids.map((id) => TRADES.find((t) => t.id === id)?.localName || id).join(", ");

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-green-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{providers.length} Providers</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-9 !py-2 text-sm w-60" placeholder="Search name or phone..." />
          </div>
          <Link href="/admin/add-providers" className="btn-primary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </Link>
        </div>
      </div>

      <div className="card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-text-muted text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Trades</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-center font-medium">Rating</th>
                <th className="px-4 py-3 text-center font-medium">Plan</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-text-muted">{p.areas?.slice(0, 2).join(", ")}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{getTradeNames(p.trades || [])}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-brand-gold-600 font-medium">{p.avgRating?.toFixed(1) || "—"}</span>
                    <span className="text-text-muted text-xs ml-1">({p.reviewCount || 0})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.plan === "provider_boost" ? "bg-brand-gold-100 text-brand-gold-800" :
                      p.plan === "provider_pro" ? "bg-brand-green-100 text-brand-green-700" :
                      "bg-gray-100 text-text-muted"
                    }`}>
                      {p.plan === "provider_boost" ? "BOOST" : p.plan === "provider_pro" ? "PRO" : "FREE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.isClaimed ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Claimed</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">Unclaimed</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/provider/${p.id}`} className="text-brand-green-500 hover:text-brand-green-600 text-xs font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-text-muted">No providers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Shops Tab
// ============================================
function ShopsTab() {
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/shops");
        if (res.ok) { const data = await res.json(); setShops(data.shops || []); }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-green-500" /></div>;

  return (
    <div>
      <h2 className="font-semibold mb-4">{shops.length} Shops</h2>
      <div className="card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-text-muted text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">Shop Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-center font-medium">Products</th>
                <th className="px-4 py-3 text-center font-medium">Plan</th>
                <th className="px-4 py-3 text-center font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shops.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.phone || "—"}</td>
                  <td className="px-4 py-3 text-center font-medium">{s.productCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.plan === "shop_boost" ? "bg-brand-gold-100 text-brand-gold-800" :
                      s.plan === "shop_pro" ? "bg-brand-green-100 text-brand-green-700" :
                      "bg-gray-100 text-text-muted"
                    }`}>
                      {s.plan === "shop_boost" ? "BOOST" : s.plan === "shop_pro" ? "PRO" : "FREE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.isActive
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                      : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-muted">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {shops.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No shops yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Users Tab
// ============================================
function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) { const data = await res.json(); setUsers(data.users || []); }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-green-500" /></div>;

  const roleColor = (r: string) => {
    switch (r) {
      case "admin": return "bg-brand-gold-100 text-brand-gold-800";
      case "provider": return "bg-brand-green-100 text-brand-green-700";
      case "shop_owner": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-text-muted";
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-4">{users.length} Users</h2>
      <div className="card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-text-muted text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Roles</th>
                <th className="px-4 py-3 text-right font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {(u.roles || []).map((r) => (
                        <span key={r} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor(r)}`}>
                          {r.replace("_", " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Quote Requests Tab
// ============================================
function QuotesTab() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/quotes");
        if (res.ok) { const data = await res.json(); setQuotes(data.quotes || []); }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const getTradeName = (id: string) => TRADES.find((t) => t.id === id)?.localName || id;

  const urgencyLabel = (u: string) => {
    switch (u) {
      case "urgent": return { text: "Urgent", color: "bg-red-50 text-red-600" };
      case "this_week": return { text: "This Week", color: "bg-yellow-50 text-yellow-700" };
      case "this_month": return { text: "This Month", color: "bg-green-50 text-green-700" };
      default: return { text: "Flexible", color: "bg-gray-100 text-text-muted" };
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-green-500" /></div>;

  return (
    <div>
      <h2 className="font-semibold mb-4">{quotes.length} Quote Requests</h2>
      <div className="card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-text-muted text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Trade</th>
                <th className="px-4 py-3 text-center font-medium">Urgency</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map((q) => {
                const urg = urgencyLabel(q.urgency);
                return (
                  <tr key={q.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">{q.customerName}</td>
                    <td className="px-4 py-3 text-text-secondary">{q.customerPhone}</td>
                    <td className="px-4 py-3 text-text-secondary">{getTradeName(q.trade)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${urg.color}`}>{urg.text}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.status === "open" ? "bg-blue-50 text-blue-600" :
                        q.status === "claimed" ? "bg-emerald-50 text-emerald-700" :
                        "bg-gray-100 text-text-muted"
                      }`}>
                        {q.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-text-muted">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {quotes.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No quote requests yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
