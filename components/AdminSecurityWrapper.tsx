"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
}

export default function AdminSecurityWrapper({ children }: AdminSecurityWrapperProps) {
  const { activeStaff, loginStaff, logoutStaff } = useShop();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const success = loginStaff(email, password);
    if (!success) {
      setErrorMsg("⚠️ ভুল ইমেইল বা পাসওয়ার্ড! সঠিক বিবরণী দিন।");
    }
  };

  if (!activeStaff) {
    return (
      <div className="bg-brand-charcoal min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans antialiased relative overflow-hidden">
        {/* Background gradient blur blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-forest/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <span className="text-4xl block animate-bounce">🔒</span>
            <h2 className="text-2xl font-black text-brand-beige tracking-tight">স্টাফ লগইন পোর্টাল (Staff Login)</h2>
            <p className="text-xs text-stone-400 font-light font-semibold">এডমিন প্যানেলে অ্যাক্সেস করার জন্য স্টাফ অ্যাকাউন্ট দিয়ে লগইন করুন</p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3.5 rounded-xl text-xs text-center font-semibold animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ইমেইল অ্যাড্রেস (Email Address)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@paws.co"
                className="w-full bg-white/5 border border-white/10 text-brand-beige rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-forest placeholder-stone-600 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">পাসওয়ার্ড (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-brand-beige rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-forest placeholder-stone-600 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-brand-beige text-xs cursor-pointer"
                >
                  {showPassword ? "🙈 লুকান" : "👁️ দেখুন"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-brand-forest/20 cursor-pointer mt-2"
            >
              লগইন করুন 🔓
            </button>
          </form>

          {/* Seeding guide for demo convenience */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-[10px] space-y-1.5 text-stone-400 font-sans border-t border-white/10">
            <p className="font-bold text-brand-beige text-center">টেস্ট একাউন্ট লগইন বিবরণী (Demo Accounts):</p>
            <div className="grid grid-cols-2 gap-1 text-stone-300">
              <span>Super Admin:</span>
              <span className="font-semibold text-brand-beige">admin@paws.co / admin123</span>
              <span>Manager:</span>
              <span className="font-semibold text-brand-beige">manager@paws.co / manager123</span>
              <span>Support:</span>
              <span className="font-semibold text-brand-beige">support@paws.co / support123</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-brand-beige transition-colors border-b border-dashed border-stone-500 hover:border-brand-beige"
            >
              ← লাইভ শপে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Logout Button at bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <div className="bg-brand-charcoal text-brand-beige border border-brand-beige-dark/20 text-[10px] font-bold rounded-full py-1.5 px-3 shadow-md flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{activeStaff.name} ({activeStaff.role})</span>
        </div>
        <button
          onClick={logoutStaff}
          type="button"
          className="bg-red-750 hover:bg-red-800 bg-red-700 text-white rounded-full p-3 shadow-lg border border-red-800 hover:shadow-xl transition-all flex items-center justify-center cursor-pointer"
          title="লগআউট করুন"
        >
          🚪
        </button>
      </div>
      {children}
    </>
  );
}
