"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";

function TrackingPageContent() {
  const searchParams = useSearchParams();
  const { orders } = useShop();
  const trackingIdParam = searchParams.get("id") || "";

  const [inputCode, setInputCode] = useState<string>("");
  const [activeCode, setActiveCode] = useState<string>("");

  useEffect(() => {
    if (trackingIdParam) {
      setInputCode(trackingIdParam);
      setActiveCode(trackingIdParam);
    }
  }, [trackingIdParam]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim().toUpperCase());
    }
  };

  const foundOrder = orders.find(o => o.id.toUpperCase() === activeCode.toUpperCase());

  const statusSteps: Record<string, number> = {
    "Received": 1,
    "Processing": 2,
    "Shipped": 3,
    "Delivered": 4
  };
  const activeStep = foundOrder ? statusSteps[foundOrder.status] : 0;

  const whatsappMessage = `হ্যালো! আমার অর্ডার #${activeCode} এর লাইভ ডেলিভারি আপডেট সম্পর্কে জানতে চাচ্ছি।`;
  const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-brand-beige flex-1 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-forest/5 px-4 py-1.5 rounded-full text-brand-forest text-xs font-semibold uppercase tracking-wider">
            📦 ইন-অ্যাপ কুরিয়ার ট্র্যাকিং
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal">অর্ডার ট্র্যাক করুন</h1>
          <p className="text-sm text-stone-500 font-light max-w-sm mx-auto">
            আপনার অর্ডার কোডটি (উদাঃ ORD-1234) দিয়ে ডেলিভারির বর্তমান অবস্থা জানুন
          </p>
        </div>

        {/* Search Panel */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-brand-beige-dark shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="order-code-input" className="sr-only">অর্ডার কোড</label>
            <input
              id="order-code-input"
              type="text"
              required
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="অর্ডার কোড লিখুন (উদাঃ ORD-4592)"
              className="w-full bg-brand-beige border border-brand-beige-dark text-xs sm:text-sm rounded-full px-5 py-3.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors focus:outline-none"
          >
            সার্চ করুন
          </button>
        </form>

        {/* Tracking Details */}
        {activeCode ? (
          foundOrder ? (
            <div className="bg-white rounded-3xl border border-brand-beige-dark p-6 sm:p-8 space-y-8 shadow-sm">
              
              {/* Order meta summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-beige-dark pb-4">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">অর্ডার নম্বর</span>
                  <h2 className="text-sm sm:text-base font-bold text-brand-charcoal">{activeCode}</h2>
                  <p className="text-xs text-stone-500 mt-1">গ্রাহক: {foundOrder.customerName}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">কুরিয়ার পার্টনার</span>
                  <p className="text-xs font-semibold text-brand-forest">পাঠাও এক্সপ্রেস (Pathao)</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">মোট মূল্য: ৳{foundOrder.grandTotal.toLocaleString("bn-BD")}</p>
                </div>
              </div>

              {/* Stepper Status Indicators */}
              <div className="relative py-4 space-y-8">
                
                {/* Vertical line indicator */}
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-brand-beige-dark" />

                {/* Step 1: Received */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeStep >= 1 ? "bg-brand-forest text-brand-beige" : "bg-brand-beige-dark text-stone-400"
                  }`}>
                    {activeStep > 1 ? "✓" : "1"}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-semibold ${activeStep >= 1 ? "text-brand-charcoal" : "text-stone-400"}`}>
                      অর্ডার গ্রহণ করা হয়েছে (Received)
                    </h3>
                    <p className="text-[10px] text-stone-400 font-light">আমাদের সিস্টেম অর্ডারটি সফলভাবে সংগ্রহ করেছে।</p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeStep >= 2 ? "bg-brand-forest text-brand-beige" : activeStep === 1 ? "bg-white border-2 border-brand-forest text-brand-forest animate-pulse" : "bg-brand-beige-dark text-stone-400"
                  }`}>
                    {activeStep > 2 ? "✓" : "2"}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-semibold ${activeStep >= 2 ? "text-brand-charcoal" : activeStep === 1 ? "text-brand-forest" : "text-stone-400"}`}>
                      প্যাকেজিং সম্পন্ন (Processing)
                    </h3>
                    <p className="text-[10px] text-stone-400 font-light">প্রোডাক্টগুলো ভেরিফাই করে গুদামঘর থেকে পাঠানো হয়েছে।</p>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeStep >= 3 ? "bg-brand-forest text-brand-beige" : activeStep === 2 ? "bg-white border-2 border-brand-forest text-brand-forest animate-pulse" : "bg-brand-beige-dark text-stone-400"
                  }`}>
                    {activeStep > 3 ? "✓" : "🚚"}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-semibold ${activeStep >= 3 ? "text-brand-charcoal" : activeStep === 2 ? "text-brand-forest" : "text-stone-400"}`}>
                      কুরিয়ারে পাঠানো হয়েছে (Shipped)
                    </h3>
                    <p className="text-[10px] text-stone-400 font-light">পণ্যটি বর্তমানে আপনার ঠিকানার উদ্দেশ্যে ট্রানজিটে রয়েছে।</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeStep >= 4 ? "bg-brand-forest text-brand-beige" : activeStep === 3 ? "bg-white border-2 border-brand-forest text-brand-forest animate-pulse" : "bg-brand-beige-dark text-stone-400"
                  }`}>
                    {activeStep >= 4 ? "✓" : "4"}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-semibold ${activeStep >= 4 ? "text-brand-charcoal" : activeStep === 3 ? "text-brand-forest" : "text-stone-400"}`}>
                      ডেলিভারি সম্পন্ন (Delivered)
                    </h3>
                    <p className="text-[10px] text-stone-400 font-light">কুরিয়ার পার্টনার পণ্যটি সফলভাবে ক্রেতার কাছে হস্তান্তর করেছে।</p>
                  </div>
                </div>

              </div>

              {/* Estimated time & Help action */}
              <div className="bg-brand-beige rounded-2xl p-5 border border-brand-beige-dark space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-light">ডেলিভারির সম্ভাব্য সময়:</span>
                  <span className="font-semibold text-brand-charcoal">২৪ - ৪৮ ঘণ্টা (ঢাকার ভিতরে)</span>
                </div>
                <div className="border-t border-brand-beige-dark pt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-[10px] text-stone-500 font-light text-center sm:text-left">
                    ডেলিভারির বিষয়ে বিস্তারিত তথ্য জানতে সরাসরি আমাদের সাহায্যকারী এজেন্টের সাথে কথা বলুন।
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
                  >
                    সহায়তা এজেন্টের মেসেজ
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-brand-beige-dark p-10 text-center text-brand-charcoal space-y-4 shadow-sm">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-base font-semibold">অর্ডারটি খুঁজে পাওয়া যায়নি!</h3>
              <p className="text-xs text-stone-500 font-light max-w-xs mx-auto leading-relaxed">
                অনুগ্রহ করে আপনার অর্ডার আইডিটি (&quot;{activeCode}&quot;) আবার চেক করুন। এটি এখনো সিস্টেমে রেজিস্টার করা হয়নি অথবা ভুল টাইপ করা হয়েছে।
              </p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-brand-beige-dark shadow-sm text-stone-400 text-xs font-light">
            সার্চ বক্সে আপনার ট্র্যাকিং কোড টাইপ করে এন্টার চাপুন।
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="bg-brand-beige flex-1 flex items-center justify-center min-h-screen">
        <div className="text-brand-forest font-semibold text-sm">লোড হচ্ছে...</div>
      </div>
    }>
      <TrackingPageContent />
    </Suspense>
  );
}
