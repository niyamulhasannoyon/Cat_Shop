"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminStaffLogsManager() {
  const { staffLogs, staffList, activeStaff } = useShop();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">স্টাফ অডিট লগ (Staff Activity Logs)</h1>
        <p className="text-xs text-neutral-500 mt-1">স্টাফ মেম্বারদের রোল এবং সিস্টেম অ্যাক্টিভিটি ট্র্যাক করুন</p>
      </div>

      {/* Staff Accounts List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900">অ্যাডমিন ও স্টাফ অ্যাকাউন্টস</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffList.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-xs">{s.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-forest/10 text-brand-forest">
                  {s.role}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500">{s.email}</div>
              {activeStaff?.id === s.id && (
                <span className="text-[9px] font-bold text-emerald-600 block pt-1">● বর্তমানে লগইন আছেন</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Staff Logs Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <h2 className="text-base font-bold text-neutral-900 mb-4">অ্যাক্টিভিটি হিস্টোরি (Activity History)</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">সময়</th>
              <th className="py-3 px-2">স্টাফ নাম</th>
              <th className="py-3 px-2">রোল</th>
              <th className="py-3 px-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {staffLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 text-neutral-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString("bn-BD")}
                </td>
                <td className="py-3 px-2 font-bold text-neutral-900">{log.staffName}</td>
                <td className="py-3 px-2 font-semibold text-brand-forest text-[11px]">{log.staffRole}</td>
                <td className="py-3 px-2 text-neutral-700">{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
