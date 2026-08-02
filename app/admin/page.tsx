"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminProductsManager from "@/components/admin/AdminProductsManager";
import AdminOrdersManager from "@/components/admin/AdminOrdersManager";
import AdminCustomersManager from "@/components/admin/AdminCustomersManager";
import AdminCouponsManager from "@/components/admin/AdminCouponsManager";
import AdminReviewsManager from "@/components/admin/AdminReviewsManager";
import AdminSettingsManager from "@/components/admin/AdminSettingsManager";
import AdminStockManager from "@/components/admin/AdminStockManager";
import AdminStaffLogsManager from "@/components/admin/AdminStaffLogsManager";

function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  return (
    <div className="space-y-6">
      {tab === "dashboard" && <AdminDashboardOverview />}
      {tab === "products" && <AdminProductsManager />}
      {tab === "orders" && <AdminOrdersManager />}
      {tab === "customers" && <AdminCustomersManager />}
      {tab === "coupons" && <AdminCouponsManager />}
      {tab === "reviews" && <AdminReviewsManager />}
      {tab === "inventory" && <AdminStockManager />}
      {tab === "shipping" && <AdminSettingsManager />}
      {tab === "settings" && <AdminSettingsManager />}
      {tab === "staff-logs" && <AdminStaffLogsManager />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 font-semibold text-slate-500">লোড হচ্ছে...</div>}>
      <AdminContent />
    </Suspense>
  );
}
