"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  ImageIcon,
  Camera,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { getAreasByRegion } from "@/lib/data/areas";
import { useProviderAuth } from "@/components/auth/ProviderAuthContext";
import { PhotoUpload } from "@/components/ui/PhotoUpload";

const RESPONSE_TIME_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "Usually responds within 30 minutes", label: "Within 30 minutes" },
  { value: "Usually responds within 1 hour", label: "Within 1 hour" },
  { value: "Usually responds within 2 hours", label: "Within 2 hours" },
  { value: "Usually responds same day", label: "Same day" },
  { value: "Usually responds within 24 hours", label: "Within 24 hours" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface ProviderProfile {
  id: string;
  name: string;
  phone: string;
  description: string;
  trades: string[];
  areas: string[];
  yearsExperience: number | null;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
  responseTime: string | null;
  servicesOffered: string[];
  photoUrl: string | null;
  workPhotos: string[];
}

export default function ProfileEditPage() {
  const { provider: session, user, isLoading: authLoading } = useProviderAuth();
  const areasByRegion = getAreasByRegion();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [priceRangeLow, setPriceRangeLow] = useState("");
  const [priceRangeHigh, setPriceRangeHigh] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [workPhotos, setWorkPhotos] = useState<string[]>([]);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch profile data
  useEffect(() => {
    if (!session?.id) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/providers/${session!.id}/profile`);
        if (res.ok) {
          const data = await res.json();
          const p = data.provider;
          setProfile(p);
          setName(p.name || "");
          setPhone(p.phone || "");
          setDescription(p.description || "");
          setSelectedTrades(p.trades || []);
          setSelectedAreas(p.areas || []);
          setYearsExperience(p.yearsExperience?.toString() || "");
          setPriceRangeLow(p.priceRangeLow?.toString() || "");
          setPriceRangeHigh(p.priceRangeHigh?.toString() || "");
          setResponseTime(p.responseTime || "");
          setServicesOffered(p.servicesOffered || []);
          setPhotoUrl(p.photoUrl || null);
          setWorkPhotos(p.workPhotos || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [session]);

  // Track changes
  useEffect(() => {
    if (!profile) return;
    const changed =
      name !== (profile.name || "") ||
      phone !== (profile.phone || "") ||
      description !== (profile.description || "") ||
      JSON.stringify(selectedTrades) !== JSON.stringify(profile.trades || []) ||
      JSON.stringify(selectedAreas) !== JSON.stringify(profile.areas || []) ||
      yearsExperience !== (profile.yearsExperience?.toString() || "") ||
      priceRangeLow !== (profile.priceRangeLow?.toString() || "") ||
      priceRangeHigh !== (profile.priceRangeHigh?.toString() || "") ||
      responseTime !== (profile.responseTime || "") ||
      JSON.stringify(servicesOffered) !== JSON.stringify(profile.servicesOffered || []) ||
      photoUrl !== (profile.photoUrl || null) ||
      JSON.stringify(workPhotos) !== JSON.stringify(profile.workPhotos || []);
    setHasChanges(changed);
  }, [name, phone, description, selectedTrades, selectedAreas, yearsExperience, priceRangeLow, priceRangeHigh, responseTime, servicesOffered, photoUrl, workPhotos, profile]);

  const handleToggleTrade = (tradeId: string) => {
    setSelectedTrades((prev) =>
      prev.includes(tradeId)
        ? prev.filter((t) => t !== tradeId)
        : [...prev, tradeId]
    );
  };

  const handleToggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((a) => a !== areaId)
        : [...prev, areaId]
    );
  };

  const handleAddService = () => {
    const trimmed = newService.trim();
    if (trimmed && !servicesOffered.includes(trimmed)) {
      setServicesOffered([...servicesOffered, trimmed]);
      setNewService("");
    }
  };

  const handleRemoveService = (service: string) => {
    setServicesOffered(servicesOffered.filter((s) => s !== service));
  };

  const handleSave = async () => {
    if (!name.trim()) { setErrorMessage("Name is required"); return; }
    if (!phone.trim()) { setErrorMessage("Phone number is required"); return; }
    if (selectedTrades.length === 0) { setErrorMessage("Select at least one trade"); return; }
    if (selectedAreas.length === 0) { setErrorMessage("Select at least one area"); return; }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/providers/${session!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: phone, // Use phone as PIN for auth
          name: name.trim(),
          phone: phone.trim(),
          description: description.trim(),
          trades: selectedTrades,
          areas: selectedAreas,
          yearsExperience: yearsExperience || undefined,
          priceRangeLow: priceRangeLow || undefined,
          priceRangeHigh: priceRangeHigh || undefined,
          responseTime: responseTime || undefined,
          servicesOffered,
          photoUrl: photoUrl || undefined,
          workPhotos,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save");

      // Update local profile state to reflect saved values
      setProfile({
        ...profile!,
        name: name.trim(),
        phone: phone.trim(),
        description: description.trim(),
        trades: selectedTrades,
        areas: selectedAreas,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        priceRangeLow: priceRangeLow ? parseInt(priceRangeLow) : null,
        priceRangeHigh: priceRangeHigh ? parseInt(priceRangeHigh) : null,
        responseTime: responseTime || null,
        servicesOffered,
        photoUrl: photoUrl,
        workPhotos,
      });

      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" />
      </div>
    );
  }

  if (!user || !session) return null;

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Sticky header with save button */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 -ml-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Edit Profile</h1>
              {hasChanges && (
                <p className="text-xs text-brand-gold-700">Unsaved changes</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === "saving"}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] ${
              saveStatus === "saved"
                ? "bg-emerald-500 text-white"
                : saveStatus === "error"
                ? "bg-red-500 text-white"
                : hasChanges
                ? "bg-brand-green-500 text-white hover:bg-brand-green-600 shadow-md shadow-brand-green-500/20"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saveStatus === "saving" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : saveStatus === "saved" ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : saveStatus === "error" ? (
              <><AlertCircle className="w-4 h-4" /> Error</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Error banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* PROFILE PHOTO */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Profile Photo
          </h2>
          <PhotoUpload
            bucket="provider-photos"
            folder={session.id}
            type="avatar"
            currentUrl={photoUrl || undefined}
            onUpload={(url) => setPhotoUrl(url)}
            avatarMode
            hint="Square photo works best. Customers see this on your profile."
          />
        </section>

        {/* BASIC INFO */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Business / Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Marcus Williams Plumbing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              WhatsApp / Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="592-xxx-xxxx"
            />
            <p className="text-xs text-text-muted mt-1">
              This is the number customers will WhatsApp you on
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              About You / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="Tell customers about your experience, specialties, and what makes you different..."
              maxLength={1000}
            />
            <p className="text-xs text-text-muted mt-1 text-right">
              {description.length}/1000
            </p>
          </div>
        </section>

        {/* TRADES */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Trades <span className="text-red-500 normal-case text-xs">*</span>
          </h2>
          <p className="text-xs text-text-muted -mt-2">
            Select all trades you offer
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TRADES.map((trade) => {
              const isSelected = selectedTrades.includes(trade.id);
              return (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => handleToggleTrade(trade.id)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? "border-brand-green-400 bg-brand-green-50 text-brand-green-700 ring-1 ring-brand-green-200"
                      : "border-gray-200 hover:border-gray-300 text-text-secondary"
                  }`}
                >
                  <span className="text-base">{trade.icon}</span>
                  <span>{trade.localName}</span>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 ml-auto text-brand-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* AREAS */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Areas You Serve <span className="text-red-500 normal-case text-xs">*</span>
          </h2>
          <p className="text-xs text-text-muted -mt-2">
            {selectedAreas.length} area{selectedAreas.length !== 1 ? "s" : ""} selected
          </p>
          {Object.entries(areasByRegion).map(([region, areas]) => (
            <div key={region}>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {region}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {areas.map((area) => {
                  const isSelected = selectedAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => handleToggleArea(area.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-brand-green-500 text-white shadow-sm"
                          : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                      }`}
                    >
                      {area.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* EXPERIENCE & PRICING */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Experience & Pricing
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Years of Experience</label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="input-field w-32"
              placeholder="e.g. 10"
              min="0"
              max="60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Price Range (GYD)</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                <input
                  type="number"
                  value={priceRangeLow}
                  onChange={(e) => setPriceRangeLow(e.target.value)}
                  className="input-field !pl-7"
                  placeholder="5,000"
                  min="0"
                />
              </div>
              <span className="text-text-muted font-medium">—</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                <input
                  type="number"
                  value={priceRangeHigh}
                  onChange={(e) => setPriceRangeHigh(e.target.value)}
                  className="input-field !pl-7"
                  placeholder="100,000"
                  min="0"
                />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Typical range for your jobs. Helps customers know what to expect.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Response Time
            </label>
            <select
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              className="input-field"
            >
              {RESPONSE_TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* SERVICES */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Services You Offer
          </h2>
          <p className="text-xs text-text-muted -mt-2">
            List specific services (e.g. &quot;Kitchen sink installation&quot;, &quot;AC servicing&quot;)
          </p>

          {servicesOffered.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {servicesOffered.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-text-secondary text-sm px-3 py-1.5 rounded-lg"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleAddService(); }
              }}
              className="input-field flex-1"
              placeholder="Type a service and press Enter..."
            />
            <button
              type="button"
              onClick={handleAddService}
              disabled={!newService.trim()}
              className="btn-secondary !py-2 !px-4 flex items-center gap-1 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </section>

        {/* WORK PHOTOS */}
        <section className="card p-5 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Work Photos
          </h2>
          <p className="text-xs text-text-muted -mt-2">
            Show off your best work. Customers love seeing real photos of completed jobs.
          </p>
          <PhotoUpload
            bucket="provider-photos"
            folder={session.id}
            type="work"
            currentUrls={workPhotos}
            onUpload={(url) => setWorkPhotos((prev) => [...prev, url])}
            onRemove={(url) => setWorkPhotos((prev) => prev.filter((u) => u !== url))}
            multiple
            maxPhotos={8}
          />
        </section>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link
            href="/dashboard"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href={`/provider/${session.id}`}
            className="text-sm text-brand-green-500 font-medium hover:underline"
          >
            View public profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
