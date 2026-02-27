"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface WorkPhotoGalleryProps {
  photos: string[];
  providerName: string;
}

export function WorkPhotoGallery({ photos, providerName }: WorkPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="relative group overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-brand-green-500"
          >
            <Image
              src={photo}
              alt={`Work by ${providerName} (${i + 1})`}
              width={200}
              height={200}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
          }}
          role="dialog"
          aria-label="Photo viewer"
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 p-2 text-white/70 hover:text-white bg-black/30 rounded-full z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 p-2 text-white/70 hover:text-white bg-black/30 rounded-full z-10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={photos[lightboxIndex]}
            alt={`Work by ${providerName} (${lightboxIndex + 1} of ${photos.length})`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
