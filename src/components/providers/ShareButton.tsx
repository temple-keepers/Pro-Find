"use client";

import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    // Use native Web Share API if available (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: prompt
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors"
      aria-label="Share profile"
    >
      {copied ? (
        <Check className="w-5 h-5 text-brand-green-500" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  );
}
