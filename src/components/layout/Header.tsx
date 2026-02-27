"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Search, UserPlus, ChevronRight, DollarSign, Info, ShoppingBag, LogIn } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close on Escape key + lock body scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100/80 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/search"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Find Trades
            </Link>
            <Link
              href="/suggest"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Suggest
            </Link>
            <Link
              href="/price-guide"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              Prices
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-brand-green-600 px-4 py-2 rounded-lg hover:bg-brand-green-50 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm !py-2 !px-5 !rounded-lg">
              Sign Up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 -mr-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-50 transition-colors relative z-[60]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — full overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-x-0 top-16 bottom-0 bg-white z-50 md:hidden overflow-y-auto animate-fade-in"
          >
            <nav className="flex flex-col gap-1 p-4">
              <Link
                href="/search"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-brand-green-50 hover:text-brand-green-700 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Find Tradespeople</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/suggest"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-brand-green-50 hover:text-brand-green-700 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">Suggest Someone Good</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/price-guide"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-brand-green-50 hover:text-brand-green-700 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Price Guide</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-brand-green-50 hover:text-brand-green-700 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Materials Shop</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-brand-green-50 hover:text-brand-green-700 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">About ProFind</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="divider-guyana mx-4 my-3" />
              <div className="px-4 space-y-2">
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="btn-primary block text-center text-sm"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="btn-secondary block text-center text-sm"
                >
                  Log In
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
