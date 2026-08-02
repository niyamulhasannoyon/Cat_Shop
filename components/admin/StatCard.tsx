"use client";

import React from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  badgeText?: string;
  badgeType?: "success" | "warning" | "danger" | "info";
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtext,
  badgeText,
  badgeType = "info",
  icon,
}: StatCardProps) {
  const badgeStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
    warning: "bg-amber-50 text-amber-700 border-amber-200/80 font-bold",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
    info: "bg-sky-50 text-sky-700 border-sky-200/80 font-bold",
  };

  const borderAccents = {
    success: "hover:border-emerald-500/30",
    warning: "hover:border-amber-500/30",
    danger: "hover:border-rose-500/30",
    info: "hover:border-sky-500/30",
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden group ${borderAccents[badgeType]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100/80 text-xs">
        <span className="text-slate-500 font-medium text-[11px] truncate max-w-[170px]">{subtext}</span>
        {badgeText && (
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide ${badgeStyles[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

