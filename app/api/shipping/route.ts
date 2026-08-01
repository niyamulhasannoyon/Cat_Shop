import { NextResponse } from "next/server";
import { getShippingSettings, updateShippingSettings } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET() {
  const settings = await getShippingSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(request: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updateShippingSettings(body);
  return NextResponse.json({ success: true, settings: updated });
}
