"use client";

import React from "react";
import AdminSecurityWrapper from "@/components/AdminSecurityWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSecurityWrapper>{children}</AdminSecurityWrapper>;
}
