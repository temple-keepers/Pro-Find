import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Star,
  MessageSquare,
  Shield,
  UserPlus,
  ArrowRight,
  Heart,
  Wrench,
  Camera,
  DollarSign,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About ProFind — Guyana's Trust Engine for Trades",
  description:
    "ProFind connects Guyanese with trusted tradespeople. Real reviews, transparent pricing, one-tap WhatsApp contact. Built for Guyana, by Guyana.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #002312 0%, #003d1e 25%, #009E49 60%, #006a32 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(252,209,22,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,200,80,0.15) 0%, transparent 40%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl md:text-4xl mb-3">
            We&apos;re solving Guyana&apos;s
            <br />
            contractor trust problem.
          </h1>
          <p className="text-green-200/90 text-lg max-w-xl mx-auto leading-relaxed">
            Too many people get burned by tradespeople who take deposits and
            disappear, do shoddy work, or overcharge. ProFind makes it easy to
            find people your neighbours actually trust.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl mb-4">The problem we saw</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Finding a reliable tradesperson in Guyana usually means asking around
          on WhatsApp groups, posting in Facebook communities, or taking a
          chance on someone you found through a friend of a friend. Sometimes it
          works out. Too often, it doesn&apos;t.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          People pay deposits that vanish. Work gets done half-way and abandoned.
          Prices quoted over the phone double once the job starts. And the
          worst part? There&apos;s no accountability — the same contractors keep
          getting work because there&apos;s nowhere to check their track record.
        </p>
        <p className="text-text-secondary leading-relaxed">
          ProFind is here to change that. We&apos;re building a directory where
          trust is visible — where you can see who recommended someone, what work
          they actually did, and what they actually charged.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-surface-muted py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl mb-8 text-center">
            How ProFind works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-brand-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Search by trade or problem</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Type what you need — &ldquo;leaking pipe&rdquo;,
                  &ldquo;AC not cooling&rdquo;, &ldquo;need a gate welded&rdquo;
                  — and we&apos;ll match you to the right tradespeople in your
                  area.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-brand-gold-700" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Check real reviews</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Every review shows who wrote it and where they live. No
                  anonymous ratings. You can see actual prices paid and photos
                  of completed work.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">One tap to WhatsApp</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  No accounts, no login, no forms. Find who you need and
                  you&apos;re talking to them on WhatsApp in seconds. That&apos;s
                  it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl mb-8 text-center">
          What makes ProFind different
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-5 border border-gray-100">
            <Camera className="w-6 h-6 text-brand-green-500 mb-3" />
            <h3 className="font-semibold text-sm mb-1">
              Real photos, not stock images
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Customers upload photos of actual completed work. You see what the
              tradesperson really does, not a marketing image.
            </p>
          </div>
          <div className="card p-5 border border-gray-100">
            <DollarSign className="w-6 h-6 text-brand-green-500 mb-3" />
            <h3 className="font-semibold text-sm mb-1">
              Transparent pricing
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Reviews show what people actually paid. No more guessing whether a
              quote is fair — see what your neighbours paid for similar work.
            </p>
          </div>
          <div className="card p-5 border border-gray-100">
            <UserPlus className="w-6 h-6 text-brand-green-500 mb-3" />
            <h3 className="font-semibold text-sm mb-1">
              Community-powered
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Anyone can suggest a tradesperson they trust. The directory grows
              through word-of-mouth — the same way it works in real life, just
              made searchable.
            </p>
          </div>
          <div className="card p-5 border border-gray-100">
            <Shield className="w-6 h-6 text-brand-green-500 mb-3" />
            <h3 className="font-semibold text-sm mb-1">
              BIT certification badges
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tradespeople with Board of Industrial Training certification get a
              visible badge. Training matters — it should be easy to see.
            </p>
          </div>
        </div>
      </section>

      {/* For Tradespeople */}
      <section className="bg-brand-gold-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-gold-200 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-brand-gold-800" />
            </div>
            <h2 className="font-display text-2xl">For tradespeople</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6">
            ProFind isn&apos;t just for customers. We built tools for
            tradespeople too — because the best tradespeople deserve a way to
            stand out.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">
              ✓ Free professional profile that customers can find
            </p>
            <p className="text-sm text-text-secondary">
              ✓ Quick Quote tool to send professional estimates via WhatsApp
            </p>
            <p className="text-sm text-text-secondary">
              ✓ Job tracker to manage work from deposit to completion
            </p>
            <p className="text-sm text-text-secondary">
              ✓ Availability toggle so customers know when you&apos;re free
            </p>
            <p className="text-sm text-text-secondary">
              ✓ Review collection to build your reputation
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/claim"
              className="btn-primary inline-flex items-center gap-2"
            >
              Claim Your Free Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto px-4 py-14 text-center">
        <Heart className="w-8 h-8 text-brand-red-500 mx-auto mb-3 fill-brand-red-500" />
        <h2 className="font-display text-2xl mb-2">Help us grow</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
          ProFind gets better with every tradesperson added and every review
          written. Know somebody good? Help your neighbours find them.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/suggest"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Suggest a Tradesperson
          </Link>
          <Link
            href="/search"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Browse the Directory
          </Link>
        </div>
      </section>
    </div>
  );
}
