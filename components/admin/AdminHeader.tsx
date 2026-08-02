"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const { activeStaff, orders, products, reviews } = useShop();

  const [searchQuery, setSearchQuery] = useState("");

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "Received" || o.status === "Processing"
  ).length;

  const lowStockCount = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 5)
  ).length;

  const pendingReviewsCount = reviews.filter((r) => r.status === "pending").length;

  const totalNotifications = pendingOrdersCount + lowStockCount + pendingReviewsCount;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin?tab=orders&search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "ড্যাশবোর্ড (Overview)";
      case "products":
        return "পণ্য ব্যবস্থাপনা (Products)";
      case "orders":
        return "অর্ডার ম্যানেজার (Orders)";
      case "customers":
        return "গ্রাহক তালিকা (Customers)";
      case "coupons":
        return "কুপন ও প্রোমো (Coupons)";
      case "reviews":
        return "রিভিউ মডারেটর (Reviews)";
      case "inventory":
        return "ইনভেন্টরি ও স্টক (Inventory)";
      case "settings":
      case "shipping":
        return "সেটিংস ও শিপিং চার্জ";
      case "staff-logs":
        return "স্টাফ অ্যাক্টিভিটি লগস";
      default:
        return "এডমিন প্যানেল";
    }
  };

  const initials = activeStaff?.name
    ? activeStaff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-xs font-sans antialiased">
      {/* Left section: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-tight tracking-tight flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Paws & Co. Enterprise Admin Control Center
          </p>
        </div>
      </div>

      {/* Center Search bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার আইডি, কাস্টমার নাম বা মোবাইল দিয়ে সার্চ..."
            className="w-full bg-slate-50 border border-slate-200/90 text-xs rounded-xl py-2.5 px-3.5 pl-9 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
      </div>

      {/* Right utilities & Staff profile */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Live Store button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/80 transition-all shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>লাইভ শপ ↗</span>
        </Link>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => router.push("/admin?tab=orders")}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title={`${totalNotifications}টি নতুন নোটিফিকেশন/অ্যালার্ট`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs animate-pulse">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-200" />

        {/* Staff Profile summary */}
        {activeStaff && (
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#0B1A14] text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30 shadow-inner">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-snug">{activeStaff.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500 font-semibold">{activeStaff.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

