"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";

interface NavItem {
  id: string;
  label: string;
  bengali: string;
  icon: React.ReactNode;
  href: string;
  isExternal?: boolean;
  roles: Array<"Super Admin" | "Manager" | "Support">;
}

const PawsLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <circle cx="20" cy="20" r="20" fill="#2D5A27" />
    <ellipse cx="20" cy="23" rx="8" ry="6.5" fill="#F9F7F2" />
    <ellipse cx="14" cy="17" rx="3" ry="4" fill="#F9F7F2" />
    <ellipse cx="26" cy="17" rx="3" ry="4" fill="#F9F7F2" />
    <ellipse cx="10" cy="21" rx="2.2" ry="3" fill="#F9F7F2" />
    <ellipse cx="30" cy="21" rx="2.2" ry="3" fill="#F9F7F2" />
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
    bengali: "পণ্য CRUD",
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
    id: "bundles",
    label: "Bundles",
    bengali: "বান্ডেল অফার",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    href: "/admin?tab=bundles",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "audit_logs",
    label: "Stock Logs",
    bengali: "স্টক লগস",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: "/admin?tab=audit_logs",
    roles: ["Super Admin", "Manager"],
  },
  {
    id: "staff",
    label: "Staff & Roles",
    bengali: "স্টাফ ও রোলস",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    href: "/admin?tab=staff",
    roles: ["Super Admin"],
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
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-violet-500/20 text-violet-200 border-violet-500/30",
  Manager: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  Support: "bg-sky-500/20 text-sky-200 border-sky-500/30",
};

export default function AdminSidebar() {
  const { activeStaff, logoutStaff } = useShop();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "orders";
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = activeStaff?.role || "Support";

  const visibleNavItems = navItems.filter((item) => item.roles.includes(role as "Super Admin" | "Manager" | "Support"));
  const visibleSubpageItems = subpageItems.filter((item) => item.roles.includes(role as "Super Admin" | "Manager" | "Support"));

  const isActive = (item: NavItem) => {
    if (item.href.includes("?tab=")) {
      const tabParam = new URL(item.href, "http://x").searchParams.get("tab");
      return pathname === "/admin" && activeTab === tabParam;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const initials = activeStaff?.name
    ? activeStaff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-forest/40 blur-lg rounded-full" />
            <PawsLogo />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight tracking-tight">Paws & Co.</h1>
            <p className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
        {/* Main Tabs */}
        <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-3 pb-2 pt-1">Main</p>
        {visibleNavItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 relative ${
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white/80 hover:bg-white/8"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-emerald-400 rounded-r-full" />
              )}
              <span className={`transition-colors ${active ? "text-emerald-400" : "text-white/40 group-hover:text-white/60"}`}>
                {item.icon}
              </span>
              <span>{item.bengali}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
            </Link>
          );
        })}

        {/* Sub-pages */}
        {visibleSubpageItems.length > 0 && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-3">Management</p>
            </div>
            {visibleSubpageItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 relative ${
                    active
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80 hover:bg-white/8"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-emerald-400 rounded-r-full" />
                  )}
                  <span className={`transition-colors ${active ? "text-emerald-400" : "text-white/40 group-hover:text-white/60"}`}>
                    {item.icon}
                  </span>
                  <span>{item.bengali}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                </Link>
              );
            })}
          </>
        )}

        {/* Divider */}
        <div className="pt-3 pb-1">
          <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-3">Quick Actions</p>
        </div>

        {/* View Store */}
        <Link
          href="/"
          target="_blank"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 text-white/50 hover:text-white/80 hover:bg-white/8"
        >
          <span className="text-white/40 group-hover:text-white/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
          <span>লাইভ শপ দেখুন</span>
        </Link>

        {/* Logout */}
        <button
          onClick={() => { logoutStaff(); setMobileOpen(false); }}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 text-red-400/70 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
        >
          <span className="text-red-400/60 group-hover:text-red-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span>লগআউট করুন</span>
        </button>
      </nav>

      {/* Staff Identity Card */}
      {activeStaff && (
        <div className="flex-shrink-0 px-3 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 space-y-2.5">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-brand-forest/60 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner">
                <span className="text-xs font-black text-emerald-200">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{activeStaff.name}</p>
                <p className="text-[9px] text-white/40 truncate">{activeStaff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${roleColors[activeStaff.role] || "bg-white/10 text-white/50"}`}>
                {activeStaff.role}
              </span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400/80 font-medium ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                অনলাইন
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1A2E17] text-white rounded-xl flex items-center justify-center shadow-lg border border-white/10 cursor-pointer"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-[#0F1E0D] border-r border-white/8 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 bg-white/10 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-[#0F1E0D] border-r border-white/8">
        <SidebarContent />
      </aside>
    </>
  );
}
