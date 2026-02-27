"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2,
  User, Phone, Store, Wrench, ShoppingBag, MapPin, Clock, Truck, CheckCircle,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion } from "@/lib/data/areas";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/roles";

type Step = "role" | "account" | "details";

export default function SignupPage() {
  const router = useRouter();
  const areasByRegion = getAreasByRegion();

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole>("customer");

  // Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Provider
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [description, setDescription] = useState("");

  // Shop
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [shopArea, setShopArea] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [hours, setHours] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = role === "customer" ? 2 : 3;
  const currentStepNum = step === "role" ? 1 : step === "account" ? 2 : 3;

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep("account");
  };

  const handleAccountNext = () => {
    setError("");
    if (!name.trim()) { setError("Your name is required"); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if ((role === "provider" || role === "shop_owner") && !phone.trim()) {
      setError("Phone number is required"); return;
    }

    if (role === "customer") {
      handleSubmit();
    } else {
      setStep("details");
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (role === "provider" && selectedTrades.length === 0) {
      setError("Select at least one trade"); return;
    }
    if (role === "shop_owner" && !shopName.trim()) {
      setError("Shop name is required"); return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        phone: phone.trim() || null,
        whatsapp: (whatsapp || phone).trim() || null,
        role,
      };

      if (role === "provider") {
        payload.trades = selectedTrades;
        payload.areas = selectedAreas.length > 0 ? selectedAreas : ["gt-georgetown"];
        payload.yearsExperience = yearsExperience || null;
        payload.description = description.trim() || null;
      }

      if (role === "shop_owner") {
        payload.shopName = shopName.trim();
        payload.address = address.trim() || null;
        payload.area = shopArea || null;
        payload.shopDescription = shopDescription.trim() || null;
        payload.hours = hours.trim() || null;
        payload.deliveryAvailable = deliveryAvailable;
      }

      const res = await fetch("/api/auth/unified-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Auto-login
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        router.push("/login?registered=true");
        return;
      }

      // Redirect based on role
      if (role === "provider") router.push("/dashboard");
      else if (role === "shop_owner") router.push("/shop-dashboard");
      else router.push("/");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(false);
  };

  const toggleTrade = (id: string) => {
    setSelectedTrades((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => {
              if (step === "details") setStep("account");
              else if (step === "account") setStep("role");
              else router.back();
            }}
            className="p-2 -ml-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold">Create Account</h1>
            <p className="text-xs text-text-muted">Step {currentStepNum} of {totalSteps}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < currentStepNum ? "bg-brand-green-500" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
          </div>
        )}

        {/* STEP 1: Role selection */}
        {step === "role" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl">I want to...</h2>
              <p className="text-sm text-text-secondary mt-1">You can always add more roles later</p>
            </div>

            <button onClick={() => handleRoleSelect("customer")}
              className="card w-full p-5 border-2 border-gray-200 hover:border-brand-green-400 hover:bg-brand-green-50/30 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Find tradespeople & shop</h3>
                  <p className="text-xs text-text-muted mt-0.5">Browse providers, request quotes, compare material prices</p>
                </div>
              </div>
            </button>

            <button onClick={() => handleRoleSelect("provider")}
              className="card w-full p-5 border-2 border-gray-200 hover:border-brand-green-400 hover:bg-brand-green-50/30 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6 text-brand-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Offer my trade services</h3>
                  <p className="text-xs text-text-muted mt-0.5">Get a profile, collect reviews, receive job leads</p>
                </div>
              </div>
            </button>

            <button onClick={() => handleRoleSelect("shop_owner")}
              className="card w-full p-5 border-2 border-gray-200 hover:border-brand-gold-400 hover:bg-brand-gold-50/30 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6 text-brand-gold-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">List my hardware store</h3>
                  <p className="text-xs text-text-muted mt-0.5">Add products, set prices, let tradespeople find you</p>
                </div>
              </div>
            </button>

            <p className="text-center text-sm text-text-muted pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-green-600 font-medium hover:underline">Log in</Link>
            </p>
          </div>
        )}

        {/* STEP 2: Account details */}
        {step === "account" && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                role === "provider" ? "bg-brand-green-100" : role === "shop_owner" ? "bg-brand-gold-100" : "bg-blue-100"
              }`}>
                {role === "provider" ? <Wrench className="w-7 h-7 text-brand-green-600" /> :
                 role === "shop_owner" ? <Store className="w-7 h-7 text-brand-gold-700" /> :
                 <User className="w-7 h-7 text-blue-500" />}
              </div>
              <h2 className="font-display text-xl">Your account</h2>
            </div>

            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium mb-1.5">Your Name *</label>
              <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-field" placeholder="Full name" autoFocus />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-10" placeholder="you@email.com" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="signup-password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-10 !pr-10" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {(role === "provider" || role === "shop_owner") && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium mb-1.5">Phone *</label>
                  <input id="signup-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="input-field" placeholder="600 1234" />
                </div>
                <div>
                  <label htmlFor="signup-whatsapp" className="block text-sm font-medium mb-1.5">WhatsApp</label>
                  <input id="signup-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    className="input-field" placeholder="Same as phone?" />
                </div>
              </div>
            )}

            <button onClick={handleAccountNext} className="btn-primary w-full !py-3 text-base">
              {role === "customer" ? (loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Creating...</> : "Create Account") : "Continue"}
            </button>
          </div>
        )}

        {/* STEP 3: Role-specific details */}
        {step === "details" && role === "provider" && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-7 h-7 text-brand-green-600" />
              </div>
              <h2 className="font-display text-xl">Your trade</h2>
              <p className="text-sm text-text-secondary mt-1">What do you do?</p>
            </div>

            {/* Trades */}
            <div>
              <label className="block text-sm font-medium mb-2">Select your trade(s) *</label>
              <div className="grid grid-cols-2 gap-2">
                {TRADES.map((t) => (
                  <button key={t.id} type="button" onClick={() => toggleTrade(t.id)}
                    className={`p-3 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedTrades.includes(t.id)
                        ? "border-brand-green-400 bg-brand-green-50 text-brand-green-700 ring-1 ring-brand-green-200"
                        : "border-gray-200 hover:border-gray-300 text-text-secondary"
                    }`}>
                    <span>{t.icon}</span> {t.localName}
                  </button>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div>
              <label className="block text-sm font-medium mb-2">Areas you serve</label>
              {Object.entries(areasByRegion).map(([region, areas]) => (
                <div key={region} className="mb-2">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{region}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {areas.map((a) => (
                      <button key={a.id} type="button" onClick={() => toggleArea(a.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedAreas.includes(a.id)
                            ? "bg-brand-green-500 text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                        }`}>
                        {a.shortName}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-years" className="block text-sm font-medium mb-1.5">Years experience</label>
                <input id="signup-years" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}
                  className="input-field" placeholder="e.g. 5" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-description" className="block text-sm font-medium mb-1.5">About you</label>
              <textarea id="signup-description" value={description} onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[80px] resize-y" placeholder="What are you known for?" maxLength={500} />
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full !py-3 text-base flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create My Profile"}
            </button>
          </div>
        )}

        {step === "details" && role === "shop_owner" && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Store className="w-7 h-7 text-brand-gold-700" />
              </div>
              <h2 className="font-display text-xl">Shop details</h2>
              <p className="text-sm text-text-secondary mt-1">Tell tradespeople about your store</p>
            </div>

            <div>
              <label htmlFor="signup-shopname" className="block text-sm font-medium mb-1.5">Shop Name *</label>
              <input id="signup-shopname" type="text" value={shopName} onChange={(e) => setShopName(e.target.value)}
                className="input-field" placeholder="e.g. Starr Hardware" autoFocus />
            </div>

            <div>
              <label htmlFor="signup-address" className="block text-sm font-medium mb-1.5">Address</label>
              <input id="signup-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="input-field" placeholder="123 Regent Street, Georgetown" />
            </div>

            <div>
              <label htmlFor="signup-shoparea" className="block text-sm font-medium mb-1.5">Area</label>
              <select id="signup-shoparea" value={shopArea} onChange={(e) => setShopArea(e.target.value)} className="input-field">
                <option value="">Select area...</option>
                {Object.entries(areasByRegion).map(([region, areas]) => (
                  <optgroup key={region} label={region}>
                    {areas.map((a) => <option key={a.id} value={a.id}>{a.shortName}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="signup-shopdesc" className="block text-sm font-medium mb-1.5">Description</label>
              <textarea id="signup-shopdesc" value={shopDescription} onChange={(e) => setShopDescription(e.target.value)}
                className="input-field min-h-[80px] resize-y" placeholder="What do you sell?" maxLength={500} />
            </div>

            <div>
              <label htmlFor="signup-hours" className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Opening Hours
              </label>
              <input id="signup-hours" type="text" value={hours} onChange={(e) => setHours(e.target.value)}
                className="input-field" placeholder="Mon-Sat 7am-5pm" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input id="signup-delivery" type="checkbox" checked={deliveryAvailable}
                onChange={(e) => setDeliveryAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-green-500 focus:ring-brand-green-500" />
              <span className="flex items-center gap-1.5 text-sm">
                <Truck className="w-4 h-4 text-text-muted" /> We offer delivery
              </span>
            </label>

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full !py-3 text-base flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Register My Shop"}
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-text-muted">
          🏪 100% free to join. Upgrade later for premium features.
        </p>
      </div>
    </div>
  );
}
