"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminStockManager() {
  const { stockLogs, bulkUpdateStock } = useShop();

  const [csvText, setCsvText] = useState("");
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleBulkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText) return;
    const res = bulkUpdateStock(csvText);
    setFeedback(res);
    if (res.success) {
      setCsvText("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">ইনভেন্টরি ও স্টক লগ (Inventory & Stock Logs)</h1>
        <p className="text-xs text-neutral-500 mt-1">বাল্ক CSV স্টক আপডেট করুন এবং স্টকের পরিবর্তন ইতিহাস পর্যবেক্ষণ করুন</p>
      </div>

      {/* CSV Import Box */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4 max-w-2xl">
        <h2 className="text-base font-bold text-neutral-900">CSV দিয়ে বাল্ক স্টক আপডেট (Bulk Stock CSV Import)</h2>
        <p className="text-xs text-neutral-500">
          ফরম্যাট: <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">productId,newStock</code> প্রতি লাইনে। উদাহরণ: <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">1,25</code>
        </p>

        {feedback && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${feedback.success ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleBulkUpdate} className="space-y-3">
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="1,25&#10;cat_litter_premium,40&#10;leather_dog_leash,15"
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-mono"
          />
          <button
            type="submit"
            className="bg-brand-forest hover:bg-brand-forest/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            বাল্ক স্টক আপডেট করুন
          </button>
        </form>
      </div>

      {/* Stock Logs Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <h2 className="text-base font-bold text-neutral-900 mb-4">স্টক পরিবর্তনের হিস্টোরি (Stock History)</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">তারিখ</th>
              <th className="py-3 px-2">পণ্য</th>
              <th className="py-3 px-2">পরিবর্তন (Qty)</th>
              <th className="py-3 px-2">অ্যাকশন டைপ</th>
              <th className="py-3 px-2">সম্পাদনকারী</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {stockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 text-neutral-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString("bn-BD")}
                </td>
                <td className="py-3 px-2 font-bold text-neutral-900">{log.productName}</td>
                <td className="py-3 px-2 font-bold">
                  <span className={log.quantityChanged > 0 ? "text-emerald-600" : "text-rose-600"}>
                    {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                  </span>
                </td>
                <td className="py-3 px-2 uppercase font-semibold text-[10px] text-neutral-600">{log.actionType}</td>
                <td className="py-3 px-2 text-neutral-500 font-medium">{log.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
