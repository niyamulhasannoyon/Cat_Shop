import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";

export async function GET() {
  const session = await getStaffSession();

  if (!session) {
    return NextResponse.json(
      { success: false, staff: null, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    staff: {
      id: session.staffId,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
