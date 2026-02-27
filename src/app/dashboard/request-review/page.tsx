"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Star,
  Copy,
  CheckCircle,
} from "lucide-react";
import { SEED_PROVIDERS } from "@/lib/data/seed-providers";
import { getReviewRequestLink } from "@/lib/utils/whatsapp";

const DEMO_PROVIDER = SEED_PROVIDERS.find((p) => p.isClaimed) || SEED_PROVIDERS[0];

export default function RequestReviewPage() {
  const provider = DEMO_PROVIDER;
  const reviewUrl = `https://profindguyana.com/review/${provider.id}`;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendWhatsApp = () => {
    if (!customerPhone.trim()) return;
    const link = getReviewRequestLink(customerPhone, provider.name, reviewUrl);
    window.open(link, "_blank");
    setSent(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1 -ml-1 text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-sm">Request a Review</h1>
            <p className="text-xs text-text-muted">
              Ask a past customer to leave a review
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Why reviews matter */}
        <div className="card p-4 border border-brand-gold-200 bg-brand-gold-50">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-brand-gold-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">
                Reviews are your best marketing
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Providers with 5+ reviews get 3× more WhatsApp contacts.
                Ask every satisfied customer — most are happy to help if you
                make it easy.
              </p>
            </div>
          </div>
        </div>

        {/* Send via WhatsApp */}
        <div className="card p-5 border border-gray-100">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-text-muted" />
            Send via WhatsApp
          </h2>
          <p className="text-xs text-text-muted mb-4">
            We&apos;ll pre-fill a polite message with your review link. Just hit
            send.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sandra Gonsalves"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Customer Phone *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                  +592
                </span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="600 1234"
                  className="input-field text-sm !rounded-l-none flex-1"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-surface-warm rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-text-muted mb-1 font-medium">
                Message preview:
              </p>
              <p className="text-sm text-text-secondary">
                &quot;Hi! Thanks for using my services. If you have a minute,
                I&apos;d appreciate a review on ProFind Guyana — it helps me get
                more work. Just tap here: {reviewUrl}&quot;
              </p>
            </div>

            <button
              onClick={handleSendWhatsApp}
              disabled={!customerPhone.trim()}
              className="btn-whatsapp w-full justify-center disabled:opacity-50"
            >
              <MessageCircle className="w-4 h-4" />
              Send Review Request
            </button>

            {sent && (
              <div className="flex items-center gap-2 text-brand-green-600 justify-center">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">WhatsApp opened!</span>
              </div>
            )}
          </div>
        </div>

        {/* Copy Link */}
        <div className="card p-5 border border-gray-100">
          <h2 className="text-sm font-semibold mb-3">Or Copy Your Review Link</h2>
          <p className="text-xs text-text-muted mb-3">
            Share this link anywhere — Facebook, text message, or in person.
          </p>

          <div className="flex gap-2">
            <div className="input-field text-sm flex-1 bg-surface-warm truncate">
              {reviewUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`btn-secondary !py-2 !px-3 flex items-center gap-1.5 text-xs whitespace-nowrap ${
                copied ? "!bg-brand-green-50 !text-brand-green-600 !border-brand-green-200" : ""
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="card p-5 border border-gray-100">
          <h2 className="text-sm font-semibold mb-3">Tips for Getting Reviews</h2>
          <div className="space-y-2.5">
            {[
              "Ask right after finishing a job — that's when they're happiest",
              "Send the WhatsApp message while you're still there in person",
              "A simple 'Could you leave me a review?' works best",
              "Don't offer discounts for reviews — keeps them genuine",
              "Thank them after they review — builds the relationship",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-brand-green-500 font-bold text-xs mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-sm text-text-secondary">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
