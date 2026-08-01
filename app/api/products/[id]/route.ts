import { NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const updated = await saveProduct({ ...body, id });

  return NextResponse.json({ success: true, product: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const success = await deleteProduct(id);

  return NextResponse.json({ success });
}
