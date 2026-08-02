"use client";

import React from "react";
import Link from "next/link";

export interface OrderItem {
  id: string;
  customer?: string;
  customerName?: string;
  phone?: string;
  customerPhone?: string;
  total?: number;
  grandTotal?: number;
  paymentMethod: string;
  paymentStatus?: "Paid" | "Unpaid" | "Pending" | string;
  status: string;
}

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Shipped: "bg-blue-100 text-blue-800 border-blue-200",
  Processing: "bg-amber-100 text-amber-800 border-amber-200",
  Received: "bg-sky-100 text-sky-800 border-sky-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function RecentOrdersTable({ orders }: { orders: OrderItem[] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden font-sans">
      {/* Table Header / Action */}
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
            সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">সর্বশেষ গ্রাহক কাস্টমার অর্ডার বিবরণী</p>
        </div>
        <Link
          href="/admin?tab=orders"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1 transition-all"
        >
          সব দেখুন →
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-widest border-b border-slate-100 font-bold">
            <tr>
              <th className="px-6 py-3.5">অর্ডার আইডি</th>
              <th className="px-6 py-3.5">গ্রাহক</th>
              <th className="px-6 py-3.5">মোবাইল</th>
              <th className="px-6 py-3.5">মোট টাকা</th>
              <th className="px-6 py-3.5">পেমেন্ট মেথড</th>
              <th className="px-6 py-3.5">অর্ডার স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                const customerName = order.customer || order.customerName || "অজ্ঞাত গ্রাহক";
                const phone = order.phone || order.customerPhone || "N/A";
                const amount = order.total ?? order.grandTotal ?? 0;
                const payStatus = order.paymentStatus || "Unpaid";
                const statusBadgeStyle =
                  statusColors[order.status] || "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{customerName}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{phone}</td>
                    <td className="px-6 py-4 font-black text-slate-900">৳{amount.toLocaleString("bn-BD")}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold inline-block border ${
                          payStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-amber-50 text-amber-700 border-amber-200/80"
                        }`}
                      >
                        {order.paymentMethod.toUpperCase()} ({payStatus})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-3 py-1 rounded-full font-bold inline-block border ${statusBadgeStyle}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-xs">
                  কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

