"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Send,
  CheckCircle,
  Heart,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { AREAS } from "@/lib/data/areas";
import { getAreasByRegion } from "@/lib/data/areas";
import { TradeIcon } from "@/components/ui/TradeIcon";

export default function SuggestPage() {
  const areasByRegion = getAreasByRegion();

  const [providerName, setProviderName] = useState("");
  const [trade, setTrade] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [suggestorName, setSuggestorName] = useState("");
  const [suggestorArea, setSuggestorArea] = useState("");
  const [suggestorPhone, setSuggestorPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !trade || !area) return;

    setSubmitting(true);

    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerName: providerName.trim(),
        trade,
        area,
        phone: phone.trim() || undefined,
        description: description.trim() || undefined,
        suggestedByName: suggestorName.trim() || undefined,
        suggestedByArea: suggestorArea || undefined,
        suggestedByPhone: suggestorPhone.trim() || undefined,
      }),
    });

    if (!res.ok) {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-warm">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-brand-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-brand-green-600 fill-brand-green-600" />
          </div>
          <h1 className="font-display text-2xl mb-2">Big Up! 🇬🇾</h1>
          <p className="text-text-secondary mb-2">
            You just helped your neighbours find a good{" "}
            <strong>
              {TRADES.find((t) => t.id === trade)?.localName.toLowerCase()}
            </strong>
            .
          </p>
          <p className="text-sm text-text-muted mb-8">
            We&apos;ll review and add <strong>{providerName}</strong> to ProFind
            shortly. Thanks for growing the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setProviderName("");
                setTrade("");
                setArea("");
                setPhone("");
                setDescription("");
              }}
              className="btn-primary text-sm"
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Suggest Another
            </button>
            <Link href="/search" className="btn-secondary text-sm">
              Find Tradespeople
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="p-1 -ml-1 text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-sm">Suggest a Tradesperson</h1>
            <p className="text-xs text-text-muted">
              Know somebody good? Help your neighbours find them.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Quick trade selection */}
        {!trade && (
          <div className="mb-6">
            <p className="text-sm font-medium text-text-secondary mb-3">
              What kind of tradesperson?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TRADES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrade(t.id)}
                  className="card p-3 flex items-center gap-3 border border-gray-100 hover:border-brand-green-200 transition-colors text-left"
                >
                  <TradeIcon tradeId={t.id} size="sm" />
                  <span className="text-sm font-medium">{t.localName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form (shown after trade selected or always accessible) */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Who are you suggesting */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-text-muted" />
              Who are you suggesting?
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Their Name *
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Marcus Williams"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Their Trade *
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRADES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTrade(t.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        trade === t.id
                          ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700 font-medium"
                          : "border-gray-200 text-text-muted hover:border-gray-300"
                      }`}
                    >
                      {t.localName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Where do they work? *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="input-field text-sm"
                  required
                >
                  <option value="">Select area</option>
                  {Object.entries(areasByRegion).map(([region, areas]) => (
                    <optgroup key={region} label={region}>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Their Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                    +592
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="600 1234"
                    className="input-field text-sm !rounded-l-none flex-1"
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Optional — helps us reach out to get them listed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What work did they do for you?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Fixed my kitchen pipe, was very professional and charged a fair price."
                  rows={3}
                  className="input-field text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Your Details */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-1">Your Details</h2>
            <p className="text-xs text-text-muted mb-3">
              Optional — so we can credit you as the referral source.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={suggestorName}
                  onChange={(e) => setSuggestorName(e.target.value)}
                  placeholder="Your name"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Area
                </label>
                <select
                  value={suggestorArea}
                  onChange={(e) => setSuggestorArea(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Select your area</option>
                  {Object.entries(areasByRegion).map(([region, areas]) => (
                    <optgroup key={region} label={region}>
                      {areas.map((a) => (
                        <option key={a.id} value={a.shortName}>
                          {a.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                    +592
                  </span>
                  <input
                    type="tel"
                    value={suggestorPhone}
                    onChange={(e) => setSuggestorPhone(e.target.value)}
                    placeholder="600 1234"
                    className="input-field text-sm !rounded-l-none flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !providerName.trim() || !trade || !area || submitting
            }
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Suggest {providerName || "Tradesperson"}
              </>
            )}
          </button>

          <p className="text-xs text-text-muted text-center">
            Suggestions are reviewed before being added. We may reach out
            to the tradesperson to verify.
          </p>
        </form>
      </div>
    </div>
  );
}
