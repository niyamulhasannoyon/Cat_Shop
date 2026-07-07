"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function AdminSettingsPage() {
  const {
    shippingSettings,
    updateShippingSettings,
    refundLogs
  } = useShop();

  // Settings form states
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(shippingSettings.insideDhakaCharge.toString());
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(shippingSettings.outsideDhakaCharge.toString());
  const [subAreaCharge, setSubAreaCharge] = useState(shippingSettings.subAreaCharge.toString());
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingSettings.freeShippingThreshold.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const inside = Number(insideDhakaCharge);
    const outside = Number(outsideDhakaCharge);
    const sub = Number(subAreaCharge);
    const threshold = Number(freeShippingThreshold);

    if (isNaN(inside) || isNaN(outside) || isNaN(sub) || isNaN(threshold)) {
      alert("⚠️ দয়া করে সব ইনপুট কলামে সঠিক সংখ্যা লিখুন।");
      return;
    }

    updateShippingSettings({
      insideDhakaCharge: inside,
      outsideDhakaCharge: outside,
      subAreaCharge: sub,
      freeShippingThreshold: threshold
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal antialiased">
      
      {/* Header Banner */}
      <header className="bg-brand-charcoal text-brand-beige py-6 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Paws&Co. শিপিং ও জেনারেল সেটিংস</h1>
            </div>
            <p className="text-xs text-stone-400 font-light">ডেলিভারি এলাকাভিত্তিক চার্জ, ফ্রি ডেলিভারি ক্যাপ ও রিফান্ড হিস্ট্রি মডারেট করুন</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin?tab=dashboard"
              className="text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-brand-beige-dark px-4 py-2 rounded-full border border-stone-600 transition-colors"
            >
              ← এডমিন ড্যাশবোর্ড
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Shipping Zones Control Settings Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-6">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">ডেলিভারি এলাকা ও চার্জ সেটিংস</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">জোন অনুযায়ী কুরিয়ার ডেলিভারি ফি আপডেট করুন</p>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-200 text-xs font-semibold animate-fadeIn">
                ✓ সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div className="space-y-1">
                <label htmlFor="inside-charge" className="text-[11px] font-bold text-stone-500">ঢাকার ভেতরে ডেলিভারি চার্জ (৳)</label>
                <input
                  id="inside-charge"
                  type="number"
                  required
                  value={insideDhakaCharge}
                  onChange={(e) => setInsideDhakaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="outside-charge" className="text-[11px] font-bold text-stone-500">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
                <input
                  id="outside-charge"
                  type="number"
                  required
                  value={outsideDhakaCharge}
                  onChange={(e) => setOutsideDhakaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sub-charge" className="text-[11px] font-bold text-stone-500">সাব-এরিয়া ডেলিভারি চার্জ (৳)</label>
                <input
                  id="sub-charge"
                  type="number"
                  required
                  value={subAreaCharge}
                  onChange={(e) => setSubAreaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1 border-t border-dashed border-brand-beige-dark pt-3">
                <label htmlFor="free-threshold" className="text-[11px] font-bold text-stone-500">ফ্রি ডেলিভারি ক্যাপ / থ্রেশহোল্ড (৳)</label>
                <input
                  id="free-threshold"
                  type="number"
                  required
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none font-bold"
                />
                <p className="text-[9px] text-stone-400 font-light mt-0.5">এই মূল্যের উপরে অর্ডার করলে ডেলিভারি ফি স্বয়ংক্রিয়ভাবে ফ্রি (৳০) হয়ে যাবে।</p>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-forest hover:bg-brand-forest-light text-brand-beige py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer mt-2"
              >
                সেটিংস সংরক্ষণ করুন (Save Settings)
              </button>

            </form>
          </div>

          {/* Refund History Timeline Logs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">রিফান্ড ইতিহাস অডিট লগ (Refund History Audit Logs)</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">অর্ডার অনুযায়ী ইস্যুকৃত রিফান্ড ট্র্যাকিং ডাটাবেজ</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider bg-brand-beige">
                    <th className="py-2.5 px-3">তারিখ ও সময়</th>
                    <th className="py-2.5 px-3">অর্ডার আইডি</th>
                    <th className="py-2.5 px-3">গ্রাহকের বিবরণ</th>
                    <th className="py-2.5 px-3">রিফান্ড মাধ্যম</th>
                    <th className="py-2.5 px-3">বাতিলের কারণ</th>
                    <th className="py-2.5 px-3 text-right">রিফান্ড পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige-dark bg-white text-brand-charcoal">
                  {refundLogs && refundLogs.length > 0 ? (
                    refundLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-beige/10">
                        <td className="py-3 px-3 text-stone-400 font-light">{new Date(log.createdAt).toLocaleString("bn-BD")}</td>
                        <td className="py-3 px-3 font-mono font-bold">{log.orderId}</td>
                        <td className="py-3 px-3">
                          <p className="font-bold">{log.customerName}</p>
                          <p className="text-[10px] text-stone-400 font-mono font-light">{log.customerPhone}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-stone-600">
                            {log.refundMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-light text-stone-500 max-w-[150px] truncate" title={log.refundReason}>
                          {log.refundReason}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-red-650 text-red-600">৳{log.refundAmount.toLocaleString("bn-BD")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400">
                        কোনো রিফান্ড লগ পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
