"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import StatCard from "@/components/admin/StatCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";

export default function AdminDashboardOverview() {
  const { products, orders, customers, reviews } = useShop();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === "Received" || o.status === "Processing"
  ).length;

  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 5)
  );

  const pendingReviews = reviews.filter((r) => r.status === "pending").length;

  const recentOrdersData = orders.slice(0, 6).map((o) => ({
    id: o.id,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    grandTotal: o.grandTotal,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    status: o.status,
  }));

  return (
    <div className="space-y-6 antialiased font-sans">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1A14] via-[#0F261E] to-[#0B1A14] text-white p-6 sm:p-7 rounded-3xl border border-emerald-900/40 shadow-lg">
        {/* Subtle background ambient glow */}
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 uppercase tracking-widest">
              ✨ Paws & Co. Enterprise Control Center
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              এডমিন ড্যাশবোর্ড ওভারভিউ (Overview)
            </h2>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              বাস্তব সময় ব্যবসায়িক তথ্য, বিক্রয় পরিসংখ্যান ও ইনভেন্টরির সার্বিক বিবরণী
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mr-2 shadow-xs" />
              লাইভ সিস্টেম চালু আছে
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid using StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="মোট আয় (Total Paid Revenue)"
          value={`৳${totalRevenue.toLocaleString("bn-BD")}`}
          subtext="পেইড অর্ডার থেকে অর্জিত"
          badgeText="আয় বাড়তির মুখে"
          badgeType="success"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="মোট অর্ডার (Total Orders)"
          value={`${orders.length}টি`}
          subtext={`${pendingOrders}টি পেন্ডিং / প্রসেসিং`}
          badgeText={pendingOrders > 0 ? "পেন্ডিং কাজ রয়েছে" : "সব সম্পন্ন"}
          badgeType={pendingOrders > 0 ? "warning" : "success"}
          icon={
            <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <StatCard
          title="ক্যাটালগ প্রোডাক্ট (Products)"
          value={`${products.length}টি`}
          subtext={
            lowStockProducts.length > 0
              ? `${lowStockProducts.length}টি প্রোডাক্টে স্টক কম`
              : "সব প্রোডাক্ট স্টক ফুল"
          }
          badgeText={lowStockProducts.length > 0 ? "লো স্টক অ্যালার্ট" : "স্টক ঠিক আছে"}
          badgeType={lowStockProducts.length > 0 ? "danger" : "success"}
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatCard
          title="গ্রাহক সংখ্যা (Customers)"
          value={`${customers.length}জন`}
          subtext={`${pendingReviews}টি রিভিউ মডারেশন অপেক্ষমান`}
          badgeText={pendingReviews > 0 ? `${pendingReviews} নতুন রিভিউ` : "আপ টু ডেট"}
          badgeType={pendingReviews > 0 ? "info" : "success"}
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-4 flex items-start gap-3 text-rose-800">
          <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-xs space-y-1">
            <p className="font-bold">জরুরী ইনভেন্টরি সতর্কতা (Low Stock Alert):</p>
            <p>
              {lowStockProducts.map((p) => p.name).slice(0, 3).join(", ")}
              {lowStockProducts.length > 3 ? ` সহ আরও ${lowStockProducts.length - 3}টি পণ্যের স্টক শেষ হয়ে আসছে।` : " এর স্টক শেষ হয়ে আসছে।"}
            </p>
          </div>
        </div>
      )}

      {/* Recent Orders List Table */}
      <RecentOrdersTable orders={recentOrdersData} />
    </div>
  );
}
