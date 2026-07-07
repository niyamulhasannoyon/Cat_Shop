import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const verified = searchParams.get("verified") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const exportCsv = searchParams.get("export") === "csv";

    if (exportCsv) {
      const allCustomers = db.getAllCustomersForExport();
      
      // Simple CSV generator with proper column mapping and escaping
      const headers = [
        "Customer ID",
        "Name",
        "Email",
        "Phone",
        "Total Orders",
        "Total Spent (BDT)",
        "Signup Date",
        "Status",
        "Email Verified",
        "Phone Verified",
        "Last Login Date"
      ];
      
      let csvContent = "\ufeff" + headers.join(",") + "\n"; // Adding BOM for Excel compatibility with UTF-8 (Bengali text support)
      
      allCustomers.forEach((c) => {
        const row = [
          c.id,
          c.name,
          c.email,
          c.phone,
          c.totalOrders,
          c.totalSpent,
          new Date(c.signupDate).toLocaleDateString("en-US"),
          c.status,
          c.emailVerified ? "Yes" : "No",
          c.phoneVerified ? "Yes" : "No",
          new Date(c.lastLoginDate).toLocaleDateString("en-US")
        ];
        
        // Escape quotes and commas in columns
        const escapedRow = row.map((val) => {
          const stringVal = String(val);
          if (stringVal.includes(",") || stringVal.includes("\"") || stringVal.includes("\n")) {
            return `"${stringVal.replace(/"/g, '""')}"`;
          }
          return stringVal;
        });
        
        csvContent += escapedRow.join(",") + "\n";
      });

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=customers.csv",
        },
      });
    }

    const data = db.getCustomers(search, status, verified, page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error [GET customers]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
