"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Loader2, Phone, User, MapPin, FileText, DollarSign, Clock, Star, ShieldCheck, Shield, Award } from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion } from "@/lib/data/areas";

interface AnonymizedMatch {
  avgRating: number;
  reviewCount: number;
  yearsExperience?: number;
  isVerified: boolean;
  idVerified: boolean;
}

const BUDGET_RANGES = [
  { id: "under_50k", label: "Under $50,000" },
  { id: "50k_100k", label: "$50,000 – $100,000" },
  { id: "100k_250k", label: "$100,000 – $250,000" },
  { id: "250k_500k", label: "$250,000 – $500,000" },
  { id: "500k_plus", label: "$500,000+" },
  { id: "not_sure", label: "Not sure yet" },
];

const URGENCY_OPTIONS = [
  { id: "urgent", label: "🔴 Urgent — need someone today", color: "text-red-600" },
  { id: "this_week", label: "🟡 This week", color: "text-yellow-600" },
  { id: "this_month", label: "🟢 This month", color: "text-green-600" },
  { id: "flexible", label: "⚪ Flexible / just getting quotes", color: "text-gray-500" },
];

function RequestQuoteForm() {
  const searchParams = useSearchParams();
  const areasByRegion = getAreasByRegion();
  const [submitted, setSubmitted] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [matchedProviders, setMatchedProviders] = useState<AnonymizedMatch[]>([]);

  // Pre-fill from URL params (e.g. from provider profile "Get Quote" button)
  const tradeParam = searchParams.get("trade") || "";
  const providerParam = searchParams.get("provider") || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [trade, setTrade] = useState(tradeParam);
  const [description, setDescription] = useState(
    providerParam ? `Quote request for ${providerParam}` : ""
  );
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState("flexible");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) { setError("Your name is required"); return; }
    if (!phone.trim() || phone.trim().length < 7) { setError("Valid WhatsApp number required"); return; }
    if (!trade) { setError("Select what trade you need"); return; }
    if (!description.trim()) { setError("Describe the job so pros can give accurate quotes"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerArea: area || null,
          trade,
          jobDescription: description.trim(),
          budgetRange: budget || null,
          urgency,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      setMatchCount(data.matchCount || 0);
      setMatchedProviders(data.matchedProviders || []);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(false);
  };

  if (submitted) {
    const tradeName = TRADES.find((t) => t.id === trade)?.localName || "tradesperson";

    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-brand-green-500" />
            </div>
            {matchCount > 0 ? (
              <>
                <h1 className="font-display text-2xl mb-2">
                  Matched with {matchCount} Verified {tradeName}{matchCount > 1 ? "s" : ""}!
                </h1>
                <p className="text-sm text-text-secondary">
                  We found {matchCount} verified {tradeName}{matchCount > 1 ? "s" : ""} in your area. They&apos;ll review your job and reach out via WhatsApp.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl mb-2">Quote Request Sent!</h1>
                <p className="text-sm text-text-secondary">
                  Pro tradespeople in your area will see your request and reach out via WhatsApp. Expect responses within a few hours.
                </p>
              </>
            )}
          </div>

          {/* Matched provider cards (anonymized — no names/phones) */}
          {matchedProviders.length > 0 && (
            <div className="space-y-3 mb-8">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider text-center">
                Your Matched Pros
              </p>
              {matchedProviders.map((p, idx) => (
                <div
                  key={idx}
                  className="card p-4 border border-gray-100 flex items-center gap-4"
                >
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-brand-green-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-brand-green-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">Pro #{idx + 1}</span>
                      {p.idVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
                          <ShieldCheck className="w-3 h-3" /> ID Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-gold-500 fill-brand-gold-500" />
                        {p.avgRating.toFixed(1)}
                      </span>
                      <span>{p.reviewCount} review{p.reviewCount !== 1 ? "s" : ""}</span>
                      {p.yearsExperience && (
                        <span>{p.yearsExperience}yr exp</span>
                      )}
                    </div>
                  </div>

                  <Award className="w-5 h-5 text-brand-gold-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* What happens next */}
          <div className="card p-5 border border-brand-green-200 bg-brand-green-50/50 mb-6">
            <p className="font-semibold text-sm mb-2">What happens next?</p>
            <ol className="text-sm text-text-secondary space-y-1.5 list-decimal list-inside">
              <li>Matched pros review your job details</li>
              <li>They contact you via WhatsApp with quotes</li>
              <li>You compare and choose — no obligation</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Link href="/" className="btn-secondary text-sm">Back to Home</Link>
            <Link href="/search" className="btn-primary text-sm">Browse Tradespeople</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-50" aria-label="Back to home">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold">Get 3 Free Quotes</h1>
            <p className="text-xs text-text-muted">Describe your job, get matched with verified pros</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Callout */}
        <div className="card p-4 border border-brand-green-200 bg-brand-green-50/50 mb-6">
          <p className="text-sm text-brand-green-800">
            <strong>How it works:</strong> Describe your job and we&apos;ll match you with up to 3 verified tradespeople. They&apos;ll contact you via WhatsApp with quotes. Free — no obligation.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
          </div>
        )}

        <div className="space-y-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quote-name" className="block text-sm font-medium mb-1.5">Your Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="quote-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-field !pl-10" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label htmlFor="quote-phone" className="block text-sm font-medium mb-1.5">WhatsApp # *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="quote-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="input-field !pl-10" placeholder="600 1234" />
              </div>
            </div>
          </div>

          {/* Area */}
          <div>
            <label htmlFor="quote-area" className="block text-sm font-medium mb-1.5">Your Area</label>
            <select id="quote-area" value={area} onChange={(e) => setArea(e.target.value)} className="input-field">
              <option value="">Select area...</option>
              {Object.entries(areasByRegion).map(([region, areas]) => (
                <optgroup key={region} label={region}>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.shortName}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Trade */}
          <div>
            <label className="block text-sm font-medium mb-1.5">What do you need? *</label>
            <div className="grid grid-cols-2 gap-2">
              {TRADES.map((t) => (
                <button key={t.id} type="button" onClick={() => setTrade(t.id)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-2 ${
                    trade === t.id
                      ? "border-brand-green-400 bg-brand-green-50 text-brand-green-700 ring-1 ring-brand-green-200"
                      : "border-gray-200 hover:border-gray-300 text-text-secondary"
                  }`}>
                  <span>{t.icon}</span> {t.localName}
                </button>
              ))}
            </div>
          </div>

          {/* Job description */}
          <div>
            <label htmlFor="quote-description" className="block text-sm font-medium mb-1.5">Describe the Job *</label>
            <textarea id="quote-description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="e.g. I need to install a new kitchen sink and fix a leaking pipe under the bathroom. House is in Bel Air." maxLength={1000} />
            <p className="text-xs text-text-muted mt-1">The more detail, the better quotes you'll get</p>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Budget Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_RANGES.map((b) => (
                <button key={b.id} type="button" onClick={() => setBudget(b.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    budget === b.id
                      ? "border-brand-green-400 bg-brand-green-50 text-brand-green-700"
                      : "border-gray-200 text-text-secondary hover:border-gray-300"
                  }`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> How urgent?
            </label>
            <div className="space-y-2">
              {URGENCY_OPTIONS.map((u) => (
                <button key={u.id} type="button" onClick={() => setUrgency(u.id)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-left text-sm transition-all ${
                    urgency === u.id
                      ? "border-brand-green-400 bg-brand-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary w-full !py-3.5 text-base flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> :
              <><Send className="w-4 h-4" /> Send Quote Request</>}
          </button>

          <p className="text-xs text-text-muted text-center">
            Free & no obligation. Pro tradespeople will WhatsApp you directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-warm flex items-center justify-center">
          <div className="animate-pulse text-text-muted">Loading...</div>
        </div>
      }
    >
      <RequestQuoteForm />
    </Suspense>
  );
}
