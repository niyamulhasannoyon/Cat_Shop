import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = db.toggleCouponStatus(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error("PATCH Coupon Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = db.deleteCoupon(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("DELETE Coupon Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
