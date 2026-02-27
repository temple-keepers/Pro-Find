import { TRADES } from "@/lib/data/trades";
import { getTradeById } from "@/lib/data/trades";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { HeroSearch } from "@/components/search/HeroSearch";
import { fetchRecentReviews } from "@/lib/data";
import { StarRating } from "@/components/ui/StarRating";
import Link from "next/link";
import {
  UserPlus, Shield, Star, ArrowRight, Camera, CheckCircle, Sparkles,
  MessageCircle, Search, ShoppingBag, Zap, Users, DollarSign,
  MapPin, Phone, ChevronDown,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Static data
   ────────────────────────────────────────────── */

const MARQUEE_ROW_1 = [
  { text: "Leaking pipe", emoji: "🔧" },
  { text: "AC not cooling", emoji: "❄️" },
  { text: "Power outage in house", emoji: "⚡" },
  { text: "Build wardrobe", emoji: "🪚" },
  { text: "Fix cracked wall", emoji: "🧱" },
  { text: "Paint house exterior", emoji: "🎨" },
  { text: "Build gate", emoji: "🔩" },
  { text: "Car not starting", emoji: "🚗" },
  { text: "Toilet not flushing", emoji: "🔧" },
  { text: "Breaker keeps tripping", emoji: "⚡" },
];

const MARQUEE_ROW_2 = [
  { text: "Blocked drain", emoji: "🔧" },
  { text: "Install ceiling fan", emoji: "⚡" },
  { text: "AC leaking water", emoji: "❄️" },
  { text: "Kitchen cabinets", emoji: "🪚" },
  { text: "Tiling work", emoji: "🧱" },
  { text: "Waterproofing", emoji: "🎨" },
  { text: "Burglar bars", emoji: "🔩" },
  { text: "Brake repair", emoji: "🚗" },
  { text: "Bathroom renovation", emoji: "🔧" },
  { text: "Generator hookup", emoji: "⚡" },
];

const FAQ_ITEMS = [
  {
    q: "Is ProFind free to use?",
    a: "Yes, completely. Searching for tradespeople, reading reviews, and contacting them via WhatsApp is 100% free. We never charge customers.",
  },
  {
    q: "How do I know the reviews are real?",
    a: "Every review on ProFind shows the reviewer's real name and area. We don't allow anonymous reviews. This means you can trace each review back to a real person in your community.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can search, browse profiles, read reviews, and WhatsApp tradespeople without creating an account. If you want to leave a review or request a quote, just enter your name and phone.",
  },
  {
    q: "How do tradespeople get listed on ProFind?",
    a: "Tradespeople can sign up for a free profile, or community members can suggest someone they trust. We verify phone numbers and encourage BIT (Board of Industrial Training) certification uploads.",
  },
  {
    q: "What areas does ProFind cover?",
    a: "ProFind covers all of Guyana — Georgetown, East Coast Demerara, West Coast Demerara, East Bank Demerara, Berbice, Essequibo, and more. We're growing across every region.",
  },
  {
    q: "How does the Price Guide work?",
    a: "Our Price Guide shows typical price ranges for 70+ common jobs across all trades. Prices are sourced from real customer reviews and updated regularly to reflect what tradespeople actually charge in Guyana.",
  },
];

/* ──────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────── */

export default async function HomePage() {
  let recentReviews: Awaited<ReturnType<typeof fetchRecentReviews>> = [];
  try {
    recentReviews = await fetchRecentReviews(6);
  } catch {
    // Non-critical — page still renders
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============================================ */}
      {/* HERO — Immersive full-viewport experience    */}
      {/* ============================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #001a0d 0%, #002e18 20%, #009E49 55%, #007a3a 80%, #003d1e 100%)",
        }}
      >
        {/* Radial color washes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 50%, rgba(252,209,22,0.14) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 85% 15%, rgba(0,220,90,0.18) 0%, transparent 40%), " +
              "radial-gradient(ellipse at 50% 90%, rgba(206,17,38,0.06) 0%, transparent 40%)",
          }}
        />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Soft glow orbs */}
        <div className="absolute -top-10 -left-20 w-72 h-72 rounded-full bg-brand-gold-400/[0.07] blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-green-300/[0.1] blur-3xl" />

        {/* Floating trade icons — subtle depth layer */}
        <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
          <span className="absolute top-[18%] left-[8%] text-3xl opacity-[0.07] animate-float">🔧</span>
          <span className="absolute top-[25%] right-[10%] text-2xl opacity-[0.06] animate-float" style={{ animationDelay: "1s" }}>⚡</span>
          <span className="absolute bottom-[30%] left-[12%] text-2xl opacity-[0.06] animate-float" style={{ animationDelay: "2s" }}>❄️</span>
          <span className="absolute bottom-[25%] right-[14%] text-3xl opacity-[0.07] animate-float" style={{ animationDelay: "3s" }}>🪚</span>
          <span className="absolute top-[50%] left-[4%] text-xl opacity-[0.05] animate-float" style={{ animationDelay: "1.5s" }}>🧱</span>
          <span className="absolute top-[45%] right-[5%] text-xl opacity-[0.05] animate-float" style={{ animationDelay: "2.5s" }}>🎨</span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-28 md:pt-24 md:pb-36">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] rounded-full px-5 py-2 text-sm text-green-200">
              <Sparkles className="w-4 h-4 text-brand-gold-400" />
              <span>Guyana&apos;s #1 trades directory</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white text-center mb-5 animate-fade-up leading-[1.1] drop-shadow-sm">
            What you need{" "}
            <span className="text-brand-gold-400 drop-shadow-md">fix?</span>
          </h1>
          <p className="text-green-200/90 text-center mb-10 text-lg md:text-xl max-w-2xl mx-auto animate-fade-up-delay-1 leading-relaxed">
            Find trusted tradespeople in Georgetown and across Guyana.
            <br className="hidden md:block" />
            Rated by your neighbours. One tap to WhatsApp.
          </p>

          {/* Search */}
          <div className="animate-fade-up-delay-2 relative">
            <div className="absolute inset-0 -m-3 rounded-[2rem] bg-white/[0.04] animate-pulse-slow pointer-events-none" />
            <HeroSearch />
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-green-300/80 text-sm animate-fade-up-delay-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-gold-400" /> 50+ verified providers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-gold-400" /> 8 trade categories
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-gold-400" /> 100% free to search
            </span>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-14">
            <path d="M0 56h1440V28c-200 22-460 28-720 28S200 50 0 28v28z" fill="#FAFAF7" />
          </svg>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROBLEM MARQUEE — Kinetic scroll-stopper     */}
      {/* ============================================ */}
      <section className="py-8 overflow-hidden">
        <p className="text-center text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-5">
          People are searching for
        </p>

        {/* Row 1 — scrolls left */}
        <div className="mb-3">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2.5 mx-1.5 bg-white rounded-full border border-gray-100 text-sm font-medium text-text-secondary shadow-sm hover:border-brand-green-200 hover:shadow-md transition-all cursor-default"
              >
                <span className="text-base">{item.emoji}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right (reversed) */}
        <div>
          <div className="animate-marquee-reverse flex whitespace-nowrap">
            {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2.5 mx-1.5 bg-white rounded-full border border-gray-100 text-sm font-medium text-text-secondary shadow-sm hover:border-brand-green-200 hover:shadow-md transition-all cursor-default"
              >
                <span className="text-base">{item.emoji}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* CTA below marquee */}
        <p className="text-center text-sm text-text-muted mt-6">
          Sound familiar?{" "}
          <Link href="/search" className="text-brand-green-600 font-semibold hover:underline">
            Find help in 60 seconds →
          </Link>
        </p>
      </section>

      {/* ============================================ */}
      {/* TRADE CATEGORIES — Rich browsable grid       */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        {/* Decorative heading with flanking lines */}
        <div className="flex items-center gap-4 justify-center mb-4">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-brand-green-300" />
          <h2 className="font-display text-2xl md:text-3xl text-center">Browse by Trade</h2>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-brand-green-300" />
        </div>
        <p className="text-center text-text-secondary text-sm mb-10 max-w-lg mx-auto">
          8 trade categories covering every home repair and building need in Guyana.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRADES.map((trade) => (
            <Link
              key={trade.id}
              href={`/trades/${trade.id}`}
              className="card p-5 flex flex-col items-center gap-2.5 border border-gray-100/80 hover:border-brand-green-200 hover:shadow-glow-green transition-all group text-center"
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <TradeIcon tradeId={trade.id} size="lg" />
              </div>
              <span className="font-bold text-sm text-text-primary">{trade.localName}</span>
              {/* Preview of top problems */}
              <div className="flex flex-wrap justify-center gap-1">
                {trade.problems.slice(0, 2).map((p, j) => (
                  <span
                    key={j}
                    className="text-[10px] text-text-muted bg-gray-50 px-2 py-0.5 rounded-full leading-tight"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* SOCIAL PROOF — Numbers bar                   */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,158,73,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(252,209,22,0.06),transparent_50%)]" />
          {[
            { value: "50+", label: "Tradespeople", icon: Users },
            { value: "8", label: "Trade Categories", icon: Zap },
            { value: "6", label: "Regions Covered", icon: MapPin },
            { value: "Free", label: "To Search & Contact", icon: Phone },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="relative">
                <Icon className="w-5 h-5 text-brand-gold-400 mx-auto mb-2" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS — Visual journey                */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="section-heading-center mb-4">How It Works</h2>
        <p className="text-center text-text-secondary text-sm mb-12 max-w-lg mx-auto">
          Three steps. No sign-up needed. Find help in under a minute.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Desktop connecting dashed line */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] border-t-2 border-dashed border-brand-green-200/60" />

          {[
            {
              step: "1",
              icon: Search,
              color: "bg-blue-50 text-blue-600 ring-blue-100",
              title: "Search your problem",
              desc: "Type what you need fixed — like \"leaking pipe\" — or pick a trade category. Filter by your area.",
            },
            {
              step: "2",
              icon: Star,
              color: "bg-brand-gold-50 text-brand-gold-700 ring-brand-gold-100",
              title: "Check reviews & work",
              desc: "Read real reviews from your neighbours. See photos of actual completed jobs. Compare ratings.",
            },
            {
              step: "3",
              icon: MessageCircle,
              color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
              title: "Tap WhatsApp",
              desc: "One tap opens WhatsApp with their number. You're talking to a tradesperson in seconds.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center relative">
                <div className="relative inline-flex mb-6">
                  <div
                    className={`w-20 h-20 ${item.color} ring-2 rounded-2xl flex items-center justify-center mx-auto shadow-sm`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2.5 -right-2.5 w-8 h-8 bg-brand-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-4 ring-surface-warm">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-display text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* BENTO TRUST GRID — Why ProFind?              */}
      {/* ============================================ */}
      <section className="bg-surface-muted">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="section-heading-center mb-4">Built Different</h2>
          <p className="text-center text-text-secondary text-sm mb-12 max-w-lg mx-auto">
            No fake reviews. No hidden fees. No middleman. Just real people helping real neighbours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ── Large card: Real Reviews (spans 2 cols) ── */}
            <div className="md:col-span-2 card p-8 border-2 border-brand-green-100 bg-gradient-to-br from-brand-green-50/40 to-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-green-100/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="w-12 h-12 bg-brand-green-100 ring-1 ring-brand-green-200 rounded-2xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-brand-green-600" />
                </div>
                <h3 className="font-display text-xl md:text-2xl mb-3">Real Reviews, Real Names</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-md">
                  Every review on ProFind shows the reviewer&apos;s real name and area. No anonymous ratings — you can trace each one back to someone in your community.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating rating={4.8} reviewCount={50} />
                  <span className="text-xs text-text-muted">average across all providers</span>
                </div>
              </div>
            </div>

            {/* ── WhatsApp card ── */}
            <div className="card p-8 border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white relative overflow-hidden group">
              <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-emerald-100/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-100 ring-1 ring-emerald-200 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-display text-xl mb-3">One Tap to WhatsApp</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  No login needed. Find the right person, tap the WhatsApp button, and you&apos;re talking directly in seconds. It&apos;s that simple.
                </p>
              </div>
            </div>

            {/* ── Bottom row: 3 compact cards ── */}
            <div className="card p-6 border border-gray-100 group hover:border-brand-gold-200 transition-colors">
              <div className="w-10 h-10 bg-brand-gold-50 ring-1 ring-brand-gold-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-5 h-5 text-brand-gold-700" />
              </div>
              <h3 className="font-semibold mb-1.5">See Their Actual Work</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Customer-uploaded photos of real completed jobs — not stock images. Real work, in real Guyanese homes.
              </p>
            </div>

            <div className="card p-6 border border-gray-100 group hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 bg-blue-50 ring-1 ring-blue-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1.5">Know Your Prices</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our Price Guide covers 70+ common jobs with typical price ranges in GYD. Know what to expect before you call.
              </p>
            </div>

            <div className="card p-6 border border-gray-100 group hover:border-brand-green-200 transition-colors">
              <div className="w-10 h-10 bg-brand-green-50 ring-1 ring-brand-green-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 text-brand-green-600" />
              </div>
              <h3 className="font-semibold mb-1.5">100% Free to Search</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Search, read reviews, and contact tradespeople — all completely free. We never charge customers. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PLATFORM PILLARS — 3 tools                   */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="section-heading-center mb-4">One Platform, Three Powerful Tools</h2>
        <p className="text-center text-text-secondary text-sm mb-12 max-w-lg mx-auto">
          Whether you need help, offer a trade, or sell materials — ProFind has you covered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Find Trades */}
          <div className="card p-6 border-2 border-gray-100 hover:border-brand-green-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-green-50 rounded-full -translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-12 h-12 bg-brand-green-50 ring-1 ring-brand-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-5 h-5 text-brand-green-600" />
              </div>
              <h3 className="font-display text-lg mb-2">Find Tradespeople</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Search by trade, area, or problem. Read reviews, see work photos, and WhatsApp them directly.
              </p>
              <Link
                href="/search"
                className="text-brand-green-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                Search Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Price Guide */}
          <div className="card p-6 border-2 border-gray-100 hover:border-brand-gold-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-gold-50 rounded-full -translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-12 h-12 bg-brand-gold-50 ring-1 ring-brand-gold-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-5 h-5 text-brand-gold-700" />
              </div>
              <h3 className="font-display text-lg mb-2">Price Guide</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Know what to expect before you call. 70+ common jobs with typical price ranges in GYD.
              </p>
              <Link
                href="/price-guide"
                className="text-brand-gold-700 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                Check Prices <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Materials Shop */}
          <div className="card p-6 border-2 border-gray-100 hover:border-purple-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-50 rounded-full -translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-12 h-12 bg-purple-50 ring-1 ring-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-display text-lg mb-2">Materials Shop</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Compare prices across hardware stores. Find what you need without driving all over town.
              </p>
              <Link
                href="/shop"
                className="text-purple-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                Browse Materials <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* REQUEST A QUOTE CTA                          */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, #002312 0%, #009E49 60%, #003d1e 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(252,209,22,0.1),transparent_60%)]" />
          {/* Guyana flag accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green-400 via-brand-gold-400 to-brand-red-500" />
          <div className="relative px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
                Not sure who to call?
              </h2>
              <p className="text-green-200/90 text-sm md:text-base leading-relaxed max-w-md">
                Describe your job and we&apos;ll match you with up to 3 verified tradespeople. Free quotes, no obligation.
              </p>
            </div>
            <Link
              href="/request-quote"
              className="bg-brand-gold-400 hover:bg-brand-gold-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-base transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-brand-gold-400/20"
            >
              Get 3 Free Quotes <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RECENT REVIEWS — Social proof                */}
      {/* ============================================ */}
      {recentReviews.length > 0 && (
        <section className="bg-surface-muted border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="section-heading-center mb-4">What Customers Are Saying</h2>
            <p className="text-center text-text-secondary text-sm mb-10 max-w-lg mx-auto">
              Real reviews from real Guyanese homeowners — every review shows who wrote it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReviews.map((review) => {
                const trade = review.providerTrade
                  ? getTradeById(review.providerTrade)
                  : null;
                return (
                  <div
                    key={review.id}
                    className="card p-5 border border-gray-100 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm">
                          {review.reviewerName}
                        </p>
                        {review.reviewerArea && (
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {review.reviewerArea}
                          </p>
                        )}
                      </div>
                      <StarRating
                        rating={review.rating}
                        showValue={false}
                      />
                    </div>
                    {review.reviewText && (
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-3">
                        &ldquo;{review.reviewText}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        {trade && (
                          <TradeIcon
                            tradeId={trade.id}
                            size="sm"
                            showBackground={false}
                          />
                        )}
                        <span className="text-xs text-text-muted">
                          {review.providerName}
                        </span>
                      </div>
                      {review.wouldRecommend && (
                        <span className="text-xs text-brand-green-600 font-medium">
                          ✓ Recommends
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* FAQ — SEO structured data                    */}
      {/* ============================================ */}
      <section className={recentReviews.length > 0 ? "" : "bg-surface-muted border-t border-gray-100"}>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h2 className="section-heading-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-text-secondary text-sm mb-10">
            Everything you need to know about finding tradespeople on ProFind.
          </p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <details key={i} className="card border border-gray-100 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-sm hover:text-brand-green-700 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMMUNITY CTAs — Join ProFind                */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="section-heading-center mb-4">Join the ProFind Community</h2>
        <p className="text-center text-text-secondary text-sm mb-10 max-w-lg mx-auto">
          Whether you need help, offer services, or sell materials — there&apos;s a place for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Suggest */}
          <div className="card p-7 border border-gray-100 relative overflow-hidden group hover:border-brand-green-200 transition-all">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-green-50 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="w-11 h-11 bg-brand-green-100 ring-1 ring-brand-green-200 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-5 h-5 text-brand-green-600" />
              </div>
              <h3 className="font-display text-lg mb-2">Know somebody good?</h3>
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">
                Help your neighbours find good tradespeople. Suggest someone you&apos;ve used and trust.
              </p>
              <Link
                href="/suggest"
                className="text-brand-green-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                Suggest a Tradesperson <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tradesperson signup — featured */}
          <div className="card p-7 border-2 border-brand-green-300 bg-gradient-to-br from-brand-green-50/50 to-white relative overflow-hidden group">
            <div className="absolute -top-1 left-0 right-0 h-1 bg-brand-green-500" />
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green-100 text-brand-green-700">
                POPULAR
              </span>
            </div>
            <div className="relative">
              <div className="w-11 h-11 bg-brand-green-500 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-lg mb-2">Are you a tradesperson?</h3>
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">
                Get your free profile, collect reviews, and let customers find you when they need help.
              </p>
              <Link
                href="/signup"
                className="btn-primary text-sm inline-flex items-center gap-1.5"
              >
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hardware shop */}
          <div className="card p-7 border border-brand-gold-200 bg-gradient-to-br from-brand-gold-50/40 to-white relative overflow-hidden group hover:border-brand-gold-300 transition-all">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-gold-100 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="w-11 h-11 bg-brand-gold-200 ring-1 ring-brand-gold-300 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 text-brand-gold-800" />
              </div>
              <h3 className="font-display text-lg mb-2">Own a hardware store?</h3>
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">
                List your products, set your prices, and let tradespeople across Guyana find you.
              </p>
              <Link
                href="/signup"
                className="text-brand-gold-800 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all"
              >
                Register Your Shop <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
