import React from "react";
import Navbar from "@/components/layout/Navbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
