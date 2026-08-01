"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";

export default function AdminSettingsManager() {
  const { shippingSettings, updateShippingSettings, siteSettings, updateSiteSettings } = useShop();

  const [insideDhaka, setInsideDhaka] = useState(shippingSettings.insideDhakaCharge.toString());
  const [outsideDhaka, setOutsideDhaka] = useState(shippingSettings.outsideDhakaCharge.toString());
  const [subArea, setSubArea] = useState(shippingSettings.subAreaCharge.toString());
  const [freeThreshold, setFreeThreshold] = useState(shippingSettings.freeShippingThreshold.toString());

  const [heroTitle, setHeroTitle] = useState(siteSettings.heroBannerTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(siteSettings.heroBannerSubtitle);
  const [phone, setPhone] = useState(siteSettings.contactPhone);

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingSettings({
      insideDhakaCharge: parseFloat(insideDhaka),
      outsideDhakaCharge: parseFloat(outsideDhaka),
      subAreaCharge: parseFloat(subArea),
      freeShippingThreshold: parseFloat(freeThreshold),
    });
    alert("ডেলিভারি চার্জ সফলভাবে আপডেট করা হয়েছে!");
  };

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      ...siteSettings,
      heroBannerTitle: heroTitle,
      heroBannerSubtitle: heroSubtitle,
      contactPhone: phone,
    });
    alert("সাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">সাইট সেটিংস (Settings & Delivery Charges)</h1>
        <p className="text-xs text-neutral-500 mt-1">ঢাকা ও ঢাকার বাইরের ডেলিভারি চার্জ এবং হেডার/ব্যানার কনফিগারেশন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Settings */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-neutral-900">ডেলিভারি চার্জ নির্ধারণ (BDT ৳)</h2>
          <form onSubmit={handleSaveShipping} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ঢাকার ভেতরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={insideDhaka}
                onChange={(e) => setInsideDhaka(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={outsideDhaka}
                onChange={(e) => setOutsideDhaka(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">সাব-এরিয়া চার্জ (৳)</label>
              <input
                type="number"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ফ্রি শিপিং থ্রেশহোল্ড (৳)</label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-forest text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              ডেলিভারি চার্জ সংরক্ষণ করুন
            </button>
          </form>
        </div>

        {/* Site Settings */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-neutral-900">হোমপেজ ব্যানার ও কন্টাক্ট ইনফো</h2>
          <form onSubmit={handleSaveSite} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">হিরো ব্যানার টাইটেল</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">হিরো ব্যানার সাব-টাইটেল</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">হটলাইন ফোন নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-forest text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              সাইট ব্র্যান্ডিং সংরক্ষণ করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
