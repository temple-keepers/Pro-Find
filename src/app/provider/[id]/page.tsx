import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  GraduationCap,
  CircleDot,
  DollarSign,
  Star,
  Calendar,
  Briefcase,
  MessageSquare,
  FileText,
} from "lucide-react";
import { fetchProviderById, fetchReviewsForProvider } from "@/lib/data";
import { getTradeById } from "@/lib/data/trades";
import { getAreaById } from "@/lib/data/areas";
import { formatPriceRange } from "@/lib/utils/pricing";
import { TradeIcon } from "@/components/ui/TradeIcon";
import { StarRating } from "@/components/ui/StarRating";
import { WhatsAppButton } from "@/components/providers/WhatsAppButton";
import { ShareButton } from "@/components/providers/ShareButton";
import { WorkPhotoGallery } from "@/components/providers/WorkPhotoGallery";

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const provider = await fetchProviderById(params.id);
  if (!provider) {
    return { title: "Provider Not Found — ProFind Guyana" };
  }

  const trades = provider.trades.map((id) => getTradeById(id)).filter(Boolean);
  const areas = provider.areas.map((id) => getAreaById(id)).filter(Boolean);
  const primaryTrade = trades[0];
  const primaryArea = areas[0];

  const title = `${provider.name} — ${primaryTrade?.localName || "Tradesperson"} in ${primaryArea?.name || "Guyana"} | ProFind`;
  const description = provider.description
    ? provider.description.slice(0, 160)
    : `${provider.name} is a ${primaryTrade?.localName || "tradesperson"} serving ${areas.map((a) => a?.shortName).join(", ")}. ${provider.avgRating > 0 ? `Rated ${provider.avgRating}/5 with ${provider.reviewCount} reviews.` : ""} Contact via WhatsApp on ProFind Guyana.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      locale: "en_GY",
    },
  };
}

function ReviewCard({ review }: { review: Awaited<ReturnType<typeof fetchReviewsForProvider>>[0] }) {
  return (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-sm">{review.reviewerName}</p>
          {review.reviewerArea && (
            <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {review.reviewerArea}
            </p>
          )}
        </div>
        <StarRating rating={review.rating} showValue={false} />
      </div>

      {review.jobDescription && (
        <p className="text-xs text-brand-green-600 font-medium mt-2">
          {review.jobDescription}
        </p>
      )}

      {review.reviewText && (
        <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
          &ldquo;{review.reviewText}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-4 mt-2">
        {review.pricePaid && (
          <span className="text-xs text-text-muted flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Paid ${review.pricePaid.toLocaleString()} GYD
          </span>
        )}
        <span className="text-xs text-text-muted">
          {new Date(review.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        {review.wouldRecommend && (
          <span className="text-xs text-brand-green-600 font-medium">
            ✓ Would recommend
          </span>
        )}
      </div>
    </div>
  );
}

export default async function ProviderProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const provider = await fetchProviderById(params.id);

  if (!provider) {
    notFound();
  }

  const reviews = await fetchReviewsForProvider(provider.id);
  const trades = provider.trades.map((id) => getTradeById(id)).filter(Boolean);
  const areas = provider.areas.map((id) => getAreaById(id)).filter(Boolean);
  const primaryTrade = trades[0];

  // Generate initials
  const initials = provider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Schema.org structured data for rich Google results
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profindguyana.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.description || `${primaryTrade?.localName || "Tradesperson"} serving ${areas.map((a) => a?.shortName).filter(Boolean).join(", ")}`,
    url: `${siteUrl}/provider/${provider.id}`,
    ...(provider.photoUrl && { image: provider.photoUrl }),
    address: {
      "@type": "PostalAddress",
      addressRegion: areas[0]?.name || "Guyana",
      addressCountry: "GY",
    },
    ...(provider.avgRating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: provider.avgRating,
        reviewCount: provider.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.reviewerName },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
        },
        ...(r.reviewText && { reviewBody: r.reviewText }),
        datePublished: r.createdAt,
      })),
    }),
  };

  return (
    <div className="min-h-screen bg-surface-warm pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/search"
            className="p-1 -ml-1 text-text-muted hover:text-text-primary"
            aria-label="Back to search"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <ShareButton
            title={`${provider.name} on ProFind Guyana`}
            text={`Check out ${provider.name} on ProFind — rated tradesperson in Guyana`}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card p-5 mt-4 border border-gray-100">
          <div className="flex gap-4">
            {/* Avatar */}
            {provider.photoUrl ? (
              <Image
                src={provider.photoUrl}
                alt={provider.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-brand-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-green-700 font-bold text-2xl">
                  {initials}
                </span>
              </div>
            )}

            {/* Name + meta */}
            <div className="flex-1">
              <h1 className="font-display text-xl">{provider.name}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {provider.isVerified && (
                  <span className="badge-verified">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {provider.isClaimed && !provider.isVerified && (
                  <span className="badge-claimed">
                    <CheckCircle className="w-3 h-3" />
                    Claimed
                  </span>
                )}
                {provider.bitCertified && (
                  <span className="badge-bit">
                    <GraduationCap className="w-3 h-3" />
                    BIT Certified
                    {provider.bitTrade && ` — ${provider.bitTrade}`}
                  </span>
                )}
                {provider.availableNow && (
                  <span className="badge-available">
                    <CircleDot className="w-3 h-3" />
                    Available Now
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="mt-2">
                <StarRating
                  rating={provider.avgRating}
                  reviewCount={provider.reviewCount}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          {provider.description && (
            <p className="text-sm text-text-secondary mt-4 leading-relaxed">
              {provider.description}
            </p>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50">
            {primaryTrade && (
              <div className="flex items-center gap-2">
                <TradeIcon tradeId={primaryTrade.id} size="sm" />
                <div>
                  <p className="text-xs text-text-muted">Trade</p>
                  <p className="text-sm font-medium">{primaryTrade.localName}</p>
                </div>
              </div>
            )}

            {provider.yearsExperience && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-surface-muted rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Experience</p>
                  <p className="text-sm font-medium">
                    {provider.yearsExperience} years
                  </p>
                </div>
              </div>
            )}

            {provider.priceRangeLow && provider.priceRangeHigh && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-surface-muted rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Price Range</p>
                  <p className="text-sm font-medium">
                    {formatPriceRange(provider.priceRangeLow, provider.priceRangeHigh)}
                  </p>
                </div>
              </div>
            )}

            {provider.responseTime && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-surface-muted rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Response</p>
                  <p className="text-sm font-medium">{provider.responseTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Photos */}
        {provider.workPhotos && provider.workPhotos.length > 0 && (
          <div className="card p-5 mt-3 border border-gray-100">
            <h2 className="font-semibold text-sm mb-3">Work Photos</h2>
            <WorkPhotoGallery photos={provider.workPhotos} providerName={provider.name} />
          </div>
        )}

        {/* Services */}
        {provider.servicesOffered.length > 0 && (
          <div className="card p-5 mt-3 border border-gray-100">
            <h2 className="font-semibold text-sm mb-3">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {provider.servicesOffered.map((service) => (
                <span
                  key={service}
                  className="text-xs bg-surface-muted text-text-secondary px-3 py-1.5 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Areas Served */}
        <div className="card p-5 mt-3 border border-gray-100">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-text-muted" />
            Areas Served
          </h2>
          <div className="flex flex-wrap gap-2">
            {areas.map(
              (area) =>
                area && (
                  <span
                    key={area.id}
                    className="text-xs bg-brand-green-50 text-brand-green-700 px-3 py-1.5 rounded-full"
                  >
                    {area.shortName}
                  </span>
                )
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="card p-5 mt-3 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-text-muted" />
              Reviews ({reviews.length})
            </h2>
            <Link
              href={`/review/${provider.id}`}
              className="text-brand-green-500 text-xs font-semibold hover:underline"
            >
              Leave a Review
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-text-muted mb-3">
                No reviews yet. Be the first!
              </p>
              <Link
                href={`/review/${provider.id}`}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                Leave a Review
              </Link>
            </div>
          )}
        </div>

        {/* Member since */}
        <div className="text-center mt-4 mb-8">
          <p className="text-xs text-text-muted flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            On ProFind since{" "}
            {new Date(provider.createdAt).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Sticky bottom bar — WhatsApp + Quote */}
      {provider.phone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 z-50">
          <div className="max-w-3xl mx-auto flex gap-2">
            <WhatsAppButton
              phone={provider.phone}
              providerName={provider.name}
              trade={primaryTrade?.localName}
              providerId={provider.id}
              sourcePage="profile"
              size="lg"
              className="flex-1 justify-center"
            />
            <Link
              href={`/request-quote?trade=${primaryTrade?.id || ""}&provider=${encodeURIComponent(provider.name)}`}
              className="flex items-center justify-center gap-1.5 px-4 py-3 bg-brand-gold-400 hover:bg-brand-gold-500 text-gray-900 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
