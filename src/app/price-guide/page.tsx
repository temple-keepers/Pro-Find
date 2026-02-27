import type { Metadata } from "next";
import Link from "next/link";
import { Search, Info, ArrowRight, DollarSign } from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { TradeIcon } from "@/components/ui/TradeIcon";

export const metadata: Metadata = {
  title: "Price Guide — What Tradespeople Charge in Guyana | ProFind",
  description:
    "Estimated prices for plumbing, electrical, AC, carpentry, masonry, painting, welding and mechanic work in Georgetown and across Guyana. Know before you hire.",
};

// Pricing data — estimated ranges in GYD based on scraped provider data + local knowledge
const PRICE_DATA: Record<
  string,
  { category: string; jobs: { name: string; low: number; high: number; note?: string }[] }[]
> = {
  plumber: [
    {
      category: "Repairs",
      jobs: [
        { name: "Fix leaking pipe", low: 5000, high: 15000 },
        { name: "Unblock drain", low: 5000, high: 12000 },
        { name: "Replace tap/faucet", low: 6000, high: 15000, note: "Excluding tap cost" },
        { name: "Toilet repair", low: 8000, high: 20000 },
        { name: "Fix water heater", low: 10000, high: 25000 },
      ],
    },
    {
      category: "Installations",
      jobs: [
        { name: "Install water tank", low: 25000, high: 60000, note: "Labour only" },
        { name: "Bathroom plumbing (full)", low: 50000, high: 150000 },
        { name: "Kitchen sink install", low: 15000, high: 35000 },
        { name: "Water pump install", low: 15000, high: 40000 },
      ],
    },
  ],
  electrician: [
    {
      category: "Repairs",
      jobs: [
        { name: "Fix socket/outlet", low: 3000, high: 8000 },
        { name: "Replace light switch", low: 3000, high: 6000 },
        { name: "Fix breaker/fuse box", low: 8000, high: 25000 },
        { name: "Diagnose electrical fault", low: 5000, high: 15000 },
      ],
    },
    {
      category: "Installations",
      jobs: [
        { name: "Install ceiling fan", low: 5000, high: 12000, note: "Labour only" },
        { name: "Install light fixture", low: 4000, high: 10000 },
        { name: "New circuit/outlet", low: 8000, high: 20000 },
        { name: "House wiring (per room)", low: 25000, high: 60000 },
        { name: "Full house rewiring", low: 150000, high: 500000, note: "Depends on size" },
        { name: "Generator hookup", low: 25000, high: 80000 },
      ],
    },
  ],
  "ac-technician": [
    {
      category: "Service & Repair",
      jobs: [
        { name: "AC servicing/cleaning", low: 8000, high: 15000 },
        { name: "Gas recharge", low: 10000, high: 25000 },
        { name: "Fix AC leak", low: 10000, high: 30000 },
        { name: "Compressor repair", low: 25000, high: 60000 },
        { name: "Thermostat replacement", low: 8000, high: 18000 },
      ],
    },
    {
      category: "Installation",
      jobs: [
        { name: "Split unit install (9k BTU)", low: 30000, high: 60000, note: "Labour only" },
        { name: "Split unit install (18k BTU)", low: 40000, high: 80000, note: "Labour only" },
        { name: "Split unit install (24k BTU)", low: 50000, high: 100000, note: "Labour only" },
        { name: "Window unit install", low: 10000, high: 25000 },
      ],
    },
  ],
  carpenter: [
    {
      category: "Furniture & Cabinets",
      jobs: [
        { name: "Built-in wardrobe", low: 80000, high: 250000, note: "Depends on size/wood" },
        { name: "Kitchen cabinets (set)", low: 150000, high: 400000 },
        { name: "Bookshelf/shelving", low: 25000, high: 80000 },
        { name: "Wooden table", low: 40000, high: 150000 },
      ],
    },
    {
      category: "Doors, Windows & Repairs",
      jobs: [
        { name: "Door (hardwood)", low: 30000, high: 80000, note: "Purple heart/Kabukalli" },
        { name: "Door (softwood)", low: 15000, high: 35000 },
        { name: "Window frame repair", low: 10000, high: 30000 },
        { name: "Roof repair (minor)", low: 20000, high: 60000 },
        { name: "Furniture repair", low: 5000, high: 25000 },
      ],
    },
  ],
  mason: [
    {
      category: "Construction",
      jobs: [
        { name: "Block wall (per sq ft)", low: 1500, high: 3000 },
        { name: "Foundation (small house)", low: 200000, high: 600000 },
        { name: "House extension (room)", low: 300000, high: 800000, note: "Size dependent" },
        { name: "Concrete steps", low: 40000, high: 120000 },
        { name: "Column work", low: 30000, high: 80000 },
      ],
    },
    {
      category: "Finishes",
      jobs: [
        { name: "Tiling (per sq ft)", low: 800, high: 1800, note: "Labour only" },
        { name: "Plastering (per sq ft)", low: 500, high: 1200 },
        { name: "Fix cracked wall", low: 8000, high: 25000 },
        { name: "Retaining wall", low: 80000, high: 300000 },
      ],
    },
  ],
  painter: [
    {
      category: "Interior",
      jobs: [
        { name: "Single room", low: 15000, high: 35000, note: "Labour only" },
        { name: "Entire house interior", low: 80000, high: 200000, note: "3-bed house" },
        { name: "Touch-up work", low: 5000, high: 15000 },
      ],
    },
    {
      category: "Exterior",
      jobs: [
        { name: "House exterior", low: 60000, high: 200000, note: "Size dependent" },
        { name: "Fence/gate painting", low: 10000, high: 30000 },
        { name: "Waterproofing", low: 20000, high: 60000 },
      ],
    },
  ],
  welder: [
    {
      category: "Gates & Security",
      jobs: [
        { name: "Front gate (standard)", low: 80000, high: 250000 },
        { name: "Front gate (decorative/CNC)", low: 150000, high: 400000 },
        { name: "Burglar bars (per window)", low: 15000, high: 35000 },
        { name: "Window grills (per window)", low: 12000, high: 30000 },
      ],
    },
    {
      category: "Fencing & Other",
      jobs: [
        { name: "Metal fence (per ft)", low: 3000, high: 8000 },
        { name: "Railing (per ft)", low: 5000, high: 12000 },
        { name: "Metal roof structure", low: 100000, high: 350000 },
        { name: "Welding repair", low: 5000, high: 25000 },
      ],
    },
  ],
  mechanic: [
    {
      category: "Common Services",
      jobs: [
        { name: "Oil change", low: 5000, high: 12000, note: "Including oil" },
        { name: "Brake pads replacement", low: 10000, high: 30000 },
        { name: "Full service", low: 15000, high: 40000 },
        { name: "Tire change/balance", low: 3000, high: 8000, note: "Per tire" },
        { name: "Battery replacement", low: 5000, high: 15000, note: "Labour only" },
      ],
    },
    {
      category: "Major Repairs",
      jobs: [
        { name: "Engine diagnosis", low: 5000, high: 15000 },
        { name: "Transmission repair", low: 50000, high: 200000 },
        { name: "Car AC repair", low: 15000, high: 50000 },
        { name: "Suspension work", low: 20000, high: 60000 },
      ],
    },
  ],
};

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export default function PriceGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #002312 0%, #003d1e 25%, #009E49 60%, #006a32 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(252,209,22,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,200,80,0.15) 0%, transparent 40%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 py-14 text-center">
          <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h1 className="font-display text-3xl md:text-4xl mb-3">
            Guyana Price Guide
          </h1>
          <p className="text-green-200/90 text-lg max-w-xl mx-auto">
            Estimated costs for common trade jobs in Georgetown and across
            Guyana. Know what to expect before you hire.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="bg-brand-gold-50 border border-brand-gold-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-brand-gold-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand-gold-900 font-medium">
              These are estimates only
            </p>
            <p className="text-xs text-brand-gold-800 mt-1 leading-relaxed">
              Actual prices depend on the complexity of the job, materials used,
              location, and the tradesperson&apos;s experience. Prices shown are
              for labour unless noted otherwise. All amounts in Guyana Dollars
              (GYD). Always get a quote before work starts.
            </p>
          </div>
        </div>
      </div>

      {/* Price Tables */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {TRADES.map((trade) => {
          const priceCategories = PRICE_DATA[trade.id];
          if (!priceCategories) return null;

          return (
            <div key={trade.id} id={trade.id} className="scroll-mt-20">
              {/* Trade Header */}
              <div className="flex items-center gap-3 mb-4">
                <TradeIcon tradeId={trade.id} size="md" />
                <div>
                  <h2 className="font-display text-xl">{trade.localName}</h2>
                  <p className="text-xs text-text-muted">{trade.description}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                {priceCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="card border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-surface-muted px-4 py-2 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {cat.category}
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {cat.jobs.map((job) => (
                        <div
                          key={job.name}
                          className="px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">
                              {job.name}
                            </p>
                            {job.note && (
                              <p className="text-xs text-text-muted mt-0.5">
                                {job.note}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-brand-green-600">
                              {formatPrice(job.low)} — {formatPrice(job.high)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Find CTA */}
              <div className="mt-3 text-center">
                <Link
                  href={`/search?trade=${trade.id}`}
                  className="text-brand-green-500 text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Find {trade.localName}s near you
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="bg-surface-muted py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl mb-2">
            Got a price for a job?
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            When you leave a review, include what you paid. It helps your
            neighbours know if a quote is fair.
          </p>
          <Link
            href="/search"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find a Tradesperson
          </Link>
        </div>
      </section>
    </div>
  );
}
