import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Star,
  MessageCircle,
  Search,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { fetchProviders } from "@/lib/data";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { ProviderCard } from "@/components/providers/ProviderCard";

// Generate all trade pages at build time
export async function generateStaticParams() {
  return TRADES.map((trade) => ({ slug: trade.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const trade = TRADES.find((t) => t.id === params.slug);
  if (!trade) return { title: "Trade Not Found" };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://profindguyana.com";
  const title = `Find a ${trade.localName} in Guyana — Rated & Reviewed | ProFind`;
  const description = `Looking for a ${trade.localName.toLowerCase()} in Georgetown or across Guyana? Browse verified ${trade.localName.toLowerCase()}s with real reviews, work photos, and one-tap WhatsApp contact. ${trade.description}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/trades/${trade.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GY",
      url: `${siteUrl}/trades/${trade.id}`,
    },
  };
}

export default async function TradeLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const trade = TRADES.find((t) => t.id === params.slug);
  if (!trade) notFound();

  const providers = await fetchProviders({
    trade: trade.id,
    sortBy: "rating",
  });
  const topProviders = providers.slice(0, 6);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://profindguyana.com";

  // Schema.org structured data for this trade service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${trade.localName} Services in Guyana`,
    description: trade.description,
    areaServed: {
      "@type": "Country",
      name: "Guyana",
    },
    provider: {
      "@type": "Organization",
      name: "ProFind Guyana",
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-surface-warm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #002312 0%, #003d1e 25%, #009E49 60%, #006a32 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(206,163,42,0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,158,73,0.4), transparent 40%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-green-300/70 mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/search"
              className="hover:text-white transition-colors"
            >
              Trades
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{trade.localName}</span>
          </nav>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <TradeIcon tradeId={trade.id} size="lg" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-white">
                Find a {trade.localName} in Guyana
              </h1>
              <p className="text-green-200/80 text-sm mt-1">
                {topProviders.length}+ verified{" "}
                {trade.localName.toLowerCase()}s ready to help
              </p>
            </div>
          </div>

          <p className="text-green-200/90 text-base max-w-2xl mb-8 leading-relaxed">
            {trade.description}. Browse rated and reviewed{" "}
            {trade.localName.toLowerCase()}s across Georgetown and all of
            Guyana. Read real reviews, check their work photos, and WhatsApp
            them directly.
          </p>

          <Link
            href={`/search?trade=${trade.id}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search {trade.localName}s Near You
          </Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Common problems */}
        <section className="mb-12">
          <h2 className="font-display text-xl mb-2">
            Common {trade.localName} Problems We Help With
          </h2>
          <p className="text-sm text-text-secondary mb-5">
            Search any of these on ProFind to find a qualified{" "}
            {trade.localName.toLowerCase()} near you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {trade.problems.map((problem) => (
              <Link
                key={problem}
                href={`/search?q=${encodeURIComponent(problem)}`}
                className="card px-4 py-3 border border-gray-100 text-sm text-text-secondary hover:text-brand-green-700 hover:border-brand-green-200 transition-all flex items-center justify-between group"
              >
                <span>{problem}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-green-500" />
              </Link>
            ))}
          </div>
        </section>

        {/* Top providers */}
        {topProviders.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl">
                Top Rated {trade.localName}s
              </h2>
              <Link
                href={`/search?trade=${trade.id}`}
                className="text-brand-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </section>
        )}

        {/* How it works mini */}
        <section className="mb-12">
          <h2 className="font-display text-xl mb-6">
            How to Find a {trade.localName} on ProFind
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                icon: Search,
                title: "Search",
                desc: `Search for "${trade.problems[0].toLowerCase()}" or browse all ${trade.localName.toLowerCase()}s in your area.`,
              },
              {
                step: "2",
                icon: Star,
                title: "Compare",
                desc: "Read reviews from your neighbours, check ratings, and see photos of their actual work.",
              },
              {
                step: "3",
                icon: MessageCircle,
                title: "Contact",
                desc: "Tap WhatsApp to message them directly. No sign-up needed, no middleman fees.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="card p-5 border border-gray-100 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-brand-green-50 ring-1 ring-brand-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="card p-8 border border-gray-100 text-center">
          <CheckCircle className="w-10 h-10 text-brand-green-500 mx-auto mb-3" />
          <h2 className="font-display text-xl mb-2">
            Are You a {trade.localName}?
          </h2>
          <p className="text-sm text-text-secondary mb-5 max-w-md mx-auto">
            Get your free profile on ProFind. Collect reviews, showcase your
            work, and let customers find you when they need a{" "}
            {trade.localName.toLowerCase()}.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up Free
            </Link>
            <Link
              href={`/search?trade=${trade.id}`}
              className="btn-secondary text-sm"
            >
              Browse {trade.localName}s
            </Link>
          </div>
        </section>

        {/* Other trades */}
        <section className="mt-12">
          <h2 className="font-display text-xl mb-5">
            Other Trades on ProFind
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRADES.filter((t) => t.id !== trade.id).map((t) => (
              <Link
                key={t.id}
                href={`/trades/${t.id}`}
                className="card p-4 border border-gray-100 flex items-center gap-3 hover:border-brand-green-200 transition-all group"
              >
                <TradeIcon tradeId={t.id} size="sm" />
                <span className="font-medium text-sm group-hover:text-brand-green-700 transition-colors">
                  {t.localName}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
