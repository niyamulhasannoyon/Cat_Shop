"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function AdminSettingsPage() {
  const {
    shippingSettings,
    updateShippingSettings,
    refundLogs,
    siteSettings,
    updateSiteSettings,
    products,
    activeStaff
  } = useShop();

  if (activeStaff?.role !== "Super Admin") {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-4 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-brand-beige-dark shadow-sm space-y-4">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-black text-brand-charcoal">অ্যাক্সেস অস্বীকৃত (Access Denied)</h3>
          <p className="text-xs text-stone-500">এই পৃষ্ঠাটি দেখার জন্য আপনার পর্যাপ্ত অনুমতি নেই। শুধুমাত্র সুপার এডমিন এই পৃষ্ঠাটি অ্যাক্সেস করতে পারেন।</p>
          <Link
            href="/admin"
            className="inline-block bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-2.5 px-6 rounded-xl font-bold text-xs"
          >
            এডমিন ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState<"shipping" | "site" | "placements" | "refunds">("shipping");

  // Shipping Form States
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(shippingSettings.insideDhakaCharge.toString());
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(shippingSettings.outsideDhakaCharge.toString());
  const [subAreaCharge, setSubAreaCharge] = useState(shippingSettings.subAreaCharge.toString());
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingSettings.freeShippingThreshold.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Site Configurations Form States
  const [heroBannerUrl, setHeroBannerUrl] = useState(siteSettings?.heroBannerUrl || "");
  const [heroBannerTitle, setHeroBannerTitle] = useState(siteSettings?.heroBannerTitle || "");
  const [heroBannerSubtitle, setHeroBannerSubtitle] = useState(siteSettings?.heroBannerSubtitle || "");
  const [contactPhone, setContactPhone] = useState(siteSettings?.contactPhone || "");
  const [contactEmail, setContactEmail] = useState(siteSettings?.contactEmail || "");
  const [contactAddress, setContactAddress] = useState(siteSettings?.contactAddress || "");
  const [contactWhatsapp, setContactWhatsapp] = useState(siteSettings?.contactWhatsapp || "");
  const [socialFacebook, setSocialFacebook] = useState(siteSettings?.socialFacebook || "");
  const [socialInstagram, setSocialInstagram] = useState(siteSettings?.socialInstagram || "");
  const [seoHomeTitle, setSeoHomeTitle] = useState(siteSettings?.seoHomeTitle || "");
  const [seoHomeDescription, setSeoHomeDescription] = useState(siteSettings?.seoHomeDescription || "");
  const [seoProductsTitle, setSeoProductsTitle] = useState(siteSettings?.seoProductsTitle || "");
  const [seoProductsDescription, setSeoProductsDescription] = useState(siteSettings?.seoProductsDescription || "");

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const inside = Number(insideDhakaCharge);
    const outside = Number(outsideDhakaCharge);
    const sub = Number(subAreaCharge);
    const threshold = Number(freeShippingThreshold);

    if (isNaN(inside) || isNaN(outside) || isNaN(sub) || isNaN(threshold)) {
      alert("⚠️ দয়া করে সব ইনপুট কলামে সঠিক সংখ্যা লিখুন।");
      return;
    }

    updateShippingSettings({
      insideDhakaCharge: inside,
      outsideDhakaCharge: outside,
      subAreaCharge: sub,
      freeShippingThreshold: threshold
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      ...siteSettings,
      heroBannerUrl,
      heroBannerTitle,
      heroBannerSubtitle,
      contactPhone,
      contactEmail,
      contactAddress,
      contactWhatsapp,
      socialFacebook,
      socialInstagram,
      seoHomeTitle,
      seoHomeDescription,
      seoProductsTitle,
      seoProductsDescription
    });
    alert("✓ সাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!");
  };

  const toggleFeatured = (id: string) => {
    const current = siteSettings?.featuredProductIds || [];
    const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    updateSiteSettings({ ...siteSettings, featuredProductIds: updated });
  };

  const toggleTrending = (id: string) => {
    const current = siteSettings?.trendingProductIds || [];
    const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    updateSiteSettings({ ...siteSettings, trendingProductIds: updated });
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col font-sans text-brand-charcoal antialiased">
      
      {/* Tabs Navigation */}
      <section className="bg-white border-b border-brand-beige-dark px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <Link
            href="/admin?tab=dashboard"
            className="px-4 py-2 text-xs font-bold rounded-lg border bg-brand-charcoal border-brand-charcoal text-brand-beige hover:bg-brand-charcoal/90 transition-colors"
          >
            ← এডমিন ড্যাশবোর্ড
          </Link>
          {(["shipping", "site", "placements", "refunds"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                activeSubTab === tab
                  ? "bg-brand-forest border-brand-forest text-brand-beige"
                  : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
              }`}
            >
              {tab === "shipping" ? "🚚 শিপিং জোন সেটিংস" : tab === "site" ? "🖥️ সাইট কনফিগারেশন" : tab === "placements" ? "⭐ ফিচার্ড ও ট্রেন্ডিং শেলফ" : "💸 রিফান্ড লগ ও ট্র্যাকিং"}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {activeSubTab === "shipping" && (
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">ডেলিভারি এলাকা ও চার্জ সেটিংস</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">জোন অনুযায়ী কুরিয়ার ডেলিভারি ফি ও ফ্রি শিপিং থ্রেশহোল্ড আপডেট করুন</p>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-200 text-xs font-semibold animate-fadeIn">
                ✓ শিপিং সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!
              </div>
            )}

            <form onSubmit={handleSaveShipping} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="inside-charge" className="text-[11px] font-bold text-stone-500">ঢাকার ভেতরে ডেলিভারি চার্জ (৳)</label>
                <input
                  id="inside-charge"
                  type="number"
                  required
                  value={insideDhakaCharge}
                  onChange={(e) => setInsideDhakaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="outside-charge" className="text-[11px] font-bold text-stone-500">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
                <input
                  id="outside-charge"
                  type="number"
                  required
                  value={outsideDhakaCharge}
                  onChange={(e) => setOutsideDhakaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sub-charge" className="text-[11px] font-bold text-stone-500">সাব-এরিয়া ডেলিভারি চার্জ (৳)</label>
                <input
                  id="sub-charge"
                  type="number"
                  required
                  value={subAreaCharge}
                  onChange={(e) => setSubAreaCharge(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <div className="space-y-1 border-t border-dashed border-brand-beige-dark pt-3">
                <label htmlFor="free-threshold" className="text-[11px] font-bold text-stone-500">ফ্রি ডেলিভারি ক্যাপ / থ্রেশহোল্ড (৳)</label>
                <input
                  id="free-threshold"
                  type="number"
                  required
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                শিপিং চার্জ সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

        {activeSubTab === "site" && (
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">সাইট সেটিংস ও কন্টাক্ট কনফিগারেশন</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">কোড টাচ না করেই হোমপেজের হিরো ব্যানার, সোশ্যাল মিডিয়া এবং মেটা ট্যাগ এডিট করুন</p>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              
              {/* Hero Banner settings */}
              <div className="space-y-4 border-b border-brand-beige-dark pb-6">
                <h4 className="text-xs font-bold text-brand-forest uppercase tracking-wider">১. হোমপেজ হিরো ব্যানার</h4>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-500">হিরো ব্যানার ইমেজ ইউআরএল (Hero Banner Image URL)</label>
                  <input
                    type="text"
                    value={heroBannerUrl}
                    onChange={(e) => setHeroBannerUrl(e.target.value)}
                    placeholder="/hero.png"
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-500">হিরো ব্যানার শিরোনাম (Hero Title)</label>
                  <input
                    type="text"
                    value={heroBannerTitle}
                    onChange={(e) => setHeroBannerTitle(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-500">হিরো সাবটাইটেল (Hero Subtitle)</label>
                  <textarea
                    rows={3}
                    value={heroBannerSubtitle}
                    onChange={(e) => setHeroBannerSubtitle(e.target.value)}
                    className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 border-b border-brand-beige-dark pb-6">
                <h4 className="text-xs font-bold text-brand-forest uppercase tracking-wider">২. যোগাযোগের তথ্য ও সোশ্যাল লিংক</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">ফোন নম্বর (Contact Phone)</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">ইমেইল (Contact Email)</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">যোগাযোগের ঠিকানা (Address)</label>
                    <input
                      type="text"
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">হোয়াটসঅ্যাপ সাপোর্ট লিংক (WhatsApp Link)</label>
                    <input
                      type="text"
                      value={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.value)}
                      placeholder="https://wa.me/8801700000000"
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">ফেসবুক লিংক (Facebook)</label>
                    <input
                      type="text"
                      value={socialFacebook}
                      onChange={(e) => setSocialFacebook(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">ইনস্টাগ্রাম লিংক (Instagram)</label>
                    <input
                      type="text"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand-forest uppercase tracking-wider">৩. মেটা ট্যাগ ও এসইও কনফিগারেশন (SEO)</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">হোমপেজ টাইটেল (Home Meta Title)</label>
                    <input
                      type="text"
                      value={seoHomeTitle}
                      onChange={(e) => setSeoHomeTitle(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-500">হোমপেজ ডেসক্রিপশন (Home Meta Description)</label>
                    <textarea
                      rows={2}
                      value={seoHomeDescription}
                      onChange={(e) => setSeoHomeDescription(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                সাইট সেটিংস সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

        {activeSubTab === "placements" && (
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">ফিচার্ড ও ট্রেন্ডিং পণ্য নির্বাচন (Product shelves)</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">হোমপেজে কোন পণ্যগুলো ফিচার্ড আর ট্রেন্ডিং সেলফে যাবে তা এখান থেকে ওয়ান-ক্লিকে সিলেক্ট করুন</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-beige-dark text-xs font-semibold">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider bg-brand-beige/35">
                    <th className="py-3 px-4">পণ্য তথ্য (Product Details)</th>
                    <th className="py-3 px-4">ক্যাটেগরি</th>
                    <th className="py-3 px-4">মূল্য (Price)</th>
                    <th className="py-3 px-4 text-center">ফিচার্ড সেলফ (Featured Shelf)</th>
                    <th className="py-3 px-4 text-center">ট্রেন্ডিং সেলফ (Trending Shelf)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige-dark">
                  {products.map((p) => {
                    const isFeatured = siteSettings?.featuredProductIds?.includes(p.id) || false;
                    const isTrending = siteSettings?.trendingProductIds?.includes(p.id) || false;
                    return (
                      <tr key={p.id} className="hover:bg-brand-beige/10">
                        <td className="py-3.5 px-4 font-bold text-brand-charcoal">{p.name}</td>
                        <td className="py-3.5 px-4 text-stone-500 capitalize">{p.category}</td>
                        <td className="py-3.5 px-4 text-brand-forest">৳{p.price.toLocaleString("bn-BD")}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleFeatured(p.id)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isFeatured
                                ? "bg-amber-500 text-white"
                                : "bg-stone-100 text-stone-400 border border-stone-200"
                            }`}
                          >
                            {isFeatured ? "★ ফিচার্ড করা আছে" : "ফিচার্ড করুন"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleTrending(p.id)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isTrending
                                ? "bg-brand-forest text-brand-beige"
                                : "bg-stone-100 text-stone-400 border border-stone-200"
                            }`}
                          >
                            {isTrending ? "🔥 ট্রেন্ডিং করা আছে" : "ট্রেন্ডিং করুন"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === "refunds" && (
          <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-brand-beige-dark pb-3">
              <h3 className="text-sm font-bold text-brand-charcoal">রিফান্ড ইতিহাস ও লগ (Refund Audit History)</h3>
              <p className="text-[10px] text-stone-500 font-light mt-0.5">সফলভাবে প্রসেসকৃত ও প্রেরিত সকল রিফান্ড লগের বিবরণী</p>
            </div>

            {refundLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-beige-dark text-xs text-brand-charcoal">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider bg-brand-beige/35">
                      <th className="py-3 px-4">রিফান্ড আইডি</th>
                      <th className="py-3 px-4">অর্ডার নং</th>
                      <th className="py-3 px-4">গ্রাহক</th>
                      <th className="py-3 px-4">রিফান্ড পরিমাণ</th>
                      <th className="py-3 px-4">পদ্ধতি</th>
                      <th className="py-3 px-4">কারণ (Reason)</th>
                      <th className="py-3 px-4">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark">
                    {refundLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-beige/10 font-medium">
                        <td className="py-3.5 px-4 font-bold text-stone-500">{log.id}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-500">{log.orderId}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold">{log.customerName}</p>
                          <p className="text-[9px] text-stone-400 font-light">{log.customerPhone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-red-650 font-bold">৳{log.refundAmount.toLocaleString("bn-BD")}</td>
                        <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-stone-500">{log.refundMethod}</td>
                        <td className="py-3.5 px-4 text-stone-400 font-light max-w-[200px] truncate" title={log.refundReason}>
                          {log.refundReason}
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 font-light whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString("bn-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-brand-beige/15 rounded-xl border border-brand-beige-dark border-dashed">
                <p className="text-stone-400 text-xs">কোনো রিফান্ড ট্র্যাকিং রেকর্ড পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
