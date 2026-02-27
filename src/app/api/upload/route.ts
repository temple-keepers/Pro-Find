import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    // Require authentication for file uploads
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    // Rate limit uploads
    const rlKey = getRateLimitKey(request, `upload:${auth.user.authId}`);
    const rl = checkRateLimit(rlKey, RATE_LIMITS.upload);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Upload limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string; // 'provider-photos' or 'review-photos'
    const folder = formData.get("folder") as string; // e.g. provider ID or 'reviews/provider-id'
    const type = formData.get("type") as string; // 'avatar', 'work', 'review'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!bucket || !["provider-photos", "review-photos"].includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    if (!folder) {
      return NextResponse.json({ error: "Folder is required" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Generate unique filename
    const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${type || "photo"}-${timestamp}-${random}.${ext}`;

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: "Upload failed: " + error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
