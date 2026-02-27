"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  FileText,
  BarChart3,
  Clock,
  GraduationCap,
  CheckCircle,
  Star,
  Send,
  Wrench,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion } from "@/lib/data/areas";
import { TradeIcon } from "@/components/ui/TradeIcon";

export default function ClaimPage() {
  const areasByRegion = getAreasByRegion();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hasBitCert, setHasBitCert] = useState(false);
  const [bitTrade, setBitTrade] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTrade = (id: string) => {
    setSelectedTrades((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || selectedTrades.length === 0 || selectedAreas.length === 0) return;

    setSubmitting(true);

    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        trades: selectedTrades,
        areas: selectedAreas,
        description: description.trim() || undefined,
        yearsExperience: yearsExperience || undefined,
        hasBitCert,
        bitTrade: bitTrade.trim() || undefined,
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
          <div className="w-16 h-16 bg-brand-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-brand-gold-700" />
          </div>
          <h1 className="font-display text-2xl mb-2">Welcome to ProFind! 🇬🇾</h1>
          <p className="text-text-secondary mb-2">
            Your profile is being set up, <strong>{name}</strong>.
          </p>
          <p className="text-sm text-text-muted mb-8">
            We&apos;ll verify your details and activate your full dashboard with
            quote tools, job tracker, and availability toggle. You&apos;ll get a
            WhatsApp message when it&apos;s ready.
          </p>

          <div className="card p-5 border border-gray-100 text-left mb-8">
            <h3 className="font-semibold text-sm mb-3">
              What you get (all free):
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: Star, text: "Professional profile page with your reviews" },
                { icon: FileText, text: "Quick Quote tool — generate quotes on your phone" },
                { icon: BarChart3, text: "Job tracker — show customers your progress" },
                { icon: Clock, text: '"Available Now" toggle — tell customers you\'re taking work' },
                { icon: GraduationCap, text: "BIT Certified badge (if applicable)" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-brand-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-green-600" />
                  </div>
                  <p className="text-sm text-text-secondary">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <Link href="/search" className="btn-secondary text-sm">
            Browse ProFind
          </Link>
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
            <h1 className="font-semibold text-sm">
              Claim Your Free Profile
            </h1>
            <p className="text-xs text-text-muted">
              Get found by more customers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Benefits banner */}
        <div className="card p-4 border border-brand-gold-200 bg-brand-gold-50 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-brand-gold-800" />
            </div>
            <div>
              <p className="text-sm font-semibold">100% Free. No catch.</p>
              <p className="text-xs text-text-secondary">
                Professional profile, quote tool, job tracker, and review
                collection — all free.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Your Details</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kevin Persaud"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  WhatsApp Number *
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
                    required
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Customers will contact you on this number via WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g. 10"
                  className="input-field text-sm"
                  min="0"
                  max="60"
                />
              </div>
            </div>
          </div>

          {/* Trade Selection */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-1">Your Trade(s) *</h2>
            <p className="text-xs text-text-muted mb-3">
              Select all that apply.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {TRADES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTrade(t.id)}
                  className={`p-3 flex items-center gap-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedTrades.includes(t.id)
                      ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700"
                      : "border-gray-200 text-text-muted hover:border-gray-300"
                  }`}
                >
                  <TradeIcon
                    tradeId={t.id}
                    size="sm"
                    showBackground={selectedTrades.includes(t.id)}
                  />
                  {t.localName}
                  {selectedTrades.includes(t.id) && (
                    <CheckCircle className="w-4 h-4 ml-auto text-brand-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-1">Areas You Cover *</h2>
            <p className="text-xs text-text-muted mb-3">
              Select all areas you&apos;re willing to work in.
            </p>

            {Object.entries(areasByRegion).map(([region, areas]) => (
              <div key={region} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {region}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleArea(area.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                        selectedAreas.includes(area.id)
                          ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700 font-medium"
                          : "border-gray-200 text-text-muted hover:border-gray-300"
                      }`}
                    >
                      {area.shortName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-1">About You</h2>
            <p className="text-xs text-text-muted mb-3">
              Tell customers what makes you the right choice.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 15 years experience in residential plumbing. I specialize in bathroom renovations and emergency repairs. I show up when I say I will."
              rows={4}
              className="input-field text-sm resize-none"
            />
          </div>

          {/* BIT Certification */}
          <div className="card p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setHasBitCert(!hasBitCert)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  hasBitCert
                    ? "bg-brand-gold-500 border-brand-gold-500"
                    : "border-gray-300"
                }`}
              >
                {hasBitCert && (
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <div>
                <p className="text-sm font-semibold">
                  I have a BIT Certificate
                </p>
                <p className="text-xs text-text-muted">
                  Board of Industrial Training certification. We&apos;ll add a
                  verified badge to your profile.
                </p>
              </div>
            </div>

            {hasBitCert && (
              <div className="mt-3 ml-8">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What trade was your BIT certificate in?
                </label>
                <input
                  type="text"
                  value={bitTrade}
                  onChange={(e) => setBitTrade(e.target.value)}
                  placeholder="e.g. Plumbing, Electrical Installation"
                  className="input-field text-sm"
                />
                <p className="text-xs text-text-muted mt-1">
                  You&apos;ll be asked to upload a photo of your certificate later.
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !name.trim() ||
              !phone.trim() ||
              selectedTrades.length === 0 ||
              selectedAreas.length === 0 ||
              submitting
            }
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="animate-pulse">Setting up your profile...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Claim My Free Profile
              </>
            )}
          </button>

          <p className="text-xs text-text-muted text-center">
            By claiming, you agree that you are a real tradesperson and the
            information you provide is accurate.
          </p>
        </form>
      </div>
    </div>
  );
}
