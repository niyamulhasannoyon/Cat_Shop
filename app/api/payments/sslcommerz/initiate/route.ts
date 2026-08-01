import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";
import { initiateSSLCommerzSession } from "@/lib/payments/sslcommerz";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const origin = new URL(request.url).origin;
    const session = await initiateSSLCommerzSession({
      orderId: order.id,
      amount: order.grandTotal,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      baseUrl: origin,
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Payment session initiation failed", error: String(error) },
      { status: 500 }
    );
  }
}
