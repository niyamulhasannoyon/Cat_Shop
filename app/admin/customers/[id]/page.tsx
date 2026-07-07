"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { customers, orders, updateCustomerStatus } = useShop();

  // Find customer
  const customer = customers.find((c) => c.id === id);

  // If customer not found
  if (!customer) {
    return (
      <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-brand-beige-dark p-8 shadow-md text-center space-y-4 max-w-md">
          <span className="text-5xl block">⚠️</span>
          <h1 className="text-lg font-bold">গ্রাহক পাওয়া যায়নি!</h1>
          <p className="text-xs text-stone-500 font-light">
            দুঃখিত, আপনি যে গ্রাহকের তথ্য খুঁজছেন তা সিস্টেমে পাওয়া যায়নি অথবা মুছে ফেলা হয়েছে।
          </p>
          <Link
            href="/admin/customers"
            className="inline-block bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-6 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
          >
            ← গ্রাহক তালিকায় ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // Get customer order history matching by phone or name
  const customerOrders = orders.filter(
    (o) => o.customerPhone === customer.phone || o.customerName === customer.name
  );

  // Recalculate lifetime values based on live orders (fallback to profile defaults if no orders are present)
  const orderCount = Math.max(customer.totalOrders, customerOrders.length);
  const totalLifetimeSpent = customerOrders.length > 0 
    ? customerOrders.reduce((sum, o) => sum + o.grandTotal, 0)
    : customer.totalSpent;
  
  const averageOrderValue = orderCount > 0 
    ? Math.round(totalLifetimeSpent / orderCount)
    : 0;

  const handleToggleBlock = () => {
    const nextStatus = customer.status === "active" ? "blocked" : "active";
    if (
      confirm(
        `আপনি কি সত্যিই "${customer.name}" কে ${
          nextStatus === "blocked" ? "ব্লক" : "আনব্লক"
        } করতে চান?`
      )
    ) {
      updateCustomerStatus(customer.id, nextStatus);
    }
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal antialiased">
      
      {/* Navigation Bar */}
      <section className="bg-white border-b border-brand-beige-dark px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 items-center">
          <Link
            href="/admin/customers"
            className="px-4 py-2 text-xs font-bold rounded-lg border bg-brand-charcoal border-brand-charcoal text-brand-beige hover:bg-brand-charcoal/90 transition-colors"
          >
            ← গ্রাহক তালিকা
          </Link>
          <span className="text-xs font-bold text-stone-600">👤 গ্রাহক প্রোফাইল বিস্তারিত</span>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs and Controls */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-brand-beige-dark pb-4">
          <div className="space-y-0.5">
            <div className="text-xs text-stone-400 font-light flex items-center gap-1">
              <Link href="/admin" className="hover:underline">এডমিন</Link>
              <span>/</span>
              <Link href="/admin/customers" className="hover:underline">গ্রাহক তালিকা</Link>
              <span>/</span>
              <span className="text-stone-600">{customer.name}</span>
            </div>
            <h2 className="text-lg font-bold text-brand-charcoal">গ্রাহক প্রোফাইল ও ইতিহাস</h2>
          </div>
          
          {/* Status actions */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-medium">অ্যাকাউন্ট স্ট্যাটাস:</span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                customer.status === "active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {customer.status === "active" ? "সক্রিয় (Active)" : "ব্লকড (Blocked)"}
            </span>
            <button
              onClick={handleToggleBlock}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                customer.status === "active"
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-emerald-750 hover:bg-emerald-800 bg-brand-forest text-brand-beige"
              }`}
            >
              {customer.status === "active" ? "🚫 ব্লক করুন" : "✓ আনব্লক করুন"}
            </button>
          </div>
        </div>

        {/* Profile Card & Key Statistics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Full Profile Info */}
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-6 lg:col-span-1">
            <div className="border-b border-brand-beige-dark pb-4 space-y-2">
              <div className="h-16 w-16 bg-brand-charcoal/5 border border-brand-charcoal/10 rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-forest">
                {customer.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-brand-charcoal">{customer.name}</h3>
              <p className="text-[11px] font-mono text-stone-400">ID: {customer.id}</p>
            </div>

            {/* Profile fields */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400 font-bold block uppercase tracking-wider text-[10px]">ইমেইল অ্যাড্রেস</span>
                <p className="font-medium text-brand-charcoal break-all">{customer.email}</p>
                <div className="pt-1">
                  {customer.emailVerified ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">
                      ✓ Email Verified
                    </span>
                  ) : (
                    <span className="bg-stone-100 text-stone-500 border border-stone-200 text-[10px] px-2 py-0.5 rounded">
                      Unverified Email
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-bold block uppercase tracking-wider text-[10px]">ফোন নম্বর</span>
                <p className="font-semibold text-brand-charcoal">{customer.phone}</p>
                <div className="pt-1">
                  {customer.phoneVerified ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">
                      ✓ Phone Verified
                    </span>
                  ) : (
                    <span className="bg-stone-100 text-stone-500 border border-stone-200 text-[10px] px-2 py-0.5 rounded">
                      Unverified Phone
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-brand-beige-dark">
                <span className="text-stone-400 font-bold block uppercase tracking-wider text-[10px]">অ্যাকাউন্ট তৈরি</span>
                <p className="font-medium text-stone-600">
                  {new Date(customer.signupDate).toLocaleString("bn-BD")}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-bold block uppercase tracking-wider text-[10px]">সর্বশেষ লগইন</span>
                <p className="font-medium text-stone-600">
                  {new Date(customer.lastLoginDate).toLocaleString("bn-BD")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lifetime Stats and Shipping Addresses */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Total Orders Card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-sm space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">মোট অর্ডার সংখ্যা</span>
                <p className="text-2xl font-black text-brand-charcoal">{orderCount} টি</p>
                <p className="text-[10px] text-stone-400 font-light">স্টোরে মোট কেনাকাটার ফ্রিকোয়েন্সি</p>
              </div>

              {/* Total Spent Card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-sm space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">লাইফটাইম ভ্যালু (LTV)</span>
                <p className="text-2xl font-black text-brand-forest">৳{totalLifetimeSpent.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-stone-400 font-light">সর্বমোট সফল অর্ডারের মূল্যের যোগফল</p>
              </div>

              {/* Average Order Value Card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-sm space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">গড় অর্ডার মূল্য (AOV)</span>
                <p className="text-2xl font-black text-brand-charcoal">৳{averageOrderValue.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-stone-400 font-light">প্রতি অর্ডারে গ্রাহকের গড় খরচের বাজেট</p>
              </div>
            </div>

            {/* Registered Shipping Addresses */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-brand-beige-dark pb-2">নিবন্ধিত শিপিং ঠিকানা সমূহ (Shipping Addresses)</h3>
              {customer.shippingAddresses && customer.shippingAddresses.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {customer.shippingAddresses.map((addr, index) => (
                    <li key={index} className="bg-brand-beige p-3 rounded-lg border border-brand-beige-dark flex gap-3 items-center">
                      <span className="text-lg">📍</span>
                      <span className="font-semibold text-brand-charcoal">{addr}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400 font-light">কোনো শিপিং ঠিকানা এখনো নিবন্ধিত করা হয়নি।</p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Complete Order History */}
        <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">গ্রাহকের অর্ডার হিস্ট্রি (Order History)</h3>
          
          {customerOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-beige-dark">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">অর্ডার আইডি</th>
                    <th className="py-2.5 px-3">তারিখ</th>
                    <th className="py-2.5 px-3">শিপিং ঠিকানা</th>
                    <th className="py-2.5 px-3">পণ্যের তালিকা</th>
                    <th className="py-2.5 px-3 text-right">বিল পরিমাণ</th>
                    <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                    <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige-dark text-xs text-brand-charcoal">
                  {customerOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-beige/10">
                      <td className="py-3 px-3 font-bold font-mono text-brand-forest">{order.id}</td>
                      <td className="py-3 px-3 text-stone-400 font-light">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-3 px-3 text-stone-500 truncate max-w-[180px]">{order.customerAddress}</td>
                      <td className="py-3 px-3 text-stone-500">
                        <div className="flex flex-col gap-0.5">
                          {order.items.map((item, idx) => (
                            <span key={idx}>
                              {item.name} <strong className="text-brand-charcoal">({item.quantity}x)</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold">
                        ৳{order.grandTotal.toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-brand-forest/10 border-brand-forest/20 text-brand-forest"
                              : order.status === "Shipped"
                              ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Link
                          href="/admin?tab=orders"
                          className="text-[11px] font-semibold text-brand-forest hover:underline"
                        >
                          বিস্তারিত দেখুন →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-xs">
              <span className="text-3xl block mb-2">🛒</span>
              এই কাস্টমারের কোনো অর্ডার অর্ডার ম্যানেজার তালিকায় নেই।
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
