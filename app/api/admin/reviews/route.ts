import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  try {
    const list = db.getReviews();
    return NextResponse.json({ success: true, reviews: list });
  } catch (error) {
    console.error("GET Reviews API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ids, reason } = body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ success: false, error: "Invalid action value" }, { status: 400 });
    }

    const status = action === "approve" ? "approved" : "rejected";
    db.bulkUpdateReviews(ids, status, reason);

    return NextResponse.json({
      success: true,
      message: `Successfully ${status} ${ids.length} review(s).`,
    });
  } catch (error) {
    console.error("POST Reviews Moderation Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
