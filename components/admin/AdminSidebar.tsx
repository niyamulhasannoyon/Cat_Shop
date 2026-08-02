"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";

interface NavItem {
  id: string;
  label: string;
  bengali: string;
  icon: React.ReactNode;
  href: string;
  roles: Array<"Super Admin" | "Manager" | "Support">;
}

const PawsLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 flex-shrink-0">
    <circle cx="20" cy="20" r="20" fill="#059669" />
    <ellipse cx="20" cy="23" rx="8" ry="6.5" fill="#FFFFFF" />
    <ellipse cx="14" cy="17" rx="3" ry="4" fill="#FFFFFF" />
    <ellipse cx="26" cy="17" rx="3" ry="4" fill="#FFFFFF" />
    <ellipse cx="10" cy="21" rx="2.2" ry="3" fill="#FFFFFF" />
    <ellipse cx="30" cy="21" rx="2.2" ry="3" fill="#FFFFFF" />
  </svg>
);

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    bengali: "ড্যাশবোর্ড",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 11a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
      </svg>
    ),
    href: "/admin?tab=dashboard",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "products",
    label: "Products",
    bengali: "পণ্য তালিকা",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    href: "/admin?tab=products",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "orders",
    label: "Orders",
    bengali: "অর্ডার ম্যানেজার",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    href: "/admin?tab=orders",
    roles: ["Super Admin", "Manager", "Support"],
  },
  {
    id: "inventory",
    label: "Stock Inventory",
    bengali: "স্টক অ্যালার্টস",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: "/admin?tab=inventory",
    roles: ["Super Admin", "Manager"],
  },
];

const subpageItems: NavItem[] = [
  {
    id: "customers",
    label: "Customers",
    bengali: "গ্রাহক তালিকা",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: "/admin/customers",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "coupons",
    label: "Coupons",
    bengali: "কুপন ও প্রোমো",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    href: "/admin/coupons",
    roles: ["Super Admin"],
  },
  {
    id: "reviews",
    label: "Reviews",
    bengali: "রিভিউ মডারেটর",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    href: "/admin/reviews",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "settings",
    label: "Settings",
    bengali: "সেটিংস ও চার্জ",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/admin/settings",
    roles: ["Super Admin"],
  },
  {
    id: "staff-logs",
    label: "Staff Activity",
    bengali: "স্টাফ লগস",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    href: "/admin?tab=staff-logs",
    roles: ["Super Admin"],
  },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Manager: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Support: "bg-sky-500/20 text-sky-300 border-sky-500/30",
};

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const { activeStaff, logoutStaff } = useShop();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const role = activeStaff?.role || "Support";

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(role as "Super Admin" | "Manager" | "Support")
  );
  const visibleSubpageItems = subpageItems.filter((item) =>
    item.roles.includes(role as "Super Admin" | "Manager" | "Support")
  );

  const isActive = (item: NavItem) => {
    if (item.href.includes("?tab=")) {
      const tabParam = new URL(item.href, "http://x").searchParams.get("tab");
      return pathname === "/admin" && activeTab === tabParam;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const initials = activeStaff?.name
    ? activeStaff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  const renderContent = () => (
    <div className="flex flex-col h-full bg-[#0B1A14] text-slate-300 select-none font-sans antialiased border-r border-emerald-950/40">
      {/* 1. Executive Brand Header */}
      <div className="px-5 py-5 border-b border-emerald-900/30 flex items-center justify-between flex-shrink-0 bg-[#091510]/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <PawsLogo />
            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full -z-10" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight leading-tight flex items-center gap-1.5">
              Paws & Co.
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PRO</span>
            </h1>
            <p className="text-[10px] font-semibold text-emerald-400/90 uppercase tracking-widest mt-0.5">
              Enterprise Admin
            </p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Scrollable Navigation Menu */}
      <nav className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1 scrollbar-thin scrollbar-thumb-emerald-950">
        {/* Core Section */}
        <p className="text-[9px] font-extrabold text-emerald-500/70 uppercase tracking-widest px-3 pt-3 pb-1">
          মূল নেভিগেশন (Main)
        </p>
        {visibleNavItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-md shadow-emerald-950/60 border border-emerald-400/20"
                  : "text-slate-400 hover:text-emerald-100 hover:bg-emerald-950/40"
              }`}
            >
              <span className={`transition-transform duration-200 ${active ? "text-white scale-110" : "text-slate-400 group-hover:text-emerald-300"}`}>
                {item.icon}
              </span>
              <span>{item.bengali}</span>
              {active && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-xs animate-pulse" />
              )}
            </Link>
          );
        })}

        {/* Management Subpages Section */}
        {visibleSubpageItems.length > 0 && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-[9px] font-extrabold text-emerald-500/70 uppercase tracking-widest px-3">
                ম্যানেজমেন্ট (Management)
              </p>
            </div>
            {visibleSubpageItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-md shadow-emerald-950/60 border border-emerald-400/20"
                      : "text-slate-400 hover:text-emerald-100 hover:bg-emerald-950/40"
                  }`}
                >
                  <span className={`transition-transform duration-200 ${active ? "text-white scale-110" : "text-slate-400 group-hover:text-emerald-300"}`}>
                    {item.icon}
                  </span>
                  <span>{item.bengali}</span>
                  {active && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-xs animate-pulse" />
                  )}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* 3. Pinned Quick Actions & Staff Profile Card */}
      <div className="p-3 border-t border-emerald-900/30 flex-shrink-0 space-y-2 bg-[#091510]">
        <p className="text-[9px] font-extrabold text-emerald-500/70 uppercase tracking-widest px-3">
          দ্রুত লিঙ্ক (Quick Links)
        </p>

        {/* Live store */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-900/50 transition-colors"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>লাইভ স্টোর ভিউ ↗</span>
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            logoutStaff();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>লগআউট করুন</span>
        </button>

        {/* Staff Identity Card */}
        {activeStaff && (
          <div className="mt-2 pt-2 border-t border-emerald-950">
            <div className="rounded-2xl bg-emerald-950/50 p-3 flex items-center justify-between border border-emerald-800/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-black text-xs flex items-center justify-center shadow-md border border-emerald-400/30">
                    {initials}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#091510]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{activeStaff.name}</p>
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${roleColors[activeStaff.role] || "bg-slate-700 text-slate-300"}`}>
                    {activeStaff.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B1A14] shadow-2xl">
            {renderContent()}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 h-screen sticky top-0 border-r border-emerald-950/60 bg-[#0B1A14] z-30">
        {renderContent()}
      </aside>
    </>
  );
}

