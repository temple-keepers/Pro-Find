"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Save, CheckCircle, Trash2, Upload, Download,
  ClipboardList, Loader2, ShieldX, ArrowLeft,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion } from "@/lib/data/areas";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { useAuth } from "@/components/auth/AuthContext";

interface ProviderEntry {
  id: string;
  name: string;
  phone: string;
  trades: string[];
  areas: string[];
  description: string;
  source: string;
  sourceDetail: string;
  bitCertified: boolean;
  bitTrade: string;
  yearsExperience: string;
  priceRangeLow: string;
  priceRangeHigh: string;
  servicesOffered: string;
  status: "draft" | "saved" | "error";
}

function generateId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function emptyEntry(): ProviderEntry {
  return {
    id: generateId(), name: "", phone: "", trades: [], areas: [], description: "",
    source: "facebook", sourceDetail: "", bitCertified: false, bitTrade: "",
    yearsExperience: "", priceRangeLow: "", priceRangeHigh: "", servicesOffered: "", status: "draft",
  };
}

export default function AddProvidersPage() {
  const { appUser, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<ProviderEntry[]>([emptyEntry()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const areasByRegion = getAreasByRegion();

  if (isLoading) return <div className="min-h-screen bg-surface-warm flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" /></div>;
  if (!appUser) { router.push("/login"); return null; }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="card p-8 border border-gray-100 max-w-sm w-full text-center">
          <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h1 className="font-display text-xl mb-2">Access Denied</h1>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const active = entries[activeIndex];

  const updateActive = (updates: Partial<ProviderEntry>) => {
    setEntries((prev) => prev.map((e, i) => (i === activeIndex ? { ...e, ...updates } : e)));
  };

  const toggleTrade = (tradeId: string) => {
    const current = active.trades;
    updateActive({ trades: current.includes(tradeId) ? current.filter((t) => t !== tradeId) : [...current, tradeId] });
  };

  const toggleArea = (areaId: string) => {
    const current = active.areas;
    updateActive({ areas: current.includes(areaId) ? current.filter((a) => a !== areaId) : [...current, areaId] });
  };

  const handleSave = async () => {
    if (!active.name.trim() || !active.phone.trim() || active.trades.length === 0) {
      alert("Need at minimum: Name, Phone, and at least 1 Trade"); return;
    }
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: active.name.trim(), phone: active.phone.trim(), trades: active.trades,
          areas: active.areas.length > 0 ? active.areas : ["gt-georgetown"],
          description: active.description.trim() || undefined,
          yearsExperience: active.yearsExperience || undefined,
          hasBitCert: active.bitCertified, bitTrade: active.bitTrade || undefined,
          source: active.source, sourceDetail: active.sourceDetail,
          priceRangeLow: active.priceRangeLow ? parseInt(active.priceRangeLow) : undefined,
          priceRangeHigh: active.priceRangeHigh ? parseInt(active.priceRangeHigh) : undefined,
          servicesOffered: active.servicesOffered ? active.servicesOffered.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        }),
      });
      if (res.ok) {
        updateActive({ status: "saved" }); setSavedCount((c) => c + 1);
        const newEntry = emptyEntry();
        setEntries((prev) => [...prev, newEntry]); setActiveIndex(entries.length);
      } else { updateActive({ status: "error" }); alert("Save failed"); }
    } catch (err) { updateActive({ status: "error" }); console.error(err); }
  };

  const handleDelete = () => {
    if (entries.length === 1) { setEntries([emptyEntry()]); setActiveIndex(0); return; }
    setEntries((prev) => prev.filter((_, i) => i !== activeIndex));
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const handleBulkParse = () => {
    const lines = bulkText.trim().split("\n").filter(Boolean);
    const newEntries: ProviderEntry[] = [];
    for (const line of lines) {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length < 2) continue;
      const [name, phone, tradeHint, , source] = parts;
      const tradeLower = (tradeHint || "").toLowerCase();
      const matchedTrade = TRADES.find((t) => t.id.includes(tradeLower) || t.localName.toLowerCase().includes(tradeLower));
      newEntries.push({ ...emptyEntry(), name: name || "", phone: phone || "", trades: matchedTrade ? [matchedTrade.id] : [], source: source || "facebook" });
    }
    if (newEntries.length > 0) {
      setEntries((prev) => [...prev, ...newEntries]); setBulkMode(false); setBulkText("");
      alert(`Parsed ${newEntries.length} entries`);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `profind-entries-${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try { const imported = JSON.parse(evt.target?.result as string); if (Array.isArray(imported)) { setEntries((prev) => [...prev, ...imported]); alert(`Imported ${imported.length} entries`); } } catch { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-sm">Add Providers</h1>
              <p className="text-xs text-text-muted">{entries.length} entries · {savedCount} saved</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setBulkMode(!bulkMode)} className="btn-secondary text-xs !py-1.5 !px-3">Bulk Paste</button>
            <button onClick={handleExport} className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"><Download className="w-3 h-3" /> Export</button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"><Upload className="w-3 h-3" /> Import</button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {bulkMode && (
          <div className="card p-5 border-2 border-brand-green-200 bg-brand-green-50 mb-4">
            <h3 className="font-semibold text-sm mb-2">Bulk Paste — One per line</h3>
            <p className="text-xs text-text-muted mb-3">Format: <code>Name | Phone | Trade | Area | Source</code></p>
            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} className="input-field text-sm font-mono resize-none mb-3" placeholder="Paste data here..." />
            <div className="flex gap-2">
              <button onClick={handleBulkParse} className="btn-primary text-sm">Parse {bulkText.trim().split("\n").filter(Boolean).length} Lines</button>
              <button onClick={() => setBulkMode(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="card border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase">Entries</span>
                <button onClick={() => { const n = emptyEntry(); setEntries((p) => [...p, n]); setActiveIndex(entries.length); }} className="text-brand-green-500 hover:text-brand-green-600"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-50">
                {entries.map((entry, i) => (
                  <button key={entry.id} onClick={() => setActiveIndex(i)}
                    className={`w-full p-3 text-left transition-colors ${i === activeIndex ? "bg-brand-green-50" : "hover:bg-surface-muted"}`}>
                    <div className="flex items-center gap-2">
                      {entry.status === "saved" && <CheckCircle className="w-3.5 h-3.5 text-brand-green-500 flex-shrink-0" />}
                      {entry.status === "error" && <span className="w-3.5 h-3.5 text-red-500 flex-shrink-0">✗</span>}
                      <span className="text-sm font-medium truncate">{entry.name || `Entry ${i + 1}`}</span>
                    </div>
                    {entry.trades.length > 0 && <p className="text-xs text-text-muted mt-0.5 truncate">{entry.trades.join(", ")}</p>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-9 space-y-4">
            {active.status === "saved" && (
              <div className="bg-brand-green-50 border border-brand-green-200 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-green-500" /><span className="text-sm text-brand-green-700 font-medium">Saved to database</span>
              </div>
            )}

            <div className="card p-5 border border-gray-100">
              <h2 className="text-sm font-semibold mb-3">Basic Info</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Name *</label>
                  <input type="text" value={active.name} onChange={(e) => updateActive({ name: e.target.value })} placeholder="e.g. Marcus Williams" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Phone *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">+592</span>
                    <input type="tel" value={active.phone} onChange={(e) => updateActive({ phone: e.target.value })} placeholder="600 1234" className="input-field text-sm !rounded-l-none flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Years Experience</label>
                  <input type="number" value={active.yearsExperience} onChange={(e) => updateActive({ yearsExperience: e.target.value })} placeholder="e.g. 10" className="input-field text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-xs font-medium text-text-secondary mb-1">Price Low (GYD)</label><input type="number" value={active.priceRangeLow} onChange={(e) => updateActive({ priceRangeLow: e.target.value })} placeholder="5000" className="input-field text-sm" /></div>
                  <div><label className="block text-xs font-medium text-text-secondary mb-1">Price High (GYD)</label><input type="number" value={active.priceRangeHigh} onChange={(e) => updateActive({ priceRangeHigh: e.target.value })} placeholder="50000" className="input-field text-sm" /></div>
                </div>
              </div>
            </div>

            <div className="card p-5 border border-gray-100">
              <h2 className="text-sm font-semibold mb-3">Trade(s) *</h2>
              <div className="grid grid-cols-4 gap-2">
                {TRADES.map((t) => (
                  <button key={t.id} type="button" onClick={() => toggleTrade(t.id)}
                    className={`p-2 flex items-center gap-2 rounded-xl border text-xs font-medium transition-all ${active.trades.includes(t.id) ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700" : "border-gray-200 text-text-muted hover:border-gray-300"}`}>
                    <TradeIcon tradeId={t.id} size="sm" showBackground={active.trades.includes(t.id)} /> {t.localName}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5 border border-gray-100">
              <h2 className="text-sm font-semibold mb-3">Areas</h2>
              {Object.entries(areasByRegion).map(([region, areas]) => (
                <div key={region} className="mb-3 last:mb-0">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">{region}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {areas.map((area) => (
                      <button key={area.id} type="button" onClick={() => toggleArea(area.id)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${active.areas.includes(area.id) ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700" : "border-gray-200 text-text-muted hover:border-gray-300"}`}>
                        {area.shortName}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-5 border border-gray-100">
              <h2 className="text-sm font-semibold mb-3">Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                  <textarea value={active.description} onChange={(e) => updateActive({ description: e.target.value })} placeholder="What are they known for?" rows={3} className="input-field text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Services (comma-separated)</label>
                  <input type="text" value={active.servicesOffered} onChange={(e) => updateActive({ servicesOffered: e.target.value })} placeholder="Pipe repair, Drain clearing" className="input-field text-sm" />
                </div>
              </div>
            </div>

            <div className="card p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-sm font-semibold mb-3">Source</h2>
                  <select value={active.source} onChange={(e) => updateActive({ source: e.target.value })} className="input-field text-sm mb-2">
                    <option value="facebook">Facebook Group</option><option value="whatsapp">WhatsApp Forward</option>
                    <option value="google_maps">Google Maps</option><option value="word_of_mouth">Word of Mouth</option>
                    <option value="gcci">GCCI Directory</option><option value="other">Other</option>
                  </select>
                  <input type="text" value={active.sourceDetail} onChange={(e) => updateActive({ sourceDetail: e.target.value })} placeholder="e.g. Georgetown Community Group" className="input-field text-sm" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-3">BIT Certification</h2>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={active.bitCertified} onChange={(e) => updateActive({ bitCertified: e.target.checked })} className="w-4 h-4 accent-brand-green-500" />
                    <span className="text-sm">BIT Certified</span>
                  </label>
                  {active.bitCertified && <input type="text" value={active.bitTrade} onChange={(e) => updateActive({ bitTrade: e.target.value })} placeholder="Certificate trade name" className="input-field text-sm" />}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={active.status === "saved"} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {active.status === "saved" ? "Saved ✓" : "Save to Database"}
              </button>
              <button onClick={handleDelete} className="btn-secondary text-red-500 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
