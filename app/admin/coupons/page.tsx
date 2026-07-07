"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const {
    coupons,
    couponUsageLogs,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    products,
    activeStaff
  } = useShop();

  if (activeStaff?.role !== "Super Admin") {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-4 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-brand-beige-dark shadow-sm space-y-4">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-black text-brand-charcoal">অ্যাক্সেস অস্বীকৃত (Access Denied)</h3>
          <p className="text-xs text-stone-500">এই পৃষ্ঠাটি দেখার জন্য আপনার পর্যাপ্ত অনুমতি নেই। শুধুমাত্র সুপার এডমিন এই পৃষ্ঠাটি অ্যাক্সেস করতে পারেন।</p>
          <Link
            href="/admin"
            className="inline-block bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-2.5 px-6 rounded-xl font-bold text-xs"
          >
            এডমিন ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // Coupon Creation Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("0");
  const [maxDiscountCap, setMaxDiscountCap] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [totalUsageLimit, setTotalUsageLimit] = useState("100");
  const [perUserUsageLimit, setPerUserUsageLimit] = useState("1");
  const [applicableOn, setApplicableOn] = useState<"all" | "category" | "product">("all");
  const [applicableCategory, setApplicableCategory] = useState("cats");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalDiscountDisbursed = couponUsageLogs.reduce((sum, log) => sum + log.discountAmount, 0);
    const totalUsages = couponUsageLogs.length;

    // Find most popular promo code
    const counts: { [key: string]: number } = {};
    couponUsageLogs.forEach((log) => {
      counts[log.couponCode] = (counts[log.couponCode] || 0) + 1;
    });

    let popularCode = "—";
    let maxCount = 0;
    Object.keys(counts).forEach((code) => {
      if (counts[code] > maxCount) {
        maxCount = counts[code];
        popularCode = code;
      }
    });

    return {
      totalDiscountDisbursed,
      totalUsages,
      popularCode: popularCode !== "—" ? `${popularCode} (${maxCount} বার)` : "—"
    };
  }, [couponUsageLogs]);

  // Form submission handler
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!code.trim()) {
      setFormError("কুপন কোড আবশ্যিক।");
      return;
    }

    // Verify uniqueness
    const exists = coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (exists) {
      setFormError("এই কুপন কোডটি ইতিমধ্যে ব্যবহার করা হয়েছে। ভিন্ন কোড দিন।");
      return;
    }

    const valueNum = Number(discountValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      setFormError("দয়া করে সঠিক ডিসকাউন্ট মূল্য নির্ধারণ করুন।");
      return;
    }

    if (discountType === "percentage" && (valueNum <= 0 || valueNum > 100)) {
      setFormError("শতকরা ডিসকাউন্ট অবশ্যই ১ থেকে ১০০ এর মধ্যে হতে হবে।");
      return;
    }

    // Call add coupon from context
    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: valueNum,
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscountCap: maxDiscountCap ? Number(maxDiscountCap) : undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(`${endDate}T23:59:59.999Z`).toISOString(),
      totalUsageLimit: Number(totalUsageLimit || 100),
      perUserUsageLimit: Number(perUserUsageLimit || 1),
      applicableOn,
      applicableCategory: applicableOn === "category" ? applicableCategory : undefined,
      applicableProductIds: applicableOn === "product" && selectedProductIds.length > 0 ? selectedProductIds : undefined,
      isActive: true
    });

    // Reset Form states
    setCode("");
    setDiscountValue("");
    setMinOrderAmount("0");
    setMaxDiscountCap("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setTotalUsageLimit("100");
    setPerUserUsageLimit("1");
    setApplicableOn("all");
    setSelectedProductIds([]);
    setShowAddForm(false);
    alert("🎉 নতুন প্রোমো কুপন সফলভাবে তৈরি করা হয়েছে!");
  };

  const handleProductToggle = (prodId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal antialiased">
      
      {/* Navigation Bar */}
      <section className="bg-white border-b border-brand-beige-dark px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 items-center">
          <Link
            href="/admin?tab=dashboard"
            className="px-4 py-2 text-xs font-bold rounded-lg border bg-brand-charcoal border-brand-charcoal text-brand-beige hover:bg-brand-charcoal/90 transition-colors"
          >
            ← এডমিন ড্যাশবোর্ড
          </Link>
          <span className="text-xs font-bold text-stone-600">🏷️ কুপন ও প্রমোশন ম্যানেজার</span>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-beige-dark shadow-sm flex items-center gap-4">
            <span className="text-3xl p-3 bg-brand-beige text-brand-forest rounded-xl border border-brand-beige-dark">৳</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">মোট ডিসকাউন্ট প্রদান</p>
              <h3 className="text-lg font-black text-brand-forest mt-0.5">৳{analytics.totalDiscountDisbursed.toLocaleString("bn-BD")}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-brand-beige-dark shadow-sm flex items-center gap-4">
            <span className="text-3xl p-3 bg-brand-beige text-brand-forest rounded-xl border border-brand-beige-dark">📈</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">মোট কুপন ব্যবহার</p>
              <h3 className="text-lg font-black text-brand-charcoal mt-0.5">{analytics.totalUsages} বার</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-brand-beige-dark shadow-sm flex items-center gap-4">
            <span className="text-3xl p-3 bg-brand-beige text-brand-forest rounded-xl border border-brand-beige-dark">🔥</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">জনপ্রিয় প্রমোকোড</p>
              <h3 className="text-sm font-bold text-brand-charcoal mt-1 truncate">{analytics.popularCode}</h3>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center border-b border-brand-beige-dark pb-4">
          <div>
            <h3 className="text-base font-bold text-brand-charcoal">সক্রিয় কুপন কোড সমূহ</h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">কাস্টমার ডিসকাউন্ট ক্যাম্পেইন লিস্ট পরিচালনা করুন</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন কুপন তৈরি করুন +"}
          </button>
        </div>

        {/* Coupon Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-md max-w-3xl animate-slideDown">
            <h4 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-2 mb-4">কুপন সংযোজন ফর্ম</h4>
            
            {formError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs font-semibold mb-4">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label htmlFor="coupon-code" className="text-[11px] font-bold text-stone-500">কুপন কোড <span className="text-red-500">*</span></label>
                  <input
                    id="coupon-code"
                    type="text"
                    required
                    placeholder="যেমন: EID2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal uppercase font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="discount-type" className="text-[11px] font-bold text-stone-500">ডিসকাউন্ট টাইপ</label>
                  <select
                    id="discount-type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none cursor-pointer"
                  >
                    <option value="percentage">শতকরা হার (%)</option>
                    <option value="fixed">স্থির পরিমাণ (৳)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="discount-value" className="text-[11px] font-bold text-stone-500">ডিসকাউন্ট মূল্য <span className="text-red-500">*</span></label>
                  <input
                    id="discount-value"
                    type="number"
                    required
                    placeholder={discountType === "percentage" ? "যেমন: ১৫" : "যেমন: ২৫০"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="min-amount" className="text-[11px] font-bold text-stone-500">ন্যূনতম অর্ডারের পরিমাণ (৳)</label>
                  <input
                    id="min-amount"
                    type="number"
                    placeholder="যেমন: ১০০০"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="max-cap" className="text-[11px] font-bold text-stone-500">সর্বোচ্চ ছাড় ক্যাপ (৳)</label>
                  <input
                    id="max-cap"
                    type="number"
                    disabled={discountType === "fixed"}
                    placeholder="যেমন: ৫০০ (ঐচ্ছিক)"
                    value={maxDiscountCap}
                    onChange={(e) => setMaxDiscountCap(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="usage-limit" className="text-[11px] font-bold text-stone-500">মোট ব্যবহারের সীমা (বার)</label>
                  <input
                    id="usage-limit"
                    type="number"
                    placeholder="যেমন: ১০০"
                    value={totalUsageLimit}
                    onChange={(e) => setTotalUsageLimit(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="user-limit" className="text-[11px] font-bold text-stone-500">ইউজার প্রতি ব্যবহারের সীমা</label>
                  <input
                    id="user-limit"
                    type="number"
                    placeholder="যেমন: ১"
                    value={perUserUsageLimit}
                    onChange={(e) => setPerUserUsageLimit(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="start-date" className="text-[11px] font-bold text-stone-500">মেয়াদ শুরুর তারিখ</label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="end-date" className="text-[11px] font-bold text-stone-500">মেয়াদ শেষের তারিখ</label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="applicable" className="text-[11px] font-bold text-stone-500">যেসব পণ্যে প্রযোজ্য</label>
                  <select
                    id="applicable"
                    value={applicableOn}
                    onChange={(e) => setApplicableOn(e.target.value as any)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none cursor-pointer"
                  >
                    <option value="all">সকল পণ্য (All Products)</option>
                    <option value="category">নির্দিষ্ট ক্যাটাগরি (Category)</option>
                    <option value="product">নির্দিষ্ট প্রডাক্টস (Specific Products)</option>
                  </select>
                </div>

                {applicableOn === "category" && (
                  <div className="space-y-1">
                    <label htmlFor="app-cat" className="text-[11px] font-bold text-stone-500">ক্যাটাগরি নির্বাচন করুন</label>
                    <select
                      id="app-cat"
                      value={applicableCategory}
                      onChange={(e) => setApplicableCategory(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none cursor-pointer"
                    >
                      <option value="cats">🐱 বিড়াল (Cats)</option>
                      <option value="dogs">🐶 কুকুর (Dogs)</option>
                      <option value="birds">🦜 পাখি ও অন্যান্য (Birds)</option>
                    </select>
                  </div>
                )}

              </div>

              {applicableOn === "product" && (
                <div className="space-y-2 border border-dashed border-brand-beige-dark p-4 rounded-xl bg-brand-beige/25">
                  <label className="text-[11px] font-bold text-stone-500 block">কুপন প্রযোজ্য পণ্যসমূহ নির্বাচন করুন:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto pr-1">
                    {products.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 bg-white border border-brand-beige-dark p-2 rounded-lg text-[11px] cursor-pointer hover:bg-brand-beige/30 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => handleProductToggle(p.id)}
                          className="h-3.5 w-3.5 rounded text-brand-forest focus:ring-brand-forest border-brand-beige-dark"
                        />
                        <span className="truncate">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2 border-t border-brand-beige-dark">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal px-5 py-2 rounded-full text-xs font-semibold border border-brand-beige-dark transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-6 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  কুপন তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons List Table */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
              <thead className="bg-brand-beige">
                <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">কুপন কোড</th>
                  <th className="py-3 px-4">ডিসকাউন্ট মান</th>
                  <th className="py-3 px-4">প্রযোজ্য শর্তাবলী</th>
                  <th className="py-3 px-4 text-center">ব্যবহারের সংখ্যা / সীমা</th>
                  <th className="py-3 px-4">মেয়াদকাল</th>
                  <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige-dark bg-white text-brand-charcoal">
                {coupons && coupons.length > 0 ? (
                  coupons.map((coupon) => {
                    const now = new Date().toISOString();
                    const isExpired = now > coupon.endDate;
                    const isPending = now < coupon.startDate;
                    
                    return (
                      <tr key={coupon.id} className="hover:bg-brand-beige/20">
                        <td className="py-3 px-4 font-mono font-bold text-sm text-brand-forest uppercase">{coupon.code}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-stone-850">
                            {coupon.discountType === "percentage" ? `${coupon.discountValue}% ছাড়` : `৳${coupon.discountValue} ছাড়`}
                          </span>
                          {coupon.maxDiscountCap && (
                            <p className="text-[9px] text-stone-400 font-light mt-0.5">(সর্বোচ্চ ছাড়: ৳{coupon.maxDiscountCap})</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">ন্যূনতম অর্ডার: ৳{coupon.minOrderAmount}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {coupon.applicableOn === "all" 
                              ? "সকল পণ্যে প্রযোজ্য" 
                              : coupon.applicableOn === "category" 
                              ? `ক্যাটাগরি: ${coupon.applicableCategory === "cats" ? "বিড়াল" : coupon.applicableCategory === "dogs" ? "কুকুর" : "পাখি"}`
                              : `নির্দিষ্ট পণ্যসমূহ (${coupon.applicableProductIds?.length || 0}টি)`
                            }
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {coupon.usedCount} / {coupon.totalUsageLimit}
                          <p className="text-[9px] text-stone-400 font-light mt-0.5">(ইউজার লিমিট: {coupon.perUserUsageLimit}বার)</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{new Date(coupon.endDate).toLocaleDateString("bn-BD")}</p>
                          <p className="text-[9px] text-stone-400 font-light mt-0.5">
                            {isExpired 
                              ? "Expired 🚫" 
                              : isPending 
                              ? "Pending ⏳" 
                              : "Active ✓"
                            }
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleCouponStatus(coupon.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-xs transition-colors cursor-pointer border ${
                              coupon.isActive && !isExpired
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {coupon.isActive && !isExpired ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি সত্যিই "${coupon.code}" কুপনটি ডিলিট করতে চান?`)) {
                                deleteCoupon(coupon.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      কোনো কুপন তৈরি করা হয়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coupon Usage Logs Timeline */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
          <div className="border-b border-brand-beige-dark pb-3">
            <h3 className="text-sm font-bold text-brand-charcoal">কুপন ব্যবহারের অডিট টাইমলাইন (Coupon Utilization Timeline)</h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">গ্রাহকদের কুপন কোড ব্যবহারের রিয়েল-টাইম লগ ট্র্যাকার</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-2 px-3">ব্যবহারের সময়</th>
                  <th className="py-2 px-3">কুপন কোড</th>
                  <th className="py-2 px-3">অর্ডার আইডি</th>
                  <th className="py-2 px-3">কাস্টমার ফোন</th>
                  <th className="py-2 px-3 text-right">ডিসকাউন্ট ছাড় (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige-dark bg-white text-brand-charcoal">
                {couponUsageLogs && couponUsageLogs.length > 0 ? (
                  couponUsageLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-brand-beige/10">
                      <td className="py-2.5 px-3 text-stone-400">{new Date(log.createdAt).toLocaleString("bn-BD")}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-brand-forest uppercase">{log.couponCode}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">{log.orderId}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">{log.customerPhone}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-brand-forest">৳{log.discountAmount.toLocaleString("bn-BD")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-400">
                      এখনো কোনো কুপন ব্যবহৃত হয়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
