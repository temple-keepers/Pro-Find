import { Provider, Review } from "@/lib/types";

/**
 * Seed providers for development and demo purposes.
 * These will be replaced by real data from Supabase in production.
 * Names/phones are fictional — real providers will come from Facebook mining.
 */
export const SEED_PROVIDERS: Provider[] = [
  {
    id: "p-001",
    name: "Marcus Williams",
    phone: "6123456",
    phoneVerified: true,
    trades: ["plumber"],
    areas: ["gt-kitty", "gt-campbellville", "gt-sophia"],
    description: "15 years experience in residential plumbing. Specializing in bathroom renovations and emergency pipe repairs. I show up when I say I will.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: true,
    isFeatured: true,
    availableNow: true,
    availableNowUpdatedAt: new Date().toISOString(),
    bitCertified: false,
    avgRating: 4.8,
    reviewCount: 14,
    responseTime: "Usually responds within 1 hour",
    priceRangeLow: 8000,
    priceRangeHigh: 45000,
    yearsExperience: 15,
    servicesOffered: ["Pipe repair", "Drain clearing", "Bathroom renovation", "Water tank installation", "Emergency plumbing"],
    createdAt: "2024-06-15T10:00:00Z",
    claimedAt: "2024-06-20T14:00:00Z",
    updatedAt: "2025-02-10T09:00:00Z",
    source: "seed",
    sourceDetail: "Georgetown Community Group - Facebook",
    idVerified: true,
    verifiedAt: "2024-07-01T10:00:00Z",
    idVerificationMethod: "phone",
  },
  {
    id: "p-002",
    name: "Davendra Singh",
    phone: "6234567",
    phoneVerified: true,
    trades: ["plumber"],
    areas: ["ebd-providence", "ebd-eccles", "ebd-diamond", "gt-south-ruimveldt"],
    description: "Reliable plumbing work at fair prices. Kitchen and bathroom specialist. BIT certified in plumbing.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: false,
    isFeatured: false,
    availableNow: false,
    bitCertified: true,
    bitTrade: "Plumbing",
    avgRating: 4.5,
    reviewCount: 8,
    responseTime: "Usually responds within 3 hours",
    priceRangeLow: 6000,
    priceRangeHigh: 35000,
    yearsExperience: 7,
    servicesOffered: ["Kitchen plumbing", "Bathroom plumbing", "Pipe installation", "Leak repair"],
    createdAt: "2024-09-18T10:00:00Z",
    claimedAt: "2024-09-25T11:00:00Z",
    updatedAt: "2025-02-08T15:00:00Z",
    source: "seed",
    sourceDetail: "East Bank Community Group - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
  {
    id: "p-003",
    name: "Kevin Persaud",
    phone: "6345678",
    phoneVerified: true,
    trades: ["electrician"],
    areas: ["gt-kitty", "gt-subryanville", "gt-bel-air", "gt-queenstown", "gt-campbellville"],
    description: "Licensed electrician. House wiring, generator installations, ceiling fans, and all electrical repairs. Clean work guaranteed.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: true,
    isFeatured: true,
    availableNow: true,
    bitCertified: true,
    bitTrade: "Electrical Installation",
    avgRating: 4.9,
    reviewCount: 22,
    responseTime: "Usually responds within 30 minutes",
    priceRangeLow: 5000,
    priceRangeHigh: 80000,
    yearsExperience: 12,
    servicesOffered: ["House wiring", "Generator hookup", "Ceiling fan install", "Breaker repair", "Outdoor lighting", "Emergency electrical"],
    createdAt: "2024-04-10T10:00:00Z",
    claimedAt: "2024-04-12T09:00:00Z",
    updatedAt: "2025-02-12T11:00:00Z",
    source: "seed",
    sourceDetail: "Georgetown Community Group - Facebook",
    idVerified: true,
    verifiedAt: "2024-04-20T10:00:00Z",
    idVerificationMethod: "id_document",
  },
  {
    id: "p-004",
    name: "Shawn Thomas",
    phone: "6456789",
    phoneVerified: false,
    trades: ["electrician"],
    areas: ["ecd-ogle", "ecd-plaisance", "ecd-bv", "gt-turkeyen"],
    description: "Electrical work for homes and small businesses. Fair prices, honest work.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: false,
    isVerified: false,
    isFeatured: false,
    availableNow: false,
    bitCertified: false,
    avgRating: 4.2,
    reviewCount: 5,
    responseTime: undefined,
    priceRangeLow: 5000,
    priceRangeHigh: 50000,
    yearsExperience: 6,
    servicesOffered: ["Wiring", "Light installation", "Fan installation"],
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-05T10:00:00Z",
    source: "seed",
    sourceDetail: "Guyana Buy & Sell - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
  {
    id: "p-005",
    name: "Rajesh Narine",
    phone: "6567890",
    phoneVerified: true,
    trades: ["ac-technician"],
    areas: ["gt-kitty", "gt-campbellville", "gt-subryanville", "gt-bel-air", "gt-queenstown", "ebd-providence"],
    description: "AC installation, servicing, and repair. All major brands. Same-day service available for emergencies. 10+ years experience.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: true,
    isFeatured: false,
    availableNow: true,
    bitCertified: false,
    avgRating: 4.7,
    reviewCount: 18,
    responseTime: "Usually responds within 1 hour",
    priceRangeLow: 8000,
    priceRangeHigh: 120000,
    yearsExperience: 11,
    servicesOffered: ["AC installation", "AC repair", "AC servicing", "Split unit install", "Emergency AC repair"],
    createdAt: "2024-07-08T10:00:00Z",
    claimedAt: "2024-07-10T16:00:00Z",
    updatedAt: "2025-02-11T08:00:00Z",
    source: "seed",
    sourceDetail: "Georgetown Community Group - Facebook",
    idVerified: true,
    verifiedAt: "2024-08-01T10:00:00Z",
    idVerificationMethod: "phone",
  },
  {
    id: "p-006",
    name: "Roger Campbell",
    phone: "6678901",
    phoneVerified: true,
    trades: ["carpenter"],
    areas: ["gt-albouystown", "gt-lacytown", "gt-stabroek", "gt-werk-en-rust"],
    description: "Custom furniture, kitchen cabinets, wardrobes, doors and windows. Quality hardwood work.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: false,
    isFeatured: false,
    availableNow: false,
    bitCertified: false,
    avgRating: 4.6,
    reviewCount: 11,
    responseTime: "Usually responds within 2 hours",
    priceRangeLow: 15000,
    priceRangeHigh: 200000,
    yearsExperience: 20,
    servicesOffered: ["Wardrobes", "Kitchen cabinets", "Doors", "Window frames", "Custom furniture", "Roof repair"],
    createdAt: "2024-10-20T10:00:00Z",
    claimedAt: "2024-10-28T10:00:00Z",
    updatedAt: "2025-02-09T12:00:00Z",
    source: "seed",
    sourceDetail: "Guyana Buy & Sell - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
  {
    id: "p-007",
    name: "Fazal Mohamed",
    phone: "6789012",
    phoneVerified: true,
    trades: ["mason"],
    areas: ["ebd-diamond", "ebd-grove", "ebd-land-of-canaan", "ebd-houston"],
    description: "House construction, extensions, foundations, block work, tiling, plastering. Over 25 years building homes on the East Bank.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: true,
    isFeatured: true,
    availableNow: false,
    bitCertified: false,
    avgRating: 4.8,
    reviewCount: 19,
    responseTime: "Usually responds within 2 hours",
    priceRangeLow: 50000,
    priceRangeHigh: 500000,
    yearsExperience: 25,
    servicesOffered: ["House construction", "Extensions", "Foundation", "Block work", "Tiling", "Plastering", "Concrete work"],
    createdAt: "2024-03-05T10:00:00Z",
    claimedAt: "2024-03-08T14:00:00Z",
    updatedAt: "2025-02-10T16:00:00Z",
    source: "seed",
    sourceDetail: "East Bank Community Group - Facebook",
    idVerified: true,
    verifiedAt: "2024-03-15T10:00:00Z",
    idVerificationMethod: "in_person",
  },
  {
    id: "p-008",
    name: "Patrick Henry",
    phone: "6890123",
    phoneVerified: true,
    trades: ["welder"],
    areas: ["gt-sophia", "gt-north-ruimveldt", "gt-south-ruimveldt", "gt-roxanne-burnham"],
    description: "Gates, burglar bars, window grills, fences, railings. Strong work at fair prices. I bring my own generator.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: false,
    isFeatured: false,
    availableNow: true,
    bitCertified: true,
    bitTrade: "Welding and Fabrication",
    avgRating: 4.4,
    reviewCount: 9,
    responseTime: "Usually responds within 1 hour",
    priceRangeLow: 25000,
    priceRangeHigh: 300000,
    yearsExperience: 8,
    servicesOffered: ["Gates", "Burglar bars", "Window grills", "Metal fences", "Railings", "Welding repairs"],
    createdAt: "2024-11-22T10:00:00Z",
    claimedAt: "2024-12-01T09:00:00Z",
    updatedAt: "2025-02-11T10:00:00Z",
    source: "seed",
    sourceDetail: "Guyanese Helping Guyanese - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
  {
    id: "p-009",
    name: "Bibi Nandlall",
    phone: "6901234",
    phoneVerified: true,
    trades: ["painter"],
    areas: ["gt-kitty", "gt-campbellville", "gt-subryanville", "gt-bel-air", "gt-queenstown"],
    description: "Interior and exterior painting. Neat, clean work with attention to detail. Free colour consultation.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: true,
    isVerified: false,
    isFeatured: false,
    availableNow: false,
    bitCertified: false,
    avgRating: 4.7,
    reviewCount: 7,
    responseTime: "Usually responds within 3 hours",
    priceRangeLow: 20000,
    priceRangeHigh: 150000,
    yearsExperience: 9,
    servicesOffered: ["Interior painting", "Exterior painting", "Waterproofing", "Touch-ups", "Colour consultation"],
    createdAt: "2024-12-25T10:00:00Z",
    claimedAt: "2025-01-02T11:00:00Z",
    updatedAt: "2025-02-08T14:00:00Z",
    source: "seed",
    sourceDetail: "Georgetown Community Group - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
  {
    id: "p-010",
    name: "Deonarine Doodnauth",
    phone: "6012345",
    phoneVerified: false,
    trades: ["mechanic"],
    areas: ["ebd-eccles", "ebd-houston", "ebd-providence"],
    description: "All makes and models. Engine work, brakes, transmission, electrical. 18 years fixing cars.",
    photoUrl: undefined,
    workPhotos: [],
    isClaimed: false,
    isVerified: false,
    isFeatured: false,
    availableNow: false,
    bitCertified: false,
    avgRating: 4.3,
    reviewCount: 6,
    responseTime: undefined,
    priceRangeLow: 5000,
    priceRangeHigh: 100000,
    yearsExperience: 18,
    servicesOffered: ["Engine repair", "Brakes", "Transmission", "Car AC", "General service"],
    createdAt: "2025-02-03T10:00:00Z",
    updatedAt: "2025-02-07T10:00:00Z",
    source: "seed",
    sourceDetail: "East Bank Community Group - Facebook",
    idVerified: false,
    verifiedAt: undefined,
    idVerificationMethod: undefined,
  },
];

// Seed reviews for social proof
export const SEED_REVIEWS: Review[] = [
  {
    id: "r-001",
    providerId: "p-001",
    reviewerName: "Sandra Gonsalves",
    reviewerArea: "Kitty",
    rating: 5,
    reviewText: "Marcus fix my bathroom pipe same day I called. Clean work, fair price, and he explained everything before starting. Would definitely use again.",
    photos: [],
    pricePaid: 12000,
    jobDescription: "Leaking pipe in bathroom",
    wouldRecommend: true,
    createdAt: "2025-02-05T14:00:00Z",
    verified: true,
  },
  {
    id: "r-002",
    providerId: "p-001",
    reviewerName: "Ravi Doobay",
    reviewerArea: "Campbellville",
    rating: 5,
    reviewText: "Best plumber I ever use. Kitchen sink was blocked for 2 days and nobody could fix it. Marcus came and had it running in 30 minutes. Very professional.",
    photos: [],
    pricePaid: 8000,
    jobDescription: "Blocked kitchen drain",
    wouldRecommend: true,
    createdAt: "2025-01-28T11:00:00Z",
    verified: true,
  },
  {
    id: "r-003",
    providerId: "p-003",
    reviewerName: "Michelle Torres",
    reviewerArea: "Bel Air",
    rating: 5,
    reviewText: "Kevin rewired our whole downstairs after we had a breaker problem. Very neat work, labelled everything, and even cleaned up after himself. BIT certified too which gave us confidence.",
    photos: [],
    pricePaid: 65000,
    jobDescription: "House rewiring - downstairs",
    wouldRecommend: true,
    createdAt: "2025-02-08T16:00:00Z",
    verified: true,
  },
  {
    id: "r-004",
    providerId: "p-005",
    reviewerName: "Amanda Singh",
    reviewerArea: "Subryanville",
    rating: 5,
    reviewText: "AC was leaking water on the bedroom floor at 11pm. Rajesh came first thing next morning and had it fixed in an hour. Charged a fair price too.",
    photos: [],
    pricePaid: 15000,
    jobDescription: "AC leaking water",
    wouldRecommend: true,
    createdAt: "2025-02-02T10:00:00Z",
    verified: true,
  },
  {
    id: "r-005",
    providerId: "p-007",
    reviewerName: "Ishwar Doodnauth",
    reviewerArea: "Diamond",
    rating: 5,
    reviewText: "Fazal build our extension last year. Top quality work, always on time, and kept to the budget. The man know his craft. Building another house and using him again.",
    photos: [],
    pricePaid: 450000,
    jobDescription: "House extension - 2 rooms",
    wouldRecommend: true,
    createdAt: "2025-01-15T09:00:00Z",
    verified: true,
  },
  {
    id: "r-006",
    providerId: "p-008",
    reviewerName: "Shondell Adams",
    reviewerArea: "Sophia",
    rating: 4,
    reviewText: "Patrick make a nice gate for us. Strong work and the design came out good. Only thing is he took a little longer than he said but the end result was worth the wait.",
    photos: [],
    pricePaid: 85000,
    jobDescription: "Build front gate",
    wouldRecommend: true,
    createdAt: "2025-02-01T13:00:00Z",
    verified: true,
  },
];

// Helper: get providers by trade
export function getProvidersByTrade(tradeId: string): Provider[] {
  return SEED_PROVIDERS.filter((p) => p.trades.includes(tradeId));
}

// Helper: get providers by area
export function getProvidersByArea(areaId: string): Provider[] {
  return SEED_PROVIDERS.filter((p) => p.areas.includes(areaId));
}

// Helper: get reviews for a provider
export function getReviewsForProvider(providerId: string): Review[] {
  return SEED_REVIEWS.filter((r) => r.providerId === providerId);
}

// Helper: compute recommend percentage from reviews
function computeRecommendPct(providerId: string): number | undefined {
  const reviews = getReviewsForProvider(providerId);
  if (reviews.length === 0) return undefined;
  const recommendCount = reviews.filter((r) => r.wouldRecommend).length;
  return Math.round((recommendCount / reviews.length) * 100);
}

// Helper: enrich providers with recommendPct
function enrichProviders(providers: Provider[]): Provider[] {
  return providers.map((p) => ({
    ...p,
    recommendPct: computeRecommendPct(p.id),
  }));
}

// Helper: search providers
export function searchProviders(filters: {
  trade?: string;
  area?: string;
  query?: string;
  availableNow?: boolean;
  bitCertifiedOnly?: boolean;
  sortBy?: "rating" | "reviews" | "newest";
}): Provider[] {
  let results = [...SEED_PROVIDERS];

  if (filters.trade) {
    results = results.filter((p) => p.trades.includes(filters.trade!));
  }

  if (filters.area) {
    results = results.filter((p) => p.areas.includes(filters.area!));
  }

  if (filters.availableNow) {
    results = results.filter((p) => p.availableNow);
  }

  if (filters.bitCertifiedOnly) {
    results = results.filter((p) => p.bitCertified);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.servicesOffered.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (filters.sortBy) {
    case "reviews":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
    default:
      // Featured first, then by rating, then by review count
      results.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
        if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
        return b.reviewCount - a.reviewCount;
      });
  }

  return enrichProviders(results);
}
