import { NextResponse } from "next/server";
import { getOrderById, getOrders } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || searchParams.get("id") || searchParams.get("phone");

  if (!query) {
    return NextResponse.json({ success: false, message: "Order ID or phone number is required" }, { status: 400 });
  }

  // First try direct order ID match
  const directMatch = await getOrderById(query);
  if (directMatch) {
    return NextResponse.json({ success: true, orders: [directMatch] });
  }

  // Otherwise search by phone / tracking number
  const { orders } = await getOrders({ search: query, limit: 10 });
  return NextResponse.json({ success: true, orders });
}
