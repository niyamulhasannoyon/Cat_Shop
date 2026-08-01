"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminCustomersManager() {
  const { customers, updateCustomerStatus } = useShop();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">গ্রাহক তালিকা (Customer Directory)</h1>
        <p className="text-xs text-neutral-500 mt-1">কাস্টমার অ্যাকাউন্ট তথ্য দেখুন এবং অ্যাক্টিভ/ব্লক স্ট্যাটাস সেট করুন</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">নাম</th>
              <th className="py-3 px-2">যোগাযোগ</th>
              <th className="py-3 px-2">ঠিকানা</th>
              <th className="py-3 px-2">মোট অর্ডার</th>
              <th className="py-3 px-2">মোট খরচ (৳)</th>
              <th className="py-3 px-2">স্ট্যাটাস</th>
              <th className="py-3 px-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 font-bold text-neutral-900">{c.name}</td>
                <td className="py-3 px-2 space-y-0.5">
                  <div className="text-neutral-800 font-medium">{c.phone}</div>
                  <div className="text-neutral-400 text-[10px]">{c.email}</div>
                </td>
                <td className="py-3 px-2 text-neutral-600 max-w-xs truncate">{c.shippingAddresses.join(" | ")}</td>
                <td className="py-3 px-2 font-bold text-neutral-900">{c.totalOrders}টি</td>
                <td className="py-3 px-2 font-bold text-brand-forest">৳{c.totalSpent.toLocaleString("bn-BD")}</td>
                <td className="py-3 px-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {c.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => updateCustomerStatus(c.id, c.status === "active" ? "blocked" : "active")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${c.status === "active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                  >
                    {c.status === "active" ? "ব্লক করুন" : "আনব্লক করুন"}
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
