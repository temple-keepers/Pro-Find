"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, X, Loader2, Plus, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  bucket: "provider-photos" | "review-photos";
  folder: string;
  type: "avatar" | "work" | "review";
  currentUrl?: string;
  currentUrls?: string[];
  onUpload: (url: string) => void;
  onRemove?: (url: string) => void;
  multiple?: boolean;
  maxPhotos?: number;
  label?: string;
  hint?: string;
  avatarMode?: boolean; // Single circular avatar
}

export function PhotoUpload({
  bucket,
  folder,
  type,
  currentUrl,
  currentUrls = [],
  onUpload,
  onRemove,
  multiple = false,
  maxPhotos = 6,
  label,
  hint,
  avatarMode = false,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError("");
    
    // Client-side validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  }, [bucket, folder, type, onUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Upload each file
    Array.from(files).forEach((file) => uploadFile(file));
    
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    Array.from(files).forEach((file) => uploadFile(file));
  };

  // --- AVATAR MODE ---
  if (avatarMode) {
    return (
      <div className="flex flex-col items-center gap-3">
        {label && <label className="text-sm font-medium">{label}</label>}
        
        <div className="relative group">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-green-100 to-brand-green-50 ring-2 ring-brand-green-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-brand-green-400" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-brand-green-600 font-medium hover:underline disabled:opacity-50"
        >
          {uploading ? "Uploading..." : currentUrl ? "Change Photo" : "Upload Photo"}
        </button>

        {hint && <p className="text-xs text-text-muted">{hint}</p>}
        
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // --- MULTI-PHOTO MODE ---
  const photos = currentUrls;
  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium block">{label}</label>}
      {hint && <p className="text-xs text-text-muted -mt-1">{hint}</p>}

      <div className="grid grid-cols-3 gap-3">
        {/* Existing photos */}
        {photos.map((url, i) => (
          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden ring-1 ring-gray-200">
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragOver
                ? "border-brand-green-400 bg-brand-green-50"
                : "border-gray-300 hover:border-brand-green-300 hover:bg-gray-50"
            }`}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-brand-green-400 animate-spin" />
            ) : (
              <>
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-text-muted">Add Photo</span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}

      <p className="text-xs text-text-muted">
        {photos.length}/{maxPhotos} photos · JPEG, PNG, or WebP · Max 5MB each
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
