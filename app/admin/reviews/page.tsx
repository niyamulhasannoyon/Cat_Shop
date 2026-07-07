"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const {
    reviews,
    orders,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews
  } = useShop();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectModalReviewId, setRejectModalReviewId] = useState<string | null>(null);
  const [bulkRejectModalOpen, setBulkRejectModalOpen] = useState(false);
  const [reasonInput, setReasonInput] = useState("");

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === "pending").length;
    const approved = reviews.filter(r => r.status === "approved").length;
    const rejected = reviews.filter(r => r.status === "rejected").length;

    return { total, pending, approved, rejected };
  }, [reviews]);

  // Filtered Reviews list
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
      const matchesRating = ratingFilter === "all" ? true : r.rating === Number(ratingFilter);
      return matchesStatus && matchesRating;
    });
  }, [reviews, statusFilter, ratingFilter]);

  // Checkbox operators
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredReviews.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  // Single Actions
  const handleApproveOne = (id: string) => {
    approveReview(id);
    setSelectedIds(prev => prev.filter(item => item !== id));
    alert("✓ রিভিউটি সফলভাবে অনুমোদন করা হয়েছে!");
  };

  const handleRejectOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectModalReviewId) {
      rejectReview(rejectModalReviewId, reasonInput.trim() || undefined);
      setRejectModalReviewId(null);
      setReasonInput("");
      alert("✕ রিভিউটি বাতিল করা হয়েছে।");
    }
  };

  // Bulk Actions
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`আপনি কি নির্বাচিত ${selectedIds.length}টি রিভিউ অনুমোদন করতে চান?`)) {
      bulkApproveReviews(selectedIds);
      setSelectedIds([]);
      alert(`✓ সফলভাবে ${selectedIds.length}টি রিভিউ অনুমোদন করা হয়েছে!`);
    }
  };

  const handleBulkRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    bulkRejectReviews(selectedIds, reasonInput.trim() || undefined);
    setSelectedIds([]);
    setReasonInput("");
    setBulkRejectModalOpen(false);
    alert(`✕ সফলভাবে ${selectedIds.length}টি রিভিউ বাতিল করা হয়েছে!`);
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
          <span className="text-xs font-bold text-stone-600">💬 রিভিউ ও রেটিং মডারেটর</span>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Metric widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-brand-beige-dark shadow-sm">
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">মোট রিভিউ</p>
            <h3 className="text-xl font-black text-brand-charcoal mt-0.5">{metrics.total}টি</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-beige-dark shadow-sm">
            <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">পেন্ডিং রিভিউ</p>
            <h3 className="text-xl font-black text-amber-600 mt-0.5">{metrics.pending}টি</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-beige-dark shadow-sm">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider font-semibold">অনুমোদিত রিভিউ</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">{metrics.approved}টি</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-beige-dark shadow-sm">
            <p className="text-[10px] uppercase font-bold text-red-600 tracking-wider">বাতিল রিভিউ</p>
            <h3 className="text-xl font-black text-red-700 mt-0.5">{metrics.rejected}টি</h3>
          </div>
        </div>

        {/* Filter controls and actions */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-beige-dark/50 pb-4">
            
            {/* Left side filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">স্ট্যাটাস ফিল্টার:</span>
                <div className="flex rounded-lg overflow-hidden border border-brand-beige-dark">
                  {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setSelectedIds([]);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        statusFilter === status
                          ? "bg-brand-charcoal text-brand-beige"
                          : "bg-brand-beige/25 hover:bg-brand-beige/50 text-stone-600"
                      }`}
                    >
                      {status === "all" ? "সব" : status === "pending" ? "পেন্ডিং" : status === "approved" ? "লাইভ" : "বাতিলকৃত"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">রেটিং ফিল্টার:</span>
                <select
                  value={ratingFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRatingFilter(val === "all" ? "all" : Number(val));
                    setSelectedIds([]);
                  }}
                  className="bg-brand-beige/50 border border-brand-beige-dark text-xs rounded-lg px-3 py-1.5 text-brand-charcoal focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="all">সব রেটিং</option>
                  <option value="5">⭐⭐⭐⭐⭐ (৫ স্টার)</option>
                  <option value="4">⭐⭐⭐⭐ (৪ স্টার)</option>
                  <option value="3">⭐⭐⭐ (৩ স্টার)</option>
                  <option value="2">⭐⭐ (২ স্টার)</option>
                  <option value="1">⭐ (১ স্টার)</option>
                </select>
              </div>
            </div>

            {/* Right side check select options */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-500 cursor-pointer bg-brand-beige/40 px-3 py-2 rounded-lg border border-brand-beige-dark/50">
                <input
                  type="checkbox"
                  checked={filteredReviews.length > 0 && selectedIds.length === filteredReviews.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-3.5 w-3.5 text-brand-forest focus:ring-brand-forest border-brand-beige-dark rounded"
                />
                <span>সব সিলেক্ট করুন ({selectedIds.length})</span>
              </label>
            </div>

          </div>

          {/* Bulk Action Controls Banner */}
          {selectedIds.length > 0 && (
            <div className="bg-brand-beige p-3 rounded-xl border border-brand-beige-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-slideDown">
              <div className="text-xs font-bold text-brand-charcoal">
                📢 {selectedIds.length}টি রিভিউ সিলেক্ট করা হয়েছে
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleBulkApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-brand-beige text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  একসাথে অনুমোদন করুন (Approve Selected)
                </button>
                <button
                  onClick={() => setBulkRejectModalOpen(true)}
                  className="bg-red-700 hover:bg-red-800 text-brand-beige text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  একসাথে বাতিল করুন (Reject Selected)
                </button>
              </div>
            </div>
          )}

          {/* Queue display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => {
                const isVerified = orders.some(o => 
                  o.customerPhone === rev.customerPhone && 
                  o.status === "Delivered" && 
                  o.items.some(item => item.id === rev.productId)
                );

                return (
                  <div
                    key={rev.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex gap-3.5 transition-all ${
                      selectedIds.includes(rev.id)
                        ? "border-brand-forest bg-brand-forest/2 shadow-sm"
                        : "border-brand-beige-dark/70 hover:border-brand-beige-dark hover:shadow-xs"
                    }`}
                  >
                    {/* Checkbox select column */}
                    <div className="flex-shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(rev.id)}
                        onChange={(e) => handleSelectOne(rev.id, e.target.checked)}
                        className="h-4 w-4 text-brand-forest focus:ring-brand-forest border-brand-beige-dark rounded cursor-pointer"
                      />
                    </div>

                    {/* Core details column */}
                    <div className="flex-1 space-y-3">
                      
                      {/* Customer and Product Details */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-xs text-brand-charcoal">{rev.customerName}</span>
                            <span className="text-[10px] text-stone-400 font-mono">({rev.customerPhone})</span>
                            {isVerified && (
                              <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-1.5 py-0.5 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          
                          {/* Rating Stars display */}
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                            <span className="text-stone-400 font-bold ml-0.5">{rev.rating}.০</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          rev.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rev.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-250 border-amber-200"
                        }`}>
                          {rev.status === "approved" ? "লাইভ" : rev.status === "rejected" ? "বাতিলকৃত" : "পেন্ডিং"}
                        </span>
                      </div>

                      {/* Product Name reference */}
                      <div className="bg-brand-beige/40 border border-brand-beige-dark/50 p-2 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">প্রোডাক্ট:</span>
                        <span className="text-[11px] font-bold text-brand-forest">{rev.productName}</span>
                      </div>

                      {/* Review Comment Text */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">মন্তব্য:</span>
                        <p className="text-xs text-stone-600 font-light leading-relaxed whitespace-pre-line bg-neutral-50/50 p-2.5 rounded-lg border border-neutral-100 italic">
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>

                      {/* Attached images if any */}
                      {rev.photoUrl && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">সংযুক্ত ছবি:</span>
                          <div className="w-28 h-28 rounded-lg overflow-hidden border border-brand-beige-dark shadow-sm bg-neutral-50 hover:opacity-95 transition-opacity">
                            <img src={rev.photoUrl} alt="Review attachment" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}

                      {/* Rejection Internal note if rejected */}
                      {rev.status === "rejected" && rev.rejectReason && (
                        <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg">
                          <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block">রিজেকশন কারণ (Internal Note):</span>
                          <p className="text-xs text-red-800 font-medium mt-0.5">{rev.rejectReason}</p>
                        </div>
                      )}

                      {/* Review Date and Action buttons */}
                      <div className="pt-2 border-t border-brand-beige-dark/40 flex items-center justify-between gap-4">
                        <span className="text-[10px] text-stone-400 font-light">তারিখ: {new Date(rev.createdAt).toLocaleDateString("bn-BD")}</span>
                        
                        {rev.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveOne(rev.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-brand-beige text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => setRejectModalReviewId(rev.id)}
                              className="bg-red-700 hover:bg-red-800 text-brand-beige text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-12 text-center text-stone-400">
                কোনো রিভিউ পাওয়া যায়নি।
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Single Review Rejection Reason Modal */}
      {rejectModalReviewId && (
        <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="border-b border-brand-beige-dark pb-2">
              <h4 className="text-sm font-bold text-brand-charcoal">রিভিউ বাতিলের কারণ</h4>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">এই নোটটি শুধুমাত্র অভ্যন্তরীণ কাজের জন্য (Internal Use Only)</p>
            </div>
            <form onSubmit={handleRejectOneSubmit} className="space-y-4">
              <textarea
                placeholder="যেমন: স্প্যাম বা বিজ্ঞাপনমূলক মন্তব্য।"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none min-h-[80px]"
              />
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setRejectModalReviewId(null);
                    setReasonInput("");
                  }}
                  className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal text-xs font-semibold px-4 py-2 rounded-lg border border-brand-beige-dark transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-brand-beige text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Rejection Reason Modal */}
      {bulkRejectModalOpen && (
        <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="border-b border-brand-beige-dark pb-2">
              <h4 className="text-sm font-bold text-brand-charcoal">রিভিউসমূহ বাতিলের কারণ</h4>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">নির্বাচিত {selectedIds.length}টি রিভিউর জন্য বাতিলের কারণ লিখুন (Internal Only)</p>
            </div>
            <form onSubmit={handleBulkRejectSubmit} className="space-y-4">
              <textarea
                placeholder="যেমন: অবান্তর রিভিউ বা একই কোডের প্রচার।"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none min-h-[80px]"
              />
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setBulkRejectModalOpen(false);
                    setReasonInput("");
                  }}
                  className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal text-xs font-semibold px-4 py-2 rounded-lg border border-brand-beige-dark transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-brand-beige text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
