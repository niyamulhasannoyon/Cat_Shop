import { NextResponse } from "next/server";
import { getOrders, createOrder, getShippingSettings } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const result = await getOrders({ status, search, page, limit });
  return NextResponse.json({ success: true, ...result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, items, paymentMethod, area, transactionId } = body;

    if (!name || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Required checkout fields missing or empty items" },
        { status: 400 }
      );
    }

    const shippingSettings = await getShippingSettings();
    let shippingFee = shippingSettings.insideDhakaCharge;
    if (area === "outside") shippingFee = shippingSettings.outsideDhakaCharge;
    if (area === "sub_area") shippingFee = shippingSettings.subAreaCharge;

    const subtotal = items.reduce((acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity, 0);
    if (subtotal >= shippingSettings.freeShippingThreshold) {
      shippingFee = 0;
    }

    const grandTotal = subtotal + shippingFee;

    const order = await createOrder({
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      items,
      subtotal,
      shippingFee,
      grandTotal,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "Unpaid" : "Paid",
      transactionId,
      status: "Received",
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to place order", error: String(error) },
      { status: 500 }
    );
  }
}
