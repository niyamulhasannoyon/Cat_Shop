import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 space-y-4 animate-pulse">
      <div className="aspect-square w-full bg-neutral-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-neutral-200 rounded w-1/3" />
        <div className="h-8 bg-neutral-200 rounded-xl w-1/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-neutral-100">
      <td className="p-4"><div className="h-4 bg-neutral-200 rounded w-16" /></td>
      <td className="p-4"><div className="h-4 bg-neutral-200 rounded w-32" /></td>
      <td className="p-4"><div className="h-4 bg-neutral-200 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-neutral-200 rounded w-20" /></td>
      <td className="p-4"><div className="h-4 bg-neutral-200 rounded w-16" /></td>
    </tr>
  );
}
