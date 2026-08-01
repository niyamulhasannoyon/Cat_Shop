import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || searchParams.get("cat") || undefined;
  const search = searchParams.get("search") || searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const result = await getProducts({ category, search, page, limit });
  return NextResponse.json({ success: true, ...result });
}

export async function POST(request: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || typeof body.price !== "number") {
      return NextResponse.json({ success: false, message: "Product name and price are required" }, { status: 400 });
    }

    const newProduct = await saveProduct(body);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create product", error: String(error) }, { status: 500 });
  }
}
