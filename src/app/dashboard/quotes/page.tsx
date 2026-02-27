"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  FileText,
  DollarSign,
  CheckCircle,
  Copy,
  MessageCircle,
} from "lucide-react";
import { SEED_PROVIDERS } from "@/lib/data/seed-providers";
import { formatGYD } from "@/lib/utils/pricing";

const DEMO_PROVIDER = SEED_PROVIDERS.find((p) => p.isClaimed) || SEED_PROVIDERS[0];

interface MaterialItem {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function QuotesPage() {
  const provider = DEMO_PROVIDER;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: generateId(), name: "", qty: 1, unitCost: 0 },
  ]);
  const [labourCost, setLabourCost] = useState("");
  const [notes, setNotes] = useState("");
  const [generated, setGenerated] = useState(false);

  const addMaterial = () => {
    setMaterials([...materials, { id: generateId(), name: "", qty: 1, unitCost: 0 }]);
  };

  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: string | number) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const materialsTotal = materials.reduce(
    (sum, m) => sum + m.qty * m.unitCost,
    0
  );
  const labourTotal = parseInt(labourCost) || 0;
  const grandTotal = materialsTotal + labourTotal;

  const handleGenerate = () => {
    if (!jobDescription.trim()) return;
    setGenerated(true);
  };

  const quoteText = `
📋 *QUOTE — ${provider.name}*
${provider.phone ? `📞 +592 ${provider.phone}` : ""}
${"─".repeat(30)}

${customerName ? `*Customer:* ${customerName}` : ""}
*Job:* ${jobDescription}

${materials.filter((m) => m.name).length > 0 ? `*Materials:*
${materials
  .filter((m) => m.name)
  .map((m) => `• ${m.name} — ${m.qty} × ${formatGYD(m.unitCost)} = ${formatGYD(m.qty * m.unitCost)}`)
  .join("\n")}
