import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, updateOrderPayment, updateOrderCourier } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  let updated = null;

  if (body.status) {
    updated = await updateOrderStatus(id, body.status);
  }

  if (body.paymentStatus) {
    updated = await updateOrderPayment(id, body.paymentStatus, body.transactionId);
  }

  if (body.courierPartner) {
    updated = await updateOrderCourier(id, body.courierPartner, body.trackingNumber || "");
  }

  if (!updated) {
    return NextResponse.json({ success: false, message: "Order not found or no updates provided" }, { status: 400 });
  }

  return NextResponse.json({ success: true, order: updated });
}
