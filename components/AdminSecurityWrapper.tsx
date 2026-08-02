"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { PawIconSvg } from "@/components/ui/Logo";
import AdminSidebar from "@/components/admin/AdminSidebar";

import AdminHeader from "@/components/admin/AdminHeader";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
}

export default function AdminSecurityWrapper({ children }: AdminSecurityWrapperProps) {
  const { activeStaff, loginStaff } = useShop();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = await loginStaff(email, password);
    if (!success) {
      setErrorMsg("ভুল ইমেইল বা পাসওয়ার্ড! সঠিক বিবরণী দিন।");
    }
  };

  /* ────────────────────────────── LOGIN SCREEN ─────────────────────────────── */
  if (!activeStaff) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-sans antialiased relative overflow-hidden text-slate-100">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] space-y-6">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex items-center justify-center mb-3">
                <PawIconSvg size="lg" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">স্টাফ পোর্টাল (Admin)</h2>
                <p className="text-[11px] text-slate-400 mt-1">Paws & Co. Admin — Staff Login Portal</p>
              </div>
            </div>


            {/* Error */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-2.5 rounded-xl text-xs text-center font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ইমেইল অ্যাড্রেস
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@paws.co"
                  className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 px-3.5 pr-16 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    {showPassword ? "লুকান" : "দেখুন"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-emerald-600/30 cursor-pointer mt-1"
              >
                লগইন করুন →
              </button>
            </form>

            {/* Demo accounts */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">
                ডেমো একাউন্ট (Quick Login)
              </p>
              <div className="space-y-1.5">
                {[
                  { role: "Super Admin", email: "admin@paws.co", pass: "admin123", color: "text-emerald-400" },
                  { role: "Manager", email: "manager@paws.co", pass: "manager123", color: "text-amber-400" },
                  { role: "Support", email: "support@paws.co", pass: "support123", color: "text-sky-400" },
                ].map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.pass);
                    }}
                    className="w-full flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2 transition-all cursor-pointer group"
                  >
                    <span className={`text-[10px] font-bold ${acc.color}`}>{acc.role}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors">
                      {acc.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Back to store */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-[11px] text-slate-400 hover:text-white transition-colors border-b border-dashed border-slate-700 hover:border-slate-400"
              >
                ← লাইভ ই-কমার্স শপে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────── APP SHELL ────────────────────────────────── */
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Right Scrollable Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Dedicated Admin Top Navbar */}
        <AdminHeader onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
