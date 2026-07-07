"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
}

export default function AdminSecurityWrapper({ children }: AdminSecurityWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("paws_admin_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password === "admin123" || password === "paws2026") {
      setIsAuthenticated(true);
      localStorage.setItem("paws_admin_authenticated", "true");
    } else {
      setErrorMsg("⚠️ ভুল পাসকোড! দয়া করে সঠিক পাসকোডটি দিন।");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("paws_admin_authenticated");
  };

  if (loading) {
    return (
      <div className="bg-brand-beige min-h-screen flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-brand-forest border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-brand-charcoal min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans antialiased relative overflow-hidden">
        {/* Background gradient blur blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-forest/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <span className="text-4xl block animate-bounce">🔒</span>
            <h2 className="text-2xl font-black text-brand-beige tracking-tight">এডমিন প্যানেল অ্যাক্সেস লক</h2>
            <p className="text-xs text-stone-400 font-light">এই প্যানেলটি শুধুমাত্র অথরাইজড এডমিনদের ব্যবহারের জন্য সংরক্ষিত</p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3.5 rounded-xl text-xs text-center font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">এডমিন পাসকোড</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসকোড দিন..."
                  className="w-full bg-white/5 border border-white/10 text-brand-beige rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-forest placeholder-stone-600 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-brand-beige text-xs cursor-pointer"
                >
                  {showPassword ? "🙈 লুকান" : "👁️ দেখুন"}
                </button>
              </div>
              <span className="text-[10px] text-stone-500 font-light block">ডিফল্ট পাসকোড: <code className="bg-white/15 px-1 py-0.5 rounded text-stone-300 font-sans">admin123</code></span>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-brand-forest/20 cursor-pointer"
            >
              আনলক করুন 🔓
            </button>
          </form>

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
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleLogout}
          type="button"
          className="bg-red-700 hover:bg-red-800 text-white rounded-full p-3.5 shadow-lg border border-red-800 hover:shadow-xl transition-all flex items-center justify-center cursor-pointer"
          title="এডমিন লগআউট করুন"
        >
          🚪
        </button>
      </div>
      {children}
    </>
  );
}
