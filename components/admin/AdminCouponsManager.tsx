"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminCouponsManager() {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useShop();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrderAmount || "0"),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalUsageLimit: 100,
      perUserUsageLimit: 1,
      applicableOn: "all",
      isActive: true,
    });

    setCode("");
    setDiscountValue("");
    setMinOrderAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">কুপন ও ডিসকাউন্ট (Coupons & Offers)</h1>
        <p className="text-xs text-neutral-500 mt-1">প্রোমো কোড তৈরি করুন, সীমা নির্ধারণ করুন এবং একটিভ কুপন পরিচালনা করুন</p>
      </div>

      {/* Create Coupon Form */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4 max-w-xl">
        <h2 className="text-base font-bold text-neutral-900">নতুন কুপন কোড তৈরি করুন</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">কুপন কোড</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PROMO2026"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold font-mono uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ডিসকাউন্ট টাইপ</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
              >
                <option value="percentage">পার্সেন্টেজ (%)</option>
                <option value="fixed">ফিক্সড টাকা (৳ BDT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ডিসকাউন্ট পরিমাণ</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "10" : "150"}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">সর্বনিম্ন অর্ডার (৳)</label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-forest hover:bg-brand-forest/90 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            + কুপন কোড যুক্ত করুন
          </button>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">কোড</th>
              <th className="py-3 px-2">ডিসকাউন্ট</th>
              <th className="py-3 px-2">মিনিমাম অর্ডার</th>
              <th className="py-3 px-2">ব্যবহার সংখ্যা</th>
              <th className="py-3 px-2">স্ট্যাটাস</th>
              <th className="py-3 px-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 font-mono font-black text-brand-forest uppercase">{c.code}</td>
                <td className="py-3 px-2 font-bold text-neutral-900">
                  {c.discountType === "percentage" ? `${c.discountValue}% ছাড়` : `৳${c.discountValue} ছাড়`}
                </td>
                <td className="py-3 px-2 text-neutral-600">৳{c.minOrderAmount}</td>
                <td className="py-3 px-2 text-neutral-600">{c.usedCount}/{c.totalUsageLimit}</td>
                <td className="py-3 px-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-500"}`}>
                    {c.isActive ? "এক্টিভ" : "ইন-এক্টিভ"}
                  </span>
                </td>
                <td className="py-3 px-2 space-x-2">
                  <button
                    onClick={() => toggleCouponStatus(c.id)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {c.isActive ? "ডিঅ্যাক্টিভ" : "এক্টিভ করুন"}
                  </button>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
