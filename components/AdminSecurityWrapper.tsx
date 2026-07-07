"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
}

export default function AdminSecurityWrapper({ children }: AdminSecurityWrapperProps) {
  const { activeStaff, loginStaff } = useShop();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = loginStaff(email, password);
    if (!success) {
      setErrorMsg("ভুল ইমেইল বা পাসওয়ার্ড! সঠিক বিবরণী দিন।");
    }
  };

  /* ────────────────────────────── LOGIN SCREEN ─────────────────────────────── */
  if (!activeStaff) {
    return (
      <div className="min-h-screen bg-[#0A160A] flex items-center justify-center px-4 font-sans antialiased relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-forest/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/8 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)] space-y-7">

            {/* Header */}
            <div className="text-center space-y-3">
              {/* Logo mark */}
              <div className="mx-auto w-14 h-14 bg-brand-forest/20 border border-brand-forest/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(45,90,39,0.25)]">
                <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                  <ellipse cx="20" cy="23" rx="8" ry="6.5" fill="#4ade80" fillOpacity=".9" />
                  <ellipse cx="14" cy="17" rx="3" ry="4" fill="#4ade80" fillOpacity=".9" />
                  <ellipse cx="26" cy="17" rx="3" ry="4" fill="#4ade80" fillOpacity=".9" />
                  <ellipse cx="10" cy="21" rx="2.2" ry="3" fill="#4ade80" fillOpacity=".9" />
                  <ellipse cx="30" cy="21" rx="2.2" ry="3" fill="#4ade80" fillOpacity=".9" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">স্টাফ পোর্টাল</h2>
                <p className="text-[11px] text-white/35 mt-1">Paws & Co. Admin — Staff Login Portal</p>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-[11px] text-center font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">
                  ইমেইল অ্যাড্রেস
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@paws.co"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-forest/60 focus:bg-white/8 placeholder-white/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 pr-16 text-xs focus:outline-none focus:border-brand-forest/60 focus:bg-white/8 placeholder-white/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white/30 hover:text-white/60 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    {showPassword ? "লুকান" : "দেখুন"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-forest hover:bg-brand-forest/90 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_8px_24px_rgba(45,90,39,0.4)] cursor-pointer mt-1"
              >
                লগইন করুন →
              </button>
            </form>

            {/* Demo accounts */}
            <div className="border-t border-white/8 pt-5 space-y-2">
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest text-center">ডেমো একাউন্ট</p>
              <div className="space-y-1.5">
                {[
                  { role: "Super Admin", email: "admin@paws.co", pass: "admin123", color: "text-violet-300" },
                  { role: "Manager", email: "manager@paws.co", pass: "manager123", color: "text-amber-300" },
                  { role: "Support", email: "support@paws.co", pass: "support123", color: "text-sky-300" },
                ].map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                    className="w-full flex items-center justify-between bg-white/3 hover:bg-white/6 border border-white/6 rounded-xl px-3 py-2 transition-all cursor-pointer group"
                  >
                    <span className={`text-[10px] font-bold ${acc.color}`}>{acc.role}</span>
                    <span className="text-[9px] text-white/25 group-hover:text-white/40 transition-colors">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Back to store */}
            <div className="text-center">
              <Link
                href="/"
                className="text-[10px] text-white/25 hover:text-white/50 transition-colors border-b border-dashed border-white/15 hover:border-white/30"
              >
                ← লাইভ শপে ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────── APP SHELL ────────────────────────────────── */
  return (
    <div className="flex min-h-screen bg-[#F0EDE6] font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area offset to the right of sidebar on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-56">
        {children}
      </div>
    </div>
  );
}
