"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Store,
  Tag,
  ChevronDown,
  ChevronRight,
  Check,
  ShoppingBag,
  MessageCircle,
  BadgeCheck,
  Package,
  ArrowUpDown,
  X,
  Loader2,
} from "lucide-react";
import { MATERIAL_CATEGORIES } from "@/lib/data/materials";
import { TRADES } from "@/lib/data/trades";
import { formatWhatsAppUrl } from "@/lib/utils/whatsapp";

interface MaterialItem {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  unit: string;
  price: number;
  priceWas?: number;
  inStock: boolean;
  photoUrl?: string;
  tradeTags: string[];
  isPopular: boolean;
  shop?: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    area: string;
    isVerified: boolean;
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GY").format(price);
}

function MaterialCard({ item }: { item: MaterialItem }) {
  const discount = item.priceWas
    ? Math.round(((item.priceWas - item.price) / item.priceWas) * 100)
    : 0;

  const whatsappMsg = `Hi! I saw ${item.name} listed on ProFind for $${formatPrice(item.price)}. Is it still available?`;
  const whatsappUrl = item.shop?.whatsapp
    ? formatWhatsAppUrl(item.shop.whatsapp, whatsappMsg)
    : "#";

  return (
    <div className="card border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
      {/* Photo placeholder or image */}
      <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
        {item.photoUrl ? (
          <Image src={item.photoUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
        ) : (
          <Package className="w-10 h-10 text-gray-300" />
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.isPopular && (
            <span className="bg-brand-gold-400 text-brand-gold-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Popular
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        {!item.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        {/* Brand */}
        {item.brand && (
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">{item.brand}</p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">{item.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-brand-green-700">${formatPrice(item.price)}</span>
          <span className="text-xs text-text-muted">/{item.unit}</span>
          {item.priceWas && (
            <span className="text-xs text-text-muted line-through">${formatPrice(item.priceWas)}</span>
          )}
        </div>

        {/* Shop */}
        {item.shop && (
          <div className="flex items-center gap-1.5 mb-3">
            <Store className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="text-xs text-text-secondary truncate">{item.shop.name}</span>
            {item.shop.isVerified && <BadgeCheck className="w-3 h-3 text-brand-green-500 flex-shrink-0" />}
          </div>
        )}

        {/* WhatsApp CTA */}
        {item.shop?.whatsapp && item.inStock && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Shop
          </a>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTrade) params.set("trade", selectedTrade);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      params.set("sort", sortBy);
      params.set("inStock", "true");

      const res = await fetch(`/api/materials?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    }
    setLoading(false);
  }, [selectedCategory, selectedTrade, searchQuery, sortBy]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchMaterials(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeFilterCount = [selectedCategory, selectedTrade].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #002312 0%, #003d1e 25%, #009E49 60%, #006a32 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            background: "radial-gradient(circle at 20% 50%, rgba(206,163,42,0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,158,73,0.4), transparent 40%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <ShoppingBag className="w-4 h-4 text-brand-gold-400" />
            <span className="text-sm text-white/90 font-medium">Materials & Parts</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
            Shop Building Materials
          </h1>
          <p className="text-green-200/80 text-sm md:text-base max-w-md mx-auto mb-4">
            Compare prices from local hardware stores. Find what you need, WhatsApp the shop directly.
          </p>
          <Link href="/shop-dashboard/signup" className="inline-flex items-center gap-1.5 text-sm text-brand-gold-400 hover:text-brand-gold-300 font-medium transition-colors">
            <Store className="w-4 h-4" /> Own a shop? List your products free →
          </Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search bar + filter toggle */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !rounded-xl"
              placeholder="Search materials, e.g. PVC pipe, cement, wire..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? "border-brand-green-400 bg-brand-green-50 text-brand-green-700"
                : "border-gray-200 text-text-secondary hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-brand-green-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card p-4 border border-gray-100 mb-4 space-y-4 animate-fade-in">
            {/* Category chips */}
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {MATERIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? "bg-brand-green-500 text-white shadow-sm"
                        : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade filter */}
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Filter by Trade</label>
              <div className="flex flex-wrap gap-1.5">
                {TRADES.map((trade) => (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTrade(selectedTrade === trade.id ? null : trade.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTrade === trade.id
                        ? "bg-brand-green-500 text-white shadow-sm"
                        : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    }`}
                  >
                    {trade.icon} {trade.localName}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field !py-1.5 !text-xs !w-auto"
              >
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSelectedCategory(null); setSelectedTrade(null); }}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category quick-scroll (always visible) */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              !selectedCategory
                ? "bg-brand-green-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-text-secondary hover:border-gray-300"
            }`}
          >
            All
          </button>
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? "bg-brand-green-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-text-secondary hover:border-gray-300"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-muted">
            {loading ? "Loading..." : `${materials.length} item${materials.length !== 1 ? "s" : ""}`}
            {selectedCategory && !loading && (
              <> in <span className="font-medium text-text-primary">{MATERIAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}</span></>
            )}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && materials.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-lg mb-1">No materials found</p>
            <p className="text-sm text-text-muted mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedTrade(null); setSearchQuery(""); }}
              className="btn-secondary text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Materials grid */}
        {!loading && materials.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {materials.map((item) => (
              <MaterialCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Shops CTA */}
        <div className="mt-12 card p-6 border border-gray-100 text-center">
          <Store className="w-10 h-10 text-brand-green-500 mx-auto mb-3" />
          <h2 className="font-display text-xl mb-2">Own a Hardware Store?</h2>
          <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
            List your products on ProFind for free. Manage prices, stock, and let tradespeople WhatsApp you directly.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary text-sm">
              Register Your Shop
            </Link>
            <Link href="/login" className="btn-secondary text-sm">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
