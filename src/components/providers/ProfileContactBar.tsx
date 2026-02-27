"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";
import { SharePrompt } from "./SharePrompt";

interface ProfileContactBarProps {
  phone: string;
  providerName: string;
  tradeName?: string;
  tradeId?: string;
  providerId: string;
}

export function ProfileContactBar({
  phone,
  providerName,
  tradeName,
  tradeId,
  providerId,
}: ProfileContactBarProps) {
  const [showSharePrompt, setShowSharePrompt] = useState(false);

  const handleContact = () => {
    // Show share prompt after a short delay (user will see it when they return from WhatsApp)
    setTimeout(() => setShowSharePrompt(true), 1500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Share prompt — appears above the sticky bar */}
      {showSharePrompt && (
        <div className="max-w-3xl mx-auto px-3 pb-2">
          <SharePrompt
            show={showSharePrompt}
            shareText={`Check out ${providerName} on ProFind Guyana — rated ${tradeName || "tradesperson"}`}
            onDismiss={() => setShowSharePrompt(false)}
          />
        </div>
      )}

      <div className="bg-white border-t border-gray-100 p-3">
        <div className="max-w-3xl mx-auto flex gap-2">
          <WhatsAppButton
            phone={phone}
            providerName={providerName}
            trade={tradeName}
            providerId={providerId}
            sourcePage="profile"
            size="lg"
            className="flex-1 justify-center"
            onContact={handleContact}
          />
          <Link
            href={`/request-quote?trade=${tradeId || ""}&provider=${encodeURIComponent(providerName)}`}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-brand-gold-400 hover:bg-brand-gold-500 text-gray-900 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
