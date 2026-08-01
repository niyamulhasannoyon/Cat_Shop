import { NextResponse } from "next/server";
import { updateOrderPayment, getOrderById } from "@/lib/db";
import { validateSSLCommerzTransaction } from "@/lib/payments/sslcommerz";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get("tran_id")?.toString();
    const val_id = formData.get("val_id")?.toString() || "";

    if (tran_id) {
      const isValid = await validateSSLCommerzTransaction(val_id);
      if (isValid) {
        await updateOrderPayment(tran_id, "Paid", val_id);
      }
    }

    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/tracking?id=${tran_id || ""}&payment=success`, 303);
  } catch {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/cart?payment=error`, 303);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tran_id = searchParams.get("tran_id") || "";
  const val_id = searchParams.get("val_id") || "";

  if (tran_id) {
    const isValid = await validateSSLCommerzTransaction(val_id);
    if (isValid) {
      await updateOrderPayment(tran_id, "Paid", val_id || "SSL_ONLINE_PAYMENT");
    }
  }

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/tracking?id=${tran_id}&payment=success`, 303);
}
