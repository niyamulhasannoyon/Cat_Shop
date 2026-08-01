import { NextResponse } from "next/server";
import { updateOrderPayment } from "@/lib/db";
import { validateSSLCommerzTransaction } from "@/lib/payments/sslcommerz";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get("tran_id")?.toString();
    const val_id = formData.get("val_id")?.toString() || "";
    const status = formData.get("status")?.toString();

    if (tran_id && status === "VALID") {
      const isValid = await validateSSLCommerzTransaction(val_id);
      if (isValid) {
        await updateOrderPayment(tran_id, "Paid", val_id);
        return NextResponse.json({ success: true, message: "IPN verified and payment updated" });
      }
    }

    return NextResponse.json({ success: false, message: "IPN verification failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
