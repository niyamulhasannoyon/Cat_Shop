"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Product, Order } from "@/types";

type TabType = "dashboard" | "products" | "orders" | "bundles";

export default function AdminDashboard() {
  const { products, orders, addProduct, deleteProduct, updateOrderStatus } = useShop();
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Add Product Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cats");
  const [newProdBrand, setNewProdBrand] = useState("Pawsome");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");

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
    });

    // Reset Form
    setNewProdName("");
    setNewProdPrice("");
    setNewProdCategory("cats");
    setNewProdBrand("Pawsome");
    setNewProdDesc("");
    setNewProdImage("");
    setShowAddForm(false);
    alert("🎉 নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!");
  };

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
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                {showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন +"}
              </button>
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
                        placeholder="যেমন: litter.png অথবা খালি রাখুন"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
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
                      <th className="py-4 px-6">পণ্যের বিবরণ</th>
                      <th className="py-4 px-6">আইডি</th>
                      <th className="py-4 px-6">ক্যাটাগরি</th>
                      <th className="py-4 px-6">ব্র্যান্ড</th>
                      <th className="py-4 px-6">মূল্য</th>
                      <th className="py-4 px-6 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                    {products.map((product) => {
                      const category = product.category || "cats";
                      const brand = product.brand || "Pawsome";
                      return (
                        <tr key={product.id} className="hover:bg-brand-beige/20 text-brand-charcoal">
                          <td className="py-4 px-6 font-semibold">{product.name}</td>
                          <td className="py-4 px-6 font-mono text-stone-400">{product.id}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-forest/5 text-brand-forest border border-brand-forest/10 font-medium">
                              {category === "cats" ? "🐱 বিড়াল" : category === "dogs" ? "🐶 কুকুর" : "🦜 পাখি"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-stone-500 font-medium">{brand}</td>
                          <td className="py-4 px-6 font-bold text-brand-forest">৳{product.price.toLocaleString("bn-BD")}</td>
                          <td className="py-4 px-6 text-right">
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
                        <th className="py-4 px-6">অর্ডার আইডি</th>
                        <th className="py-4 px-6">তারিখ</th>
                        <th className="py-4 px-6">ক্রেতার বিবরণ</th>
                        <th className="py-4 px-6">পণ্যের তালিকা (পরিমাণ)</th>
                        <th className="py-4 px-6">মোট বিল</th>
                        <th className="py-4 px-6">পেমেন্ট মেথড</th>
                        <th className="py-4 px-6 text-center">স্ট্যাটাস আপডেট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-beige/20 text-brand-charcoal items-start">
                          <td className="py-4 px-6 font-bold font-mono text-brand-forest">{order.id}</td>
                          <td className="py-4 px-6 text-stone-400 font-light">
                            {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                          </td>
                          <td className="py-4 px-6 space-y-1">
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-[10px] text-stone-500">{order.customerPhone}</p>
                            <p className="text-[10px] text-stone-400 font-light leading-relaxed max-w-[150px] break-words">{order.customerAddress}</p>
                          </td>
                          <td className="py-4 px-6">
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
                          <td className="py-4 px-6 font-bold text-brand-charcoal">
                            ৳{order.grandTotal.toLocaleString("bn-BD")}
                            <p className="text-[9px] text-stone-400 font-light mt-0.5">(ডেলিভারি: ৳{order.shippingFee})</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 text-[10px] rounded bg-stone-100 border border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                              {order.paymentMethod === "cod" ? "Cash (COD)" : "bKash/Nagad"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
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
                                  : "bg-stone-50 border-stone-200 text-stone-600"
                              }`}
                            >
                              <option value="Received">Received</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
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

      </main>

    </div>
  );
}
