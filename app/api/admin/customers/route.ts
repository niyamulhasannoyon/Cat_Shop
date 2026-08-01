import { NextRequest, NextResponse } from "next/server";
import { getCustomers, updateCustomerStatus } from "@/lib/db";
import { getStaffSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const exportCsv = searchParams.get("export") === "csv";

  const { customers, total, page: currentPage, totalPages } = await getCustomers({ search, page, limit: exportCsv ? 1000 : limit });

  if (exportCsv) {
    const headers = ["Customer ID", "Name", "Email", "Phone", "Total Orders", "Total Spent (BDT)", "Status"];
    let csvContent = "\ufeff" + headers.join(",") + "\n";

    customers.forEach((c) => {
      const row = [c.id, c.name, c.email, c.phone, c.totalOrders, c.totalSpent, c.status];
      const escapedRow = row.map((val) => {
        const s = String(val);
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      });
      csvContent += escapedRow.join(",") + "\n";
    });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=customers.csv",
      },
    });
  }

  return NextResponse.json({ success: true, customers, total, page: currentPage, totalPages });
}

export async function PATCH(request: Request) {
  const session = await getStaffSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();
  const updated = await updateCustomerStatus(id, status);

  if (!updated) {
    return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer: updated });
}
