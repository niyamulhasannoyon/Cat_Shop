import { NextRequest, NextResponse } from "next/server";
import { getCustomers, updateCustomerStatus } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { customers } = await getCustomers({ search: id });
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { status } = body;

  if (!status || (status !== "active" && status !== "blocked")) {
    return NextResponse.json(
      { success: false, error: "Invalid status value" },
      { status: 400 }
    );
  }

  const updated = await updateCustomerStatus(id, status);
  if (!updated) {
    return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer: updated });
}
