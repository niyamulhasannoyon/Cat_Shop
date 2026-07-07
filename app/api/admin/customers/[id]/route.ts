import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

type RouteParams = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // Resolve params which might be a Promise in Next.js 15+
    const params = await context.params;
    const id = params.id;
    
    const customer = db.getCustomerById(id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error) {
    console.error("API route error [GET customer by id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const id = params.id;
    
    const body = await request.json();
    const { status } = body;

    if (!status || (status !== "active" && status !== "blocked")) {
      return NextResponse.json(
        { error: "Invalid status value. Must be 'active' or 'blocked'." },
        { status: 400 }
      );
    }

    const updated = db.updateCustomerStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("API route error [PATCH customer]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
