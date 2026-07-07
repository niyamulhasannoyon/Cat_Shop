"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Customer } from "@/types";

export default function CustomersList() {
  const router = useRouter();
  const { customers, updateCustomerStatus } = useShop();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtered & Searched Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // 1. Search term (name, email, phone)
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.phone.includes(q);

      // 2. Status filter
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      // 3. Verification filter
      const isVerified = customer.emailVerified || customer.phoneVerified;
      const matchesVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" && isVerified) ||
        (verifiedFilter === "unverified" && !isVerified);

      return matchesSearch && matchesStatus && matchesVerified;
    });
  }, [customers, searchTerm, statusFilter, verifiedFilter]);

  // Paginated Customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // CSV Export Handler
  const handleCSVExport = () => {
    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Phone",
      "Total Orders",
      "Total Spent (BDT)",
      "Signup Date",
      "Status",
      "Email Verified",
      "Phone Verified",
      "Last Login Date"
    ];

    let csvContent = "\ufeff" + headers.join(",") + "\n"; // UTF-8 BOM for MS Excel support

    filteredCustomers.forEach((c) => {
      const row = [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.totalOrders,
        c.totalSpent,
        new Date(c.signupDate).toLocaleDateString("en-US"),
        c.status,
        c.emailVerified ? "Yes" : "No",
        c.phoneVerified ? "Yes" : "No",
        new Date(c.lastLoginDate).toLocaleDateString("en-US")
      ];

      const escapedRow = row.map((val) => {
        const stringVal = String(val);
        if (stringVal.includes(",") || stringVal.includes("\"") || stringVal.includes("\n")) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      });

      csvContent += escapedRow.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <span className="text-xs font-bold text-stone-600">👥 গ্রাহক তালিকা</span>
        </div>
      </section>

      {/* Navigation tabs */}
      <section className="bg-white border-b border-brand-beige-dark py-1.5 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none" aria-label="Tabs">
            <Link
              href="/admin?tab=dashboard"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50"
            >
              📊 ড্যাশবোর্ড
            </Link>
            <Link
              href="/admin?tab=products"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50"
            >
              📦 পণ্য CRUD
            </Link>
            <Link
              href="/admin?tab=orders"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50"
            >
              📋 অর্ডার ম্যানেজার
            </Link>
            <Link
              href="/admin?tab=bundles"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50"
            >
              🏷️ বান্ডেল অফার
            </Link>
            <Link
              href="/admin/customers"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 bg-brand-forest text-brand-beige shadow-sm"
            >
              👥 গ্রাহক তালিকা
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title and CSV Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-beige-dark pb-4">
          <div>
            <h2 className="text-lg font-bold text-brand-charcoal">গ্রাহক তালিকা পরিচালনা (Customer Management)</h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">সব রেজিস্টার্ড গ্রাহকের তথ্য, লাইফটাইম ভ্যালু ও একাউন্ট স্ট্যাটাস মনিটর করুন</p>
          </div>
          <button
            onClick={handleCSVExport}
            className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            📥 CSV এক্সপোর্ট করুন
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="space-y-1">
            <label htmlFor="search-input" className="text-[11px] font-bold text-stone-500">গ্রাহক খুঁজুন (নাম, ইমেইল, ফোন)</label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="যেমন: আরিফ রহমান..."
                className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 pl-8 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
              />
              <span className="absolute left-2.5 top-3 text-stone-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label htmlFor="status-filter" className="text-[11px] font-bold text-stone-500 font-sans">অ্যাকাউন্ট স্ট্যাটাস ফিল্টার</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors cursor-pointer"
            >
              <option value="all">সব স্ট্যাটাস (All)</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="blocked">ব্লকড (Blocked)</option>
            </select>
          </div>

          {/* Verification filter */}
          <div className="space-y-1">
            <label htmlFor="verif-filter" className="text-[11px] font-bold text-stone-500">ভেরিফিকেশন স্ট্যাটাস ফিল্টার</label>
            <select
              id="verif-filter"
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors cursor-pointer"
            >
              <option value="all">সব ভেরিফিকেশন (All)</option>
              <option value="verified">ভেরিফাইড (Verified)</option>
              <option value="unverified">আনভেরিফাইড (Unverified)</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-beige-dark">
              <thead className="bg-brand-beige">
                <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:py-4 sm:px-6">গ্রাহক</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">যোগাযোগ</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">সাইনআপ তারিখ</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-center">অর্ডার সংখ্যা</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-right">মোট খরচ</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => {
                    const isVerified = customer.emailVerified || customer.phoneVerified;
                    return (
                      <tr
                        key={customer.id}
                        onClick={() => router.push(`/admin/customers/${customer.id}`)}
                        className="hover:bg-brand-beige/20 text-brand-charcoal cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 sm:py-4 sm:px-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{customer.name}</span>
                            {isVerified ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-250 font-bold" title="Verified Account">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-bold" title="Unverified Account">
                                Unverified
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-stone-400">{customer.id}</p>
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 space-y-0.5">
                          <p className="text-stone-600">{customer.email}</p>
                          <p className="text-stone-400 text-[10px]">{customer.phone}</p>
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-stone-500">
                          {new Date(customer.signupDate).toLocaleDateString("bn-BD")}
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-center font-semibold text-brand-charcoal">
                          {customer.totalOrders} টি
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-right font-bold text-brand-forest">
                          ৳{customer.totalSpent.toLocaleString("bn-BD")}
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              customer.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {customer.status === "active" ? "সক্রিয়" : "ব্লকড"}
                          </span>
                        </td>
                        <td
                          className="py-3 px-4 sm:py-4 sm:px-6 text-center"
                          onClick={(e) => e.stopPropagation()} // Prevent row click routing
                        >
                          <button
                            onClick={() => {
                              const nextStatus = customer.status === "active" ? "blocked" : "active";
                              if (confirm(`আপনি কি সত্যিই "${customer.name}" কে ${nextStatus === "blocked" ? "ব্লক" : "আনব্লক"} করতে চান?`)) {
                                updateCustomerStatus(customer.id, nextStatus);
                              }
                            }}
                            className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              customer.status === "active"
                                ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                            }`}
                          >
                            {customer.status === "active" ? "ব্লক করুন" : "আনব্লক করুন"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      <span className="text-4xl block mb-2">👥</span>
                      কোনো গ্রাহক পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-brand-beige/35 border-t border-brand-beige-dark px-4 py-4 sm:px-6 flex items-center justify-between">
              <div className="text-xs text-stone-500 font-light">
                মোট <span className="font-semibold">{filteredCustomers.length}</span> জন গ্রাহকের মধ্যে{" "}
                <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                </span>{" "}
                দেখানো হচ্ছে
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-brand-beige-dark bg-white text-xs font-semibold hover:bg-brand-beige/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  ◀ পূর্ববর্তী
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === idx + 1
                        ? "bg-brand-forest text-brand-beige"
                        : "bg-white border border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige/50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-brand-beige-dark bg-white text-xs font-semibold hover:bg-brand-beige/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  পরবর্তী ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
