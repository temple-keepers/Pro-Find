"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Send,
  CheckCircle,
  MapPin,
  DollarSign,
} from "lucide-react";
import { SEED_PROVIDERS } from "@/lib/data/seed-providers";
import { getTradeById } from "@/lib/data/trades";
import { AREAS } from "@/lib/data/areas";

export default function ReviewPage({
  params,
}: {
  params: { providerId: string };
}) {
  const router = useRouter();
  const provider = SEED_PROVIDERS.find((p) => p.id === params.providerId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerPhone, setReviewerPhone] = useState("");
  const [reviewerArea, setReviewerArea] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!provider) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Provider not found</p>
          <Link href="/search" className="btn-primary text-sm">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const primaryTrade = getTradeById(provider.trades[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewerName.trim() || !reviewerPhone.trim()) return;

    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: provider.id,
        reviewerName: reviewerName.trim(),
        reviewerPhone: reviewerPhone.trim(),
        reviewerArea: reviewerArea || undefined,
        rating,
        reviewText: reviewText.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        pricePaid: pricePaid || undefined,
        wouldRecommend: wouldRecommend ?? true,
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
            <CheckCircle className="w-8 h-8 text-brand-green-600" />
          </div>
          <h1 className="font-display text-2xl mb-2">Thank You!</h1>
          <p className="text-text-secondary mb-2">
            Your review of <strong>{provider.name}</strong> has been submitted.
          </p>
          <p className="text-sm text-text-muted mb-8">
            Reviews help your neighbours find trustworthy tradespeople. Every one counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/provider/${provider.id}`}
              className="btn-primary text-sm"
            >
              View {provider.name}&apos;s Profile
            </Link>
            <Link href="/search" className="btn-secondary text-sm">
              Find More Tradespeople
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
            href={`/provider/${provider.id}`}
            className="p-1 -ml-1 text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-sm">
              Review {provider.name}
            </h1>
            <p className="text-xs text-text-muted">
              {primaryTrade?.localName}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div className="card p-5 border border-gray-100">
            <label className="block text-sm font-semibold mb-3">
              How would you rate {provider.name}? *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      value <= (hoverRating || rating)
                        ? "text-brand-gold-500 fill-brand-gold-500"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-text-muted mt-2">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Good"}
                {rating === 3 && "Average"}
                {rating === 2 && "Below average"}
                {rating === 1 && "Poor"}
              </p>
            )}
          </div>

          {/* Your Details */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Your Details</h2>
            <p className="text-xs text-text-muted mb-4">
              Real names build trust. Your name and area will be shown publicly.
              Your phone is kept private — used only to verify the review.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Sandra Gonsalves"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                    +592
                  </span>
                  <input
                    type="tel"
                    value={reviewerPhone}
                    onChange={(e) => setReviewerPhone(e.target.value)}
                    placeholder="600 1234"
                    className="input-field text-sm !rounded-l-none flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Private — only used for verification. Never shown publicly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Your Area
                </label>
                <select
                  value={reviewerArea}
                  onChange={(e) => setReviewerArea(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Select your area</option>
                  {AREAS.map((area) => (
                    <option key={area.id} value={area.shortName}>
                      {area.name} — {area.region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">About the Job</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What work did they do?
                </label>
                <input
                  type="text"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. Fixed leaking pipe in bathroom"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  How much did you pay? (GYD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="number"
                    value={pricePaid}
                    onChange={(e) => setPricePaid(e.target.value)}
                    placeholder="e.g. 15000"
                    className="input-field text-sm !pl-9"
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Helps others know what to expect. Shown publicly.
                </p>
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Your Review</h2>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What was your experience? Were they on time? Was the work good? Would you call them again?"
              rows={4}
              className="input-field text-sm resize-none"
            />

            {/* Would Recommend */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Would you recommend {provider.name}?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    wouldRecommend === true
                      ? "bg-brand-green-50 border-brand-green-300 text-brand-green-700"
                      : "border-gray-200 text-text-muted hover:border-gray-300"
                  }`}
                >
                  👍 Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    wouldRecommend === false
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "border-gray-200 text-text-muted hover:border-gray-300"
                  }`}
                >
                  👎 No
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              rating === 0 ||
              !reviewerName.trim() ||
              !reviewerPhone.trim() ||
              submitting
            }
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>

          <p className="text-xs text-text-muted text-center">
            By submitting, you confirm this is a genuine review based on real
            work done. Fake reviews will be removed.
          </p>
        </form>
      </div>
    </div>
  );
}
