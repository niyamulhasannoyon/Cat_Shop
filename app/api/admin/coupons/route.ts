import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  try {
    const list = db.getCoupons();
    const logs = db.getCouponUsageLogs();
    return NextResponse.json({ success: true, coupons: list, usageLogs: logs });
  } catch (error) {
    console.error("GET Coupons Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.code || !body.discountType || !body.discountValue) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = db.addCoupon({
      code: body.code.trim().toUpperCase(),
      discountType: body.discountType,
      discountValue: Number(body.discountValue),
      minOrderAmount: Number(body.minOrderAmount || 0),
      maxDiscountCap: body.maxDiscountCap ? Number(body.maxDiscountCap) : undefined,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalUsageLimit: Number(body.totalUsageLimit || 100),
      perUserUsageLimit: Number(body.perUserUsageLimit || 1),
      applicableOn: body.applicableOn || "all",
      applicableCategory: body.applicableCategory || undefined,
      applicableProductIds: body.applicableProductIds || undefined,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("POST Coupon Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
