"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Product, Order } from "@/types";

type TabType = "dashboard" | "products" | "orders" | "bundles" | "audit_logs";

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus,
    stockLogs,
    updateStock,
    bulkUpdateStock
  } = useShop();
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Stock inventory states
  const [restockInputs, setRestockInputs] = useState<{ [key: string]: string }>({});
  
  // Add Product Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cats");
  const [newProdBrand, setNewProdBrand] = useState("Pawsome");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  
  // Inventory form states
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdThreshold, setNewProdThreshold] = useState("5");
  const [variantInputs, setVariantInputs] = useState<Array<{ size: string; color: string; stock: number }>>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as TabType;
      if (tab && ["dashboard", "products", "orders", "bundles", "audit_logs"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);



  // Business Analytics Calculations
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.grandTotal, 0);
  const avgBasketSize = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  
  const totalItemsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!newProdName.trim()) {
      setFormError("পণ্যের নাম আবশ্যিক।");
      return;
    }
    const priceNum = Number(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("দয়া করে সঠিক মূল্য নির্ধারণ করুন।");
      return;
    }

    addProduct({
      name: newProdName.trim(),
      price: priceNum,
      category: newProdCategory,
      brand: newProdBrand,
      description: newProdDesc.trim(),
      imageUrl: newProdImage.trim() || undefined,
      stock: Number(newProdStock),
      lowStockThreshold: Number(newProdThreshold),
      variants: variantInputs.length > 0
        ? variantInputs.map((v, idx) => ({ id: `var-${Date.now()}-${idx}`, ...v }))
        : undefined
    });

    // Reset Form
    setNewProdName("");
    setNewProdPrice("");
    setNewProdCategory("cats");
    setNewProdBrand("Pawsome");
    setNewProdDesc("");
    setNewProdImage("");
    setNewProdStock("10");
    setNewProdThreshold("5");
    setVariantInputs([]);
    setShowAddForm(false);
    alert("🎉 নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!");
  };

  // CSV Bulk Upload Handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = bulkUpdateStock(text);
      alert(res.message);
    };
    reader.readAsText(file);
  };

  const lowStockItems = useMemo(() => {
    const list: Array<{
      productId: string;
      productName: string;
      variantId?: string;
      variantDetails?: string;
      stock: number;
      threshold: number;
    }> = [];

    products.forEach((prod) => {
      const threshold = prod.lowStockThreshold || 5;
      if (prod.variants && prod.variants.length > 0) {
        prod.variants.forEach((v) => {
          if (v.stock <= threshold) {
            list.push({
              productId: prod.id,
              productName: prod.name,
              variantId: v.id,
              variantDetails: `Size: ${v.size || ""}, Color: ${v.color || ""}`,
              stock: v.stock,
              threshold,
            });
          }
        });
      } else {
        if (prod.stock <= threshold) {
          list.push({
            productId: prod.id,
            productName: prod.name,
            stock: prod.stock,
            threshold,
          });
        }
      }
    });

    return list;
  }, [products]);

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal antialiased">
      
      {/* Admin Panel Header Banner */}
      <header className="bg-brand-charcoal text-brand-beige py-6 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Paws&Co. এডমিন কন্ট্রোল প্যানেল</h1>
            </div>
            <p className="text-xs text-stone-400 font-light">স্টোরের পণ্য, কাস্টমার অর্ডার এবং ড্যাশবোর্ড অ্যানালিটিক্স পরিচালনা করুন</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-brand-beige-dark px-4 py-2 rounded-full border border-stone-600 transition-colors"
            >
              লাইভ শপে যান ↗
            </a>
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" title="System Online" />
            <span className="text-xs text-stone-400 font-medium">সিস্টেম অনলাইন</span>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <section className="bg-white border-b border-brand-beige-dark py-1.5 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none" aria-label="Tabs">
            {[
              { id: "dashboard", label: "📊 ড্যাশবোর্ড", desc: "স্টোর অ্যানালিটিক্স" },
              { id: "products", label: "📦 পণ্য CRUD", desc: "পণ্য তালিকা ও সংযোজন" },
              { id: "orders", label: "📋 অর্ডার ম্যানেজার", desc: "গ্রাহক অর্ডার ও স্ট্যাটাস" },
              { id: "bundles", label: "🏷️ বান্ডেল অফার", desc: "সক্রিয় কম্বো সমূহ" },
              { id: "audit_logs", label: "🪵 স্টক লগস", desc: "স্টক অডিট হিস্ট্রি" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-forest text-brand-beige shadow-sm"
                    : "text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link
              href="/admin/customers"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50 text-center flex items-center gap-1.5 cursor-pointer"
            >
              👥 গ্রাহক তালিকা
            </Link>
            <Link
              href="/admin/coupons"
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 text-stone-500 hover:text-brand-charcoal hover:bg-brand-beige/50 text-center flex items-center gap-1.5 cursor-pointer"
            >
              🏷️ কুপন ও প্রোমো
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: DASHBOARD ANALYTICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Sales card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">মোট বিক্রয়</span>
                  <p className="text-2xl font-black text-brand-forest">৳{totalSales.toLocaleString("bn-BD")}</p>
                  <p className="text-[10px] text-stone-400 font-light">সব সফল অর্ডারের যোগফল</p>
                </div>
                <div className="p-3 bg-brand-forest/5 text-brand-forest rounded-2xl border border-brand-forest/10 text-xl font-bold">
                  ৳
                </div>
              </div>

              {/* Orders card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">মোট অর্ডার</span>
                  <p className="text-2xl font-black text-brand-charcoal">{totalOrders} টি</p>
                  <p className="text-[10px] text-stone-400 font-light">ইন-অ্যাপ ও সিওডি বুকিং</p>
                </div>
                <div className="p-3 bg-stone-100 text-brand-charcoal rounded-2xl border border-stone-200 text-xl font-bold">
                  📋
                </div>
              </div>

              {/* Basket Size card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">গড় অর্ডার মূল্য</span>
                  <p className="text-2xl font-black text-brand-charcoal">৳{avgBasketSize.toLocaleString("bn-BD")}</p>
                  <p className="text-[10px] text-stone-400 font-light">প্রতি গ্রাহকের গড় খরচ</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-xl font-bold">
                  ⚖️
                </div>
              </div>

              {/* Items sold card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">বিক্রীত আইটেম</span>
                  <p className="text-2xl font-black text-brand-forest">{totalItemsSold} টি</p>
                  <p className="text-[10px] text-stone-400 font-light">পরিমাণ অনুযায়ী গণনা</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xl font-bold">
                  📦
                </div>
              </div>

            </div>

            {/* Sub details charts & timeline mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-1 space-y-6">
                <h3 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">অর্ডার স্ট্যাটাস রিপোর্ট</h3>
                
                {(() => {
                  const getCount = (status: Order["status"]) => orders.filter((o) => o.status === status).length;
                  const received = getCount("Received");
                  const processing = getCount("Processing");
                  const shipped = getCount("Shipped");
                  const delivered = getCount("Delivered");

                  const getPercentage = (count: number) => (totalOrders > 0 ? (count / totalOrders) * 100 : 0);

                  return (
                    <div className="space-y-4 text-xs font-semibold text-brand-charcoal">
                      {/* Received */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Received ({received}টি)</span>
                          <span>{Math.round(getPercentage(received))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-stone-500 h-2.5 rounded-full" style={{ width: `${getPercentage(received)}%` }} />
                        </div>
                      </div>

                      {/* Processing */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Processing ({processing}টি)</span>
                          <span>{Math.round(getPercentage(processing))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${getPercentage(processing)}%` }} />
                        </div>
                      </div>

                      {/* Shipped */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Shipped ({shipped}টি)</span>
                          <span>{Math.round(getPercentage(shipped))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${getPercentage(shipped)}%` }} />
                        </div>
                      </div>

                      {/* Delivered */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Delivered ({delivered}টি)</span>
                          <span>{Math.round(getPercentage(delivered))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-brand-forest h-2.5 rounded-full" style={{ width: `${getPercentage(delivered)}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Recent Activities Timeline */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">সাম্প্রতিক কার্যক্রম</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-[11px] font-semibold text-brand-forest hover:underline cursor-pointer">
                    সব অর্ডার দেখুন →
                  </button>
                </div>

                <div className="flow-root">
                  <ul className="-mb-8">
                    {orders.slice(0, 4).map((order, idx) => (
                      <li key={order.id}>
                        <div className="relative pb-8">
                          {idx !== orders.slice(0, 4).length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-brand-beige-dark" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3 items-start">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white text-xs ${
                                order.status === "Delivered" 
                                  ? "bg-brand-forest/10 text-brand-forest border border-brand-forest/20" 
                                  : order.status === "Shipped" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}>
                                📦
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-xs font-semibold text-brand-charcoal">
                                  নতুন অর্ডার {order.id} তৈরি হয়েছে -{" "}
                                  <span className="font-normal text-stone-500">{order.customerName} (৳{order.grandTotal})</span>
                                </p>
                              </div>
                              <div className="text-right text-[10px] whitespace-nowrap text-stone-400 font-light">
                                {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Low Stock Alert Widget */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
              <div className="border-b border-brand-beige-dark pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-650 flex items-center gap-1.5">
                  ⚠️ স্টক সতর্কতা (Low Stock Alerts)
                </h3>
                <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {lowStockItems.length}টি পণ্য রি-স্টক করা প্রয়োজন
                </span>
              </div>
              
              {lowStockItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                    <thead>
                      <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        <th className="py-2 px-3">পণ্য</th>
                        <th className="py-2 px-3">ভ্যারিয়েন্ট</th>
                        <th className="py-2 px-3 text-center">বর্তমান স্টক</th>
                        <th className="py-2 px-3 text-center">কম স্টক এলার্ট লিমিট</th>
                        <th className="py-2 px-3 text-center">রি-স্টক পরিমাণ</th>
                        <th className="py-2 px-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark text-brand-charcoal">
                      {lowStockItems.map((item) => {
                        const inputKey = `${item.productId}-${item.variantId || "general"}`;
                        return (
                          <tr key={inputKey} className="hover:bg-red-50/10">
                            <td className="py-3 px-3 font-semibold">{item.productName}</td>
                            <td className="py-3 px-3 text-stone-500">{item.variantDetails || "—"}</td>
                            <td className="py-3 px-3 text-center font-bold text-red-600">{item.stock} টি</td>
                            <td className="py-3 px-3 text-center text-stone-400 font-light">{item.threshold} টি</td>
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="number"
                                placeholder="যেমন: ১০"
                                value={restockInputs[inputKey] || ""}
                                onChange={(e) =>
                                  setRestockInputs((prev) => ({
                                    ...prev,
                                    [inputKey]: e.target.value,
                                  }))
                                }
                                className="w-20 text-center bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-1 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
                              />
                            </td>
                            <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  const qty = parseInt(restockInputs[inputKey], 10);
                                  if (isNaN(qty) || qty <= 0) {
                                    alert("দয়া করে সঠিক রি-স্টক পরিমাণ লিখুন।");
                                    return;
                                  }
                                  updateStock(item.productId, item.variantId || null, item.stock + qty, "restock", "admin");
                                  setRestockInputs((prev) => ({ ...prev, [inputKey]: "" }));
                                  alert(`🎉 স্টক সফলভাবে আপডেট করা হয়েছে!`);
                                }}
                                className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                              >
                                স্টক যোগ করুন
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-stone-400 text-xs">
                  ✓ সকল পণ্য পর্যাপ্ত পরিমাণে স্টকে রয়েছে!
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-brand-beige-dark pb-4">
              <div>
                <h3 className="text-base font-bold text-brand-charcoal">পণ্য তালিকা পরিচালনা</h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">স্টোরে প্রোডাক্ট সংযোজন এবং অপসারণ করুন</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Bulk CSV upload */}
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="bulk-csv-upload"
                  />
                  <label
                    htmlFor="bulk-csv-upload"
                    className="bg-white border border-brand-beige-dark hover:bg-brand-beige text-brand-charcoal px-4 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    📥 বাল্ক আপডেট (CSV)
                  </label>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন +"}
                </button>
              </div>
            </div>

            {/* Add Product Modal Form */}
            {showAddForm && (
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-md max-w-2xl animate-slideDown">
                <h4 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-2 mb-4">পণ্য সংযোজন ফর্ম</h4>
                
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs font-semibold mb-4">
                    ⚠️ {formError}
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <label htmlFor="prod-name" className="text-[11px] font-bold text-stone-500">পণ্যের নাম <span className="text-red-500">*</span></label>
                      <input
                        id="prod-name"
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="যেমন: প্রিমিয়াম সিলিকা ক্যাট লিটার"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-price" className="text-[11px] font-bold text-stone-500">মূল্য (৳) <span className="text-red-500">*</span></label>
                      <input
                        id="prod-price"
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="যেমন: ৮৫০"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-cat" className="text-[11px] font-bold text-stone-500">পোষা প্রাণীর ধরন</label>
                      <select
                        id="prod-cat"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      >
                        <option value="cats">বিড়াল (Cats)</option>
                        <option value="dogs">কুকুর (Dogs)</option>
                        <option value="birds">পাখি ও অন্যান্য</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-brand" className="text-[11px] font-bold text-stone-500">ব্র্যান্ড</label>
                      <select
                        id="prod-brand"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      >
                        <option value="Pawsome">Pawsome</option>
                        <option value="MeowMix">MeowMix</option>
                        <option value="DoggyStyles">DoggyStyles</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="prod-image" className="text-[11px] font-bold text-stone-500">প্রোডাক্ট ইমেজ ফাইল নেম (public/ ফোল্ডারে থাকতে হবে)</label>
                      <input
                        id="prod-image"
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="যেমন: litter.png अथवा খালি রাখুন"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                      <div className="space-y-1">
                        <label htmlFor="prod-stock" className="text-[11px] font-bold text-stone-500">স্টক পরিমাণ (Stock) <span className="text-red-500">*</span></label>
                        <input
                          id="prod-stock"
                          type="number"
                          required
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          placeholder="যেমন: ১০"
                          className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="prod-threshold" className="text-[11px] font-bold text-stone-500">কম স্টক সতর্কীকরণ লিমিট <span className="text-red-500">*</span></label>
                        <input
                          id="prod-threshold"
                          type="number"
                          required
                          value={newProdThreshold}
                          onChange={(e) => setNewProdThreshold(e.target.value)}
                          placeholder="যেমন: ৫"
                          className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                        />
                      </div>
                    </div>

                    {/* Variant additions section */}
                    <div className="sm:col-span-2 space-y-2 border border-dashed border-brand-beige-dark p-4 rounded-xl bg-brand-beige/25">
                      <div className="flex justify-between items-center pb-2 border-b border-brand-beige-dark">
                        <span className="text-[11px] font-bold text-brand-charcoal">পণ্যের ভ্যারিয়েন্ট সমূহ (ঐচ্ছিক)</span>
                        <button
                          type="button"
                          onClick={() => setVariantInputs((prev) => [...prev, { size: "", color: "", stock: 0 }])}
                          className="text-[10px] font-bold text-brand-forest hover:underline cursor-pointer"
                        >
                          + ভ্যারিয়েন্ট যোগ করুন
                        </button>
                      </div>
                      
                      {variantInputs.map((vInput, idx) => (
                        <div key={idx} className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            placeholder="সাইজ (M, L)"
                            value={vInput.size}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].size = e.target.value;
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="রঙ (Red, Green)"
                            value={vInput.color}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].color = e.target.value;
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="স্টক"
                            value={vInput.stock || ""}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].stock = Number(e.target.value);
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setVariantInputs((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-[10px] text-red-650 hover:underline cursor-pointer col-span-3 sm:col-span-1 text-right sm:text-center text-red-600"
                          >
                            মুছুন ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="prod-desc" className="text-[11px] font-bold text-stone-500">পণ্যের বিবরণ (Description)</label>
                      <textarea
                        id="prod-desc"
                        rows={2}
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal px-6 py-2.5 rounded-full text-xs font-semibold border border-brand-beige-dark transition-colors cursor-pointer"
                    >
                      বাতিল করুন
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Listing Table */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-beige-dark">
                  <thead className="bg-brand-beige">
                    <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-3 sm:py-4 sm:px-6">পণ্যের বিবরণ</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">আইডি</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">ক্যাটাগরি</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">ব্র্যান্ড</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 text-center">স্টক পরিমাণ</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">মূল্য</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                    {products.map((product) => {
                      const category = product.category || "cats";
                      const brand = product.brand || "Pawsome";
                      return (
                        <tr key={product.id} className="hover:bg-brand-beige/20 text-brand-charcoal">
                          <td className="py-3 px-3 sm:py-4 sm:px-6 space-y-1.5">
                            <span className="font-semibold">{product.name}</span>
                            {product.variants && product.variants.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 text-[9px] text-stone-500 font-medium mt-1">
                                {product.variants.map((v) => (
                                  <span key={v.id} className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded">
                                    {v.size ? `Size: ${v.size}` : ""} {v.color ? `Color: ${v.color}` : ""} ({v.stock}টি)
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-mono text-stone-400">{product.id}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-forest/5 text-brand-forest border border-brand-forest/10 font-medium">
                              {category === "cats" ? "🐱 বিড়াল" : category === "dogs" ? "🐶 কুকুর" : "🦜 পাখি"}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-stone-500 font-medium">{brand}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-center">
                            {product.stock <= 0 ? (
                              <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200 uppercase tracking-wider text-[10px]">
                                স্টক আউট
                              </span>
                            ) : product.stock <= (product.lowStockThreshold || 5) ? (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-250 text-[10px] animate-pulse">
                                {product.stock} টি বাকি ⚠️
                              </span>
                            ) : (
                              <span className="font-semibold text-brand-charcoal">
                                {product.stock} টি
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-brand-forest">৳{product.price.toLocaleString("bn-BD")}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি সত্যিই "${product.name}" মুছতে চান?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="text-stone-400 hover:text-red-700 hover:bg-stone-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div>
              <h3 className="text-base font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">গ্রাহক অর্ডারসমূহ</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">সবগুলো অর্ডার স্ট্যাটাস এবং বিবরণ ট্র্যাক ও আপডেট করুন</p>
            </div>

            {orders.length > 0 ? (
              <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-beige-dark">
                    <thead className="bg-brand-beige">
                      <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        <th className="py-3 px-3 sm:py-4 sm:px-6">অর্ডার আইডি</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">তারিখ</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">ক্রেতার বিবরণ</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">পণ্যের তালিকা (পরিমাণ)</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">মোট বিল</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">পেমেন্ট মেথড</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6 text-center">স্ট্যাটাস আপডেট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-beige/20 text-brand-charcoal items-start">
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold font-mono text-brand-forest">{order.id}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-stone-400 font-light">
                            {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 space-y-1">
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-[10px] text-stone-500">{order.customerPhone}</p>
                            <p className="text-[10px] text-stone-400 font-light leading-relaxed max-w-[150px] break-words">{order.customerAddress}</p>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <ul className="space-y-1 text-stone-600">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                  <span className="text-[10px]">📦</span>
                                  <span className="truncate max-w-[150px]">{item.name}</span>
                                  <span className="font-semibold text-brand-charcoal text-[11px]">({item.quantity}x)</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-brand-charcoal">
                            ৳{order.grandTotal.toLocaleString("bn-BD")}
                            <p className="text-[9px] text-stone-400 font-light mt-0.5">(ডেলিভারি: ৳{order.shippingFee})</p>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <span className="px-2 py-0.5 text-[10px] rounded bg-stone-100 border border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                              {order.paymentMethod === "cod" ? "Cash (COD)" : "bKash/Nagad"}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                              className={`text-xs font-semibold rounded-lg p-2 border focus:outline-none focus:ring-1 focus:ring-brand-forest cursor-pointer transition-all ${
                                order.status === "Delivered"
                                  ? "bg-brand-forest/10 border-brand-forest/25 text-brand-forest"
                                  : order.status === "Shipped"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : order.status === "Processing"
                                  ? "bg-amber-50 border-amber-200 text-amber-700"
                                  : order.status === "Cancelled"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-stone-50 border-stone-200 text-stone-600"
                              }`}
                            >
                              <option value="Received">Received</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-brand-beige-dark shadow-sm space-y-3">
                <span className="text-5xl block">🛒</span>
                <h4 className="text-base font-semibold text-brand-charcoal">কোনো অর্ডার এখনো পাওয়া যায়নি!</h4>
                <p className="text-xs text-stone-400 font-light max-w-sm mx-auto">
                  ক্রেতারা যখনই লাইভ শপে অর্ডার প্লেস করবেন, তখনই সেগুলো স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হয়ে যাবে।
                </p>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: BUNDLES OVERVIEW */}
        {activeTab === "bundles" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-brand-beige-dark pb-4">
              <h3 className="text-base font-bold text-brand-charcoal">সক্রিয় বান্ডেল ও প্রমোশন সমূহ</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">কম্বো বান্ডেল ডিল এবং ডিসকাউন্ট ক্যাম্পেইন সমূহ ট্র্যাক করুন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Bundle 1 */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-brand-beige p-2 rounded-xl border border-brand-beige-dark">🐱</span>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal">ক্যাট স্টার্টার প্যাক (Starter Bundle)</h4>
                      <p className="text-[10px] text-stone-400 font-semibold tracking-wider">বিড়াল কম্বো অফার</p>
                    </div>
                  </div>
                  <span className="bg-brand-forest text-brand-beige px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ১৫% সাশ্রয়!
                  </span>
                </div>
                
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  নতুন বিড়ালের জন্য প্রয়োজনীয় গ্রুমিং ও হাইজিন সামগ্রীর প্রিমিয়াম বান্ডেল অফার।
                </p>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">বান্ডেলে থাকা আইটেমসমূহ:</h5>
                  <div className="space-y-1.5">
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">Premium Velvet Cat Collar</span>
                      <span className="font-bold text-brand-forest">৳১,২০০</span>
                    </div>
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">প্রিমিয়াম সিলিকা ক্যাট লিটার</span>
                      <span className="font-bold text-brand-forest">৳৮৫০</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[10px] text-stone-400 line-through">পূর্বমূল্য ৳২,০৫০</p>
                    <p className="text-base font-black text-brand-forest">বান্ডেল মূল্য ৳১,৮০০</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">ক্যাম্পেইন স্ট্যাটাস: <span className="text-emerald-700">সক্রিয়</span></span>
                </div>
              </div>

              {/* Bundle 2 */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-brand-beige p-2 rounded-xl border border-brand-beige-dark">🐶</span>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal">ডগ হাইজিন প্যাক (Hygiene Bundle)</h4>
                      <p className="text-[10px] text-stone-400 font-semibold tracking-wider">কুকুর কম্বো অফার</p>
                    </div>
                  </div>
                  <span className="bg-brand-forest text-brand-beige px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ৳২৫০ ছাড়!
                  </span>
                </div>
                
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  আপনার কুকুরের স্বাস্থ্যকর গ্রুমিং ও ডেন্টাল সুরক্ষার সেরা কম্বো প্যাক।
                </p>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">বান্ডেলে থাকা আইটেমসমূহ:</h5>
                  <div className="space-y-1.5">
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার</span>
                      <span className="font-bold text-brand-forest">৳৬৫০</span>
                    </div>
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">ডেন্টাল ডগ চিউ টয়</span>
                      <span className="font-bold text-brand-forest">৳৪০০</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[10px] text-stone-400 line-through">পূর্বমূল্য ৳১,০৫০</p>
                    <p className="text-base font-black text-brand-forest">বান্ডেল মূল্য ৳৮০০</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">ক্যাম্পেইন স্ট্যাটাস: <span className="text-emerald-700">সক্রিয়</span></span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit_logs" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-brand-beige-dark pb-4">
              <h3 className="text-base font-bold text-brand-charcoal">স্টক অডিট লগ হিস্ট্রি (Stock History Logs)</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">স্টোরে পণ্য ইনভেন্টরির পরিবর্তন ও স্টক হিস্ট্রি ট্র্যাক করুন</p>
            </div>

            <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                  <thead className="bg-brand-beige">
                    <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">তারিখ ও সময়</th>
                      <th className="py-3 px-4">পণ্যের বিবরণ</th>
                      <th className="py-3 px-4">ভ্যারিয়েন্ট</th>
                      <th className="py-3 px-4 text-center">পরিবর্তন</th>
                      <th className="py-3 px-4">অ্যাকশন টাইপ</th>
                      <th className="py-3 px-4">সম্পাদনকারী</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white">
                    {stockLogs && stockLogs.length > 0 ? (
                      stockLogs.map((log) => {
                        const isPositive = log.quantityChanged > 0;
                        return (
                          <tr key={log.id} className="hover:bg-brand-beige/25">
                            <td className="py-3 px-4 text-stone-400">
                              {new Date(log.createdAt).toLocaleString("bn-BD")}
                            </td>
                            <td className="py-3 px-4 font-semibold text-brand-charcoal">{log.productName}</td>
                            <td className="py-3 px-4 text-stone-500">{log.variantDetails || "—"}</td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  isPositive 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                    : "bg-red-50 text-red-700 border border-red-100"
                                }`}
                              >
                                {isPositive ? `+${log.quantityChanged}` : log.quantityChanged}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-[10px]">
                                {log.actionType === "restock" 
                                  ? "🟢 রি-স্টক (Restock)" 
                                  : log.actionType === "purchase" 
                                  ? "🔵 ক্রয় (Purchase)" 
                                  : log.actionType === "cancel_return" 
                                  ? "🟡 ফেরত (Cancel Return)" 
                                  : "🟠 সমন্বয় (Adjust)"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-stone-600 font-mono text-[11px]">{log.updatedBy}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          কোনো স্টক লগ হিস্ট্রি পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
