import { NextResponse } from "next/server";
import { getReviews, updateReviewStatus } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json({ success: true, reviews });
}

export async function POST(req: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, ids, reason } = body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const status = action === "approve" ? "approved" : "rejected";
    for (const id of ids) {
      await updateReviewStatus(id, status, reason);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${status} ${ids.length} review(s).`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
