import { NextResponse } from "next/server";
import { getCoupons, saveCoupon, toggleCouponStatus, deleteCoupon } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET() {
  const coupons = await getCoupons();
  return NextResponse.json({ success: true, coupons });
}

export async function POST(req: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.code || !body.discountType || !body.discountValue) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = await saveCoupon({
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
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const coupon = await toggleCouponStatus(id);
  if (!coupon) {
    return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, coupon });
}

export async function DELETE(req: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

  const deleted = await deleteCoupon(id);
  return NextResponse.json({ success: deleted });
}
