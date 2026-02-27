"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { useShopAuth } from "@/components/auth/AuthContext";
import { PricingCards } from "@/components/ui/PricingCards";
import { SHOP_PLANS, getPlanById, formatGYD } from "@/lib/plans";
import { formatWhatsAppUrl } from "@/lib/utils/whatsapp";

export default function ShopUpgradePage() {
  const { shop, isLoading } = useShopAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  if (!shop) return null;

  const currentPlan = "shop_free";
  const plan = selectedPlan ? getPlanById(selectedPlan) : null;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowConfirm(true);
  };

  const upgradeWhatsAppMsg = plan
    ? `Hi ProFind! I'd like to upgrade my shop to the ${plan.name} plan ($${formatGYD(plan.priceMonthly)}/month). Shop name: ${shop.name}`
    : "";
  const upgradeWhatsAppUrl = formatWhatsAppUrl("5926001234", upgradeWhatsAppMsg);

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/shop-dashboard" className="p-2 -ml-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold">Upgrade Your Shop</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl mb-2">Reach More Tradespeople</h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            List unlimited products, get featured placement, and track how tradespeople engage with your store.
          </p>
        </div>

        <PricingCards
          plans={SHOP_PLANS}
          currentPlanId={currentPlan}
          userType="shop"
          onSelectPlan={handleSelectPlan}
        />

        <div className="mt-10 text-center">
          <p className="text-xs text-text-muted">
            Free shops can list up to 10 products. Upgrade anytime, cancel anytime.
          </p>
        </div>
      </div>

      {showConfirm && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center mb-5">
              <CheckCircle className="w-12 h-12 text-brand-gold-500 mx-auto mb-3" />
              <h3 className="font-display text-xl">Upgrade to {plan.name}</h3>
              <p className="text-2xl font-bold mt-2">${formatGYD(plan.priceMonthly)}<span className="text-sm font-normal text-text-muted">/month</span></p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-text-secondary space-y-2">
              <p>To activate your upgrade:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap the WhatsApp button below</li>
                <li>Complete payment via bank transfer or mobile money</li>
                <li>Your plan activates within 1 hour</li>
              </ol>
            </div>

            <a href={upgradeWhatsAppUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors mb-3">
              <MessageCircle className="w-5 h-5" />
              WhatsApp to Upgrade
            </a>

            <button onClick={() => { setShowConfirm(false); setSelectedPlan(null); }}
              className="w-full py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors">
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
