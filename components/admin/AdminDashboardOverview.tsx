"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminDashboardOverview() {
  const { products, orders, customers, reviews } = useShop();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const pendingOrders = orders.filter((o) => o.status === "Received" || o.status === "Processing").length;
  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold || 5)).length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">অ্যাডমিন ড্যাশবোর্ড (Overview)</h1>
          <p className="text-xs text-neutral-500 mt-1">Paws & Co. বাস্তব সময় ব্যবসায়িক তথ্য ও বিশ্লেষণ</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">মোট আয় (Total Paid Revenue)</span>
          <div className="text-2xl font-black text-brand-forest">৳{totalRevenue.toLocaleString("bn-BD")}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">পেইড অর্ডার থেকে অর্জিত</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">মোট অর্ডার (Total Orders)</span>
          <div className="text-2xl font-black text-neutral-900">{orders.length}টি</div>
          <span className="text-[11px] text-amber-600 font-semibold">{pendingOrders}টি পেন্ডিং প্রসেসিং</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">ক্যাটালগ প্রোডাক্ট (Products)</span>
          <div className="text-2xl font-black text-neutral-900">{products.length}টি</div>
          <span className={`text-[11px] font-semibold ${lowStockCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {lowStockCount > 0 ? `⚠️ ${lowStockCount}টি প্রোডাক্টে লো স্টক` : "সব প্রোডাক্ট পর্যাপ্ত স্টক আছে"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">গ্রাহক সংখ্যা (Customers)</span>
          <div className="text-2xl font-black text-neutral-900">{customers.length}জন</div>
          <span className="text-[11px] text-sky-600 font-semibold">{pendingReviews}টি রিভিউ মডারেশন ওয়েটিং</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900">সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">অর্ডার আইডি</th>
                <th className="py-3 px-2">গ্রাহক</th>
                <th className="py-3 px-2">মোবাইল</th>
                <th className="py-3 px-2">মোট টাকা</th>
                <th className="py-3 px-2">পেমেন্ট</th>
                <th className="py-3 px-2">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-brand-forest">{order.id}</td>
                  <td className="py-3 px-2 font-semibold text-neutral-900">{order.customerName}</td>
                  <td className="py-3 px-2 text-neutral-600">{order.customerPhone}</td>
                  <td className="py-3 px-2 font-bold text-neutral-900">৳{order.grandTotal.toLocaleString("bn-BD")}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {order.paymentMethod.toUpperCase()} ({order.paymentStatus || "Unpaid"})
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
