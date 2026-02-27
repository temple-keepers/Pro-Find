"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store, Package, Plus, Edit2, Trash2, Search, ChevronDown,
  Loader2, LogOut, Tag, DollarSign, CheckCircle, XCircle,
  AlertCircle, X, ShoppingBag, ExternalLink,
} from "lucide-react";
import { useShopAuth } from "@/components/auth/AuthContext";
import { MATERIAL_CATEGORIES } from "@/lib/data/materials";
import { TRADES } from "@/lib/data/trades";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  brand?: string;
  unit: string;
  price: number;
  priceWas?: number;
  inStock: boolean;
  description?: string;
  tradeTags: string[];
  photoUrl?: string;
  sku?: string;
  createdAt: string;
}

const UNITS = [
  "each", "ft", "m", "roll", "bag", "gallon", "box",
  "sheet", "bundle", "pair", "lb", "kg", "yard", "set",
];

function formatPrice(p: number) { return new Intl.NumberFormat("en-GY").format(p); }

// ========================================
// Add/Edit Product Modal
// ========================================
function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null; // null = add new
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [unit, setUnit] = useState(product?.unit || "each");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [priceWas, setPriceWas] = useState(product?.priceWas?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [selectedTrades, setSelectedTrades] = useState<string[]>(product?.tradeTags || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!name.trim()) { setError("Product name is required"); return; }
    if (!categoryId) { setError("Select a category"); return; }
    if (!price || parseInt(price) <= 0) { setError("Enter a valid price"); return; }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        categoryId,
        brand: brand.trim() || null,
        unit,
        price: parseInt(price),
        priceWas: priceWas ? parseInt(priceWas) : null,
        description: description.trim() || null,
        tradeTags: selectedTrades,
        sku: sku.trim() || null,
      };

      if (isEdit) payload.id = product.id;

      const res = await fetch("/api/shop/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  const toggleTrade = (id: string) => {
    setSelectedTrades((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-display text-lg">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="input-field" placeholder='e.g. 1/2" PVC Pipe (10ft)' autoFocus />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
              <option value="">Select category...</option>
              {MATERIAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand + SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                className="input-field" placeholder="e.g. Duraplast" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU / Code</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                className="input-field" placeholder="Optional" />
            </div>
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Price (GYD) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                className="input-field" placeholder="450" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Was Price</label>
              <input type="number" value={priceWas} onChange={(e) => setPriceWas(e.target.value)}
                className="input-field" placeholder="Optional" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit *</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[60px] resize-y" placeholder="Size, specs, notes..." maxLength={300} />
          </div>

          {/* Trade tags */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Used by which trades?</label>
            <div className="flex flex-wrap gap-1.5">
              {TRADES.map((t) => (
                <button key={t.id} type="button" onClick={() => toggleTrade(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedTrades.includes(t.id)
                      ? "bg-brand-green-500 text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}>
                  {t.icon} {t.localName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================
// Main Dashboard
// ========================================
export default function ShopDashboardPage() {
  const { shop, user, isLoading, logout } = useShopAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.set("category", filterCategory);
      const res = await fetch(`/api/shop/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shop) fetchProducts();
  }, [shop, filterCategory]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/shop/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeletingId(null);
  };

  const handleToggleStock = async (product: Product) => {
    try {
      await fetch("/api/shop/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      setProducts((prev) =>
        prev.map((p) => p.id === product.id ? { ...p, inStock: !p.inStock } : p)
      );
    } catch (err) {
      console.error("Toggle stock error:", err);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Filter by search
  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.brand?.toLowerCase().includes(q));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!shop) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-lg mb-2">No shop found</p>
          <p className="text-sm text-text-muted mb-4">Your account doesn&apos;t have a shop linked to it.</p>
          <button onClick={logout} className="btn-secondary">Log out</button>
        </div>
      </div>
    );
  }

  const getCatName = (id: string) => MATERIAL_CATEGORIES.find((c) => c.id === id)?.name || id;
  const getCatIcon = (id: string) => MATERIAL_CATEGORIES.find((c) => c.id === id)?.icon || "📦";

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-gold-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-brand-gold-700" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-tight">{shop.name}</h1>
              <p className="text-xs text-text-muted">{products.length} products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> View Shop
            </Link>
            <button onClick={logout} className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-4 border border-gray-100 text-center">
            <Package className="w-6 h-6 text-brand-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-xs text-text-muted">Products</p>
          </div>
          <div className="card p-4 border border-gray-100 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{products.filter((p) => p.inStock).length}</p>
            <p className="text-xs text-text-muted">In Stock</p>
          </div>
          <div className="card p-4 border border-gray-100 text-center">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-bold">{products.filter((p) => !p.inStock).length}</p>
            <p className="text-xs text-text-muted">Out of Stock</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !rounded-xl" placeholder="Search your products..." />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field !w-auto !rounded-xl text-sm">
            <option value="">All Categories</option>
            {MATERIAL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <button onClick={openAdd}
            className="btn-primary !rounded-xl flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Products list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-lg mb-1">
              {products.length === 0 ? "No products yet" : "No matches"}
            </p>
            <p className="text-sm text-text-muted mb-4">
              {products.length === 0
                ? "Add your first product to start reaching tradespeople"
                : "Try a different search or filter"}
            </p>
            {products.length === 0 && (
              <button onClick={openAdd} className="btn-primary text-sm">
                <Plus className="w-4 h-4 inline mr-1" /> Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product) => (
              <div key={product.id}
                className="card border border-gray-100 p-3 flex items-center gap-3 group hover:shadow-md transition-all">
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                  {getCatIcon(product.categoryId)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    {product.brand && (
                      <span className="text-[10px] font-semibold text-text-muted uppercase bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-text-muted">{getCatName(product.categoryId)}</span>
                    <span className="text-xs font-bold text-brand-green-700">${formatPrice(product.price)}/{product.unit}</span>
                    {product.priceWas && (
                      <span className="text-[10px] text-text-muted line-through">${formatPrice(product.priceWas)}</span>
                    )}
                  </div>
                </div>

                {/* Stock toggle */}
                <button onClick={() => handleToggleStock(product)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 transition-colors ${
                    product.inStock
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}>
                  {product.inStock ? "In Stock" : "Out"}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(product)}
                    className="p-1.5 text-text-muted hover:text-brand-green-600 rounded-lg hover:bg-brand-green-50">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}
                    className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50">
                    {deletingId === product.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
