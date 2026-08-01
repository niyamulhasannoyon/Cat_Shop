"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import RatingStars from "../shop/RatingStars";

export default function AdminReviewsManager() {
  const { reviews, approveReview, rejectReview } = useShop();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">রিভিউ মডারেশন (Product Reviews)</h1>
        <p className="text-xs text-neutral-500 mt-1">গ্রাহকদের ফিডব্যাক রিভিউ করুন এবং অ্যাপ্রুভ বা রিজেক্ট করুন</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">পণ্য</th>
              <th className="py-3 px-2">গ্রাহক</th>
              <th className="py-3 px-2">রেটিং</th>
              <th className="py-3 px-2">মতামত (Comment)</th>
              <th className="py-3 px-2">স্ট্যাটাস</th>
              <th className="py-3 px-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 font-bold text-neutral-900">{r.productName}</td>
                <td className="py-3 px-2 text-neutral-700 font-semibold">{r.customerName}</td>
                <td className="py-3 px-2">
                  <RatingStars rating={r.rating} />
                </td>
                <td className="py-3 px-2 text-neutral-600 max-w-sm italic">&quot;{r.comment}&quot;</td>
                <td className="py-3 px-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === "approved" ? "bg-emerald-100 text-emerald-800" : r.status === "rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-2 space-x-2">
                  {r.status !== "approved" && (
                    <button
                      onClick={() => approveReview(r.id)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      অ্যাপ্রুভ
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      onClick={() => rejectReview(r.id, "অপ্রাসঙ্গিক রিভিউ")}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      রিজেক্ট
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
