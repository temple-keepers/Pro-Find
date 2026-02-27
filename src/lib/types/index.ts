// ============================================
// ProFind Guyana — Core Type Definitions
// ============================================

// --- Reference Data ---

export interface Trade {
  id: string;
  name: string;
  localName: string;
  icon: string;
  description?: string;
  problems: string[];
  sortOrder: number;
}

export interface Area {
  id: string;
  name: string;
  shortName: string;
  region: string;
  sortOrder: number;
}

// --- Provider ---

export interface Provider {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  trades: string[];        // trade IDs
  areas: string[];         // area IDs
  description?: string;
  photoUrl?: string;
  workPhotos: string[];
  isClaimed: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  availableNow: boolean;
  availableNowUpdatedAt?: string;
  bitCertified: boolean;
  bitCertificateUrl?: string;
  bitTrade?: string;
  avgRating: number;
  reviewCount: number;
  responseTime?: string;
  priceRangeLow?: number;   // GYD
  priceRangeHigh?: number;  // GYD
  yearsExperience?: number;
  servicesOffered: string[];
  createdAt: string;
  claimedAt?: string;
  updatedAt: string;
  source: 'seed' | 'suggestion' | 'self_registered';
  sourceDetail?: string;
  // Trust layer
  idVerified: boolean;
  verifiedAt?: string;
  idVerificationMethod?: 'phone' | 'id_document' | 'in_person';
  // Computed from reviews
  recommendPct?: number;  // % of reviewers who would recommend (0-100)
}

// --- Review ---

export interface Review {
  id: string;
  providerId: string;
  reviewerName: string;
  reviewerArea?: string;
  rating: number;           // 1-5
  reviewText?: string;
  photos: string[];
  pricePaid?: number;       // GYD — feeds price guide
  jobDescription?: string;
  providerResponse?: string;
  wouldRecommend: boolean;
  createdAt: string;
  verified: boolean;
}

// --- Suggestion ---

export interface Suggestion {
  id: string;
  providerName: string;
  trade: string;
  area: string;
  phone?: string;
  description?: string;
  suggestedByName?: string;
  suggestedByArea?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// --- Contact Event ---

export interface ContactEvent {
  id: string;
  providerId: string;
  contactType: 'whatsapp' | 'call';
  sourcePage: string;
  createdAt: string;
}

// --- Quote (Provider Tool) ---

export interface QuoteMaterialItem {
  name: string;
  qty: number;
  unitCost: number;
  total: number;
}

export interface Quote {
  id: string;
  providerId: string;
  customerName?: string;
  customerPhone?: string;
  jobDescription: string;
  materialsItems: QuoteMaterialItem[];
  materialsTotal: number;   // GYD
  labourCost: number;       // GYD
  totalCost: number;        // GYD
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  createdAt: string;
  sentAt?: string;
}

// --- Job Tracker ---

export type JobStatus =
  | 'deposit_paid'
  | 'materials_purchased'
  | 'work_started'
  | 'half_complete'
  | 'final_inspection'
  | 'complete'
  | 'disputed';

export interface Job {
  id: string;
  providerId: string;
  quoteId?: string;
  customerName: string;
  customerPhone?: string;
  jobDescription: string;
  totalAgreed?: number;     // GYD
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
}

export interface JobMilestone {
  id: string;
  jobId: string;
  milestone: string;
  note?: string;
  photos: string[];
  loggedBy: 'provider' | 'customer';
  createdAt: string;
}

// --- Search / Filter ---

export interface SearchFilters {
  trade?: string;
  area?: string;
  problem?: string;
  query?: string;
  verifiedOnly?: boolean;
  availableNow?: boolean;
  bitCertifiedOnly?: boolean;
  sortBy?: 'rating' | 'reviews' | 'newest';
}

// --- Materials Shop ---

export interface Shop {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  area?: string;
  description?: string;
  logoUrl?: string;
  photoUrl?: string;
  hours?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
}

export interface Material {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  unit: string;
  price: number;
  priceWas?: number;
  inStock: boolean;
  photoUrl?: string;
  tradeTags: string[];
  isPopular: boolean;
  createdAt: string;
  // Joined
  shop?: Shop;
  category?: MaterialCategory;
}

// --- Price Guide (aggregated from reviews) ---

export interface PriceRange {
  trade: string;
  jobType: string;
  area: string;
  low: number;
  high: number;
  median: number;
  sampleSize: number;
}