*Materials Subtotal:* ${formatGYD(materialsTotal)}` : ""}

*Labour:* ${formatGYD(labourTotal)}

${"═".repeat(30)}
*TOTAL: ${formatGYD(grandTotal)} GYD*
${"═".repeat(30)}

${notes ? `*Notes:* ${notes}` : ""}

_Quote generated via ProFind Guyana_
_profindguyana.com/provider/${provider.id}_
  `.trim();

  const handleWhatsAppSend = () => {
    const phone = customerPhone.replace(/\D/g, "");
    const withCountry = phone.startsWith("592") ? phone : `592${phone}`;
    const encoded = encodeURIComponent(quoteText);
    window.open(`https://wa.me/${withCountry}?text=${encoded}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
  };

  if (generated) {
    return (
      <div className="min-h-screen bg-surface-warm">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setGenerated(false)}
              className="p-1 -ml-1 text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-sm">Quote Ready</h1>
              <p className="text-xs text-text-muted">
                Send via WhatsApp or copy
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Quote Preview */}
          <div className="card p-5 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-brand-green-600" />
              <h2 className="font-semibold">Quote Preview</h2>
            </div>

            {/* Formatted Quote Card */}
            <div className="bg-surface-warm rounded-xl p-4 border border-gray-100">
              <div className="border-b border-gray-200 pb-3 mb-3">
                <p className="font-bold text-lg">{provider.name}</p>
                <p className="text-xs text-text-muted">+592 {provider.phone}</p>
              </div>

              {customerName && (
                <p className="text-sm mb-1">
                  <span className="text-text-muted">Customer:</span>{" "}
                  {customerName}
                </p>
              )}
              <p className="text-sm mb-3">
                <span className="text-text-muted">Job:</span> {jobDescription}
              </p>

              {/* Materials */}
              {materials.filter((m) => m.name).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Materials
                  </p>
                  <div className="space-y-1">
                    {materials
                      .filter((m) => m.name)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {m.name}{" "}
                            <span className="text-text-muted">
                              × {m.qty}
                            </span>
                          </span>
                          <span className="font-medium">
                            {formatGYD(m.qty * m.unitCost)}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-gray-200">
                    <span>Materials Subtotal</span>
                    <span>{formatGYD(materialsTotal)}</span>
                  </div>
                </div>
              )}

              {/* Labour */}
              <div className="flex justify-between text-sm mb-3">
                <span>Labour</span>
                <span className="font-medium">{formatGYD(labourTotal)}</span>
              </div>

              {/* Total */}
              <div className="bg-brand-green-500 text-white rounded-xl p-3 flex justify-between items-center">
                <span className="font-semibold">TOTAL</span>
                <span className="text-xl font-bold">
                  {formatGYD(grandTotal)} GYD
                </span>
              </div>

              {notes && (
                <p className="text-xs text-text-muted mt-3">
                  <span className="font-medium">Notes:</span> {notes}
                </p>
              )}

              <p className="text-xs text-text-muted mt-3 text-center">
                Quote via ProFind Guyana
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {customerPhone && (
              <button
                onClick={handleWhatsAppSend}
                className="btn-whatsapp w-full justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Send to {customerName || "Customer"} via WhatsApp
              </button>
            )}

            <button
              onClick={handleCopy}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Quote Text
            </button>

            <button
              onClick={() => {
                setGenerated(false);
                setCustomerName("");
                setCustomerPhone("");
                setJobDescription("");
                setMaterials([{ id: generateId(), name: "", qty: 1, unitCost: 0 }]);
                setLabourCost("");
                setNotes("");
              }}
              className="text-sm text-brand-green-500 font-medium w-full text-center py-2 hover:underline"
            >
              Create Another Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1 -ml-1 text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-sm">Quick Quote</h1>
            <p className="text-xs text-text-muted">
              Generate a professional quote in minutes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="space-y-5">
          {/* Customer Details */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Customer</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sandra Gonsalves"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Customer Phone (for WhatsApp send)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-surface-muted border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                    +592
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="600 1234"
                    className="input-field text-sm !rounded-l-none flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Job Details *</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Repair leaking pipe under kitchen sink, replace corroded section, test for pressure"
              rows={3}
              className="input-field text-sm resize-none"
              required
            />
          </div>

          {/* Materials */}
          <div className="card p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Materials</h2>
              <button
                type="button"
                onClick={addMaterial}
                className="text-xs text-brand-green-500 font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {materials.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateMaterial(item.id, "name", e.target.value)
                      }
                      placeholder={`Item ${index + 1} (e.g. PVC Pipe 3")`}
                      className="input-field text-sm !py-2"
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      value={item.qty || ""}
                      onChange={(e) =>
                        updateMaterial(item.id, "qty", parseInt(e.target.value) || 0)
                      }
                      placeholder="Qty"
                      min="1"
                      className="input-field text-sm !py-2 text-center"
                    />
                  </div>
                  <div className="w-24">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="number"
                        value={item.unitCost || ""}
                        onChange={(e) =>
                          updateMaterial(
                            item.id,
                            "unitCost",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Cost"
                        className="input-field text-sm !py-2 !pl-7"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(item.id)}
                    disabled={materials.length === 1}
                    className="p-2 text-text-muted hover:text-red-500 disabled:opacity-30 disabled:hover:text-text-muted"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {materialsTotal > 0 && (
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-text-muted">Materials Total</span>
                <span className="text-sm font-semibold">
                  {formatGYD(materialsTotal)}
                </span>
              </div>
            )}
          </div>

          {/* Labour */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Labour Cost</h2>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="number"
                value={labourCost}
                onChange={(e) => setLabourCost(e.target.value)}
                placeholder="e.g. 15000"
                className="input-field text-sm !pl-9"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5 border border-gray-100">
            <h2 className="text-sm font-semibold mb-3">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Price includes all materials. Work guaranteed for 6 months. Expected completion: 2 days."
              rows={2}
              className="input-field text-sm resize-none"
            />
          </div>

          {/* Running Total */}
          {grandTotal > 0 && (
            <div className="card p-4 bg-brand-green-500 text-white border-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Quote Total</span>
                <span className="text-2xl font-bold">
                  {formatGYD(grandTotal)} GYD
                </span>
              </div>
            </div>
          )}

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!jobDescription.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
}
