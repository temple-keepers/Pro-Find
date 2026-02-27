import { NextRequest, NextResponse } from "next/server";
import { createJob, advanceJobStatus } from "@/lib/supabase/queries";
import { requireProviderOwner, requireAuth } from "@/lib/auth/api-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { providerId, customerName, customerPhone, jobDescription, totalAgreed, quoteId } = body;

    if (!providerId || !customerName || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the authenticated user owns this provider
    const auth = await requireProviderOwner(providerId);
    if (auth.error) return auth.error;

    const result = await createJob({
      providerId,
      customerName,
      customerPhone,
      jobDescription,
      totalAgreed: totalAgreed ? parseInt(totalAgreed) : undefined,
      quoteId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Job API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Require authentication for advancing job status
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await request.json();

    const { jobId, nextStatus, note } = body;

    if (!jobId || !nextStatus) {
      return NextResponse.json(
        { error: "Missing jobId or nextStatus" },
        { status: 400 }
      );
    }

    // Validate nextStatus is a valid status value
    const validStatuses = ["deposit_paid", "materials_purchased", "work_started", "half_complete", "final_inspection", "complete", "disputed"];
    if (!validStatuses.includes(nextStatus)) {
      return NextResponse.json(
        { error: "Invalid job status" },
        { status: 400 }
      );
    }

    const success = await advanceJobStatus(jobId, nextStatus, note);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to advance job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job advance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
