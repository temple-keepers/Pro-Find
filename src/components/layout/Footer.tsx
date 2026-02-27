import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="text-white mt-auto" style={{ backgroundColor: '#0C1F0F' }}>
      {/* Guyana flag stripe */}
      <div className="divider-guyana" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <Logo size="sm" variant="icon" />
              <span className="font-display text-lg text-white">
                Pro<span className="text-brand-green-300">Find</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting Guyanese with trusted tradespeople.
              Built with{" "}
              <Heart className="w-3 h-3 inline text-brand-red-500 fill-brand-red-500" />{" "}
              for Guyana.
            </p>
          </div>

          {/* Find Help */}
          <div>
            <h3 className="font-semibold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              Find Help
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link href="/search" className="text-sm text-gray-400 hover:text-white transition-colors">
                Search Tradespeople
              </Link>
              <Link href="/suggest" className="text-sm text-gray-400 hover:text-white transition-colors">
                Suggest Someone Good
              </Link>
              <Link href="/price-guide" className="text-sm text-gray-400 hover:text-white transition-colors">
                Price Guide
              </Link>
              <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                Materials Shop
              </Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                About ProFind
              </Link>
            </nav>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-semibold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              For Tradespeople
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign Up / Claim Profile
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Provider Dashboard
              </Link>
              <Link href="/dashboard/quotes" className="text-sm text-gray-400 hover:text-white transition-colors">
                Quick Quote Tool
              </Link>
            </nav>
          </div>

          {/* For Shop Owners */}
          <div>
            <h3 className="font-semibold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              For Shop Owners
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">
                Register Your Shop
              </Link>
              <Link href="/shop-dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Shop Dashboard
              </Link>
              <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                Browse Materials
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ProFind Guyana. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-base">🇬🇾</span> Made in Guyana, for Guyana
          </p>
        </div>
      </div>
    </footer>
  );
}
