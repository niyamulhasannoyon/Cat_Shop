"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { addToCart, cartTotal } = useCart();
  const FREE_SHIPPING_THRESHOLD = 3000;
  const remainsForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  const handleAddCatLitter = () => {
    addToCart({
      id: "cat_litter_premium",
      name: "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)",
      price: 850,
    });
  };

  const handleAddDogLeash = () => {
    addToCart({
      id: "leather_dog_leash",
      name: "লেদার ডগ লিশ ও হারনেস বেল্ট",
      price: 1100,
    });
  };

  return (
    <div className="bg-brand-beige flex-1 flex flex-col font-sans">
      
      {/* 1. Hero / Premium Banner Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-brand-beige-dark bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-forest/5 px-4 py-1.5 rounded-full text-brand-forest text-xs font-semibold uppercase tracking-wider">
              ✨ বাংলাদেশে প্রথম প্রিমিয়াম পেট শপ
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-charcoal leading-tight">
              আপনার শখের পোষা প্রাণীর জন্য <br />
              <span className="text-brand-forest">সবচেয়ে সেরা এক্সেসরিজ</span>
            </h1>
            
            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              স্লিক, মিনিমালিস্ট ডিজাইন এবং প্রিমিয়াম কোয়ালিটির কলার, অর্গানিক ফুড এবং গ্রুমিং কিট সংগ্রহ করুন। ঢাকার ভেতরে ২৪ ঘণ্টা এবং বাইরে ৭২ ঘণ্টার মধ্যে দ্রুত ডেলিভারি।
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="#shop"
                className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-brand-forest"
              >
                শপিং শুরু করুন
              </a>
              <a
                href="#bundles"
                className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all border border-brand-beige-dark hover:border-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-charcoal"
              >
                বান্ডেল ও সেভ অফার
              </a>
            </div>
          </div>

          {/* Hero Right Interactive Dashboard (Visual Element) */}
          <div className="bg-brand-beige rounded-3xl p-8 border border-brand-beige-dark shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-brand-beige-dark pb-4">
              <h2 className="text-lg font-bold text-brand-charcoal">কার্ট থ্রেশহোল্ড সিমুলেটর</h2>
              <span className="text-xs bg-brand-forest text-brand-beige px-2.5 py-0.5 rounded-full font-medium">Interactive Demo</span>
            </div>
            
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              নিচের প্রোডাক্টগুলো যোগ করে দেখুন কিভাবে ঘোষণা বারটিতে থাকা <strong>ফ্রি ডেলিভারি ইন্ডিকেটর</strong> রিয়েল-টাইমে আপডেট হয়!
            </p>

            <div className="space-y-4">
              {/* Product Item 1 */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-brand-beige-dark hover:border-brand-forest/30 transition-all">
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal">প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)</h3>
                  <p className="text-xs text-stone-500 mt-1">৳৮৫০ • উচ্চ শোষণ ক্ষমতা সম্পন্ন</p>
                </div>
                <button
                  onClick={handleAddCatLitter}
                  className="bg-brand-forest text-brand-beige px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-forest-light transition-colors"
                >
                  যোগ করুন +
                </button>
              </div>

              {/* Product Item 2 */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-brand-beige-dark hover:border-brand-forest/30 transition-all">
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal">লেদার ডগ লিশ ও হারনেস বেল্ট</h3>
                  <p className="text-xs text-stone-500 mt-1">৳১,১০০ • শতভাগ আসল চামড়া</p>
                </div>
                <button
                  onClick={handleAddDogLeash}
                  className="bg-brand-forest text-brand-beige px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-forest-light transition-colors"
                >
                  যোগ করুন +
                </button>
              </div>
            </div>

            {/* Dynamic Card Progress inside Hero */}
            <div className="bg-white/80 p-4 rounded-xl border border-brand-beige-dark space-y-2.5">
              <div className="flex justify-between text-xs font-semibold text-brand-charcoal">
                <span>ডেলিভারি প্রগতি:</span>
                <span>৳{cartTotal.toLocaleString("bn-BD")} / ৳৩,০০০</span>
              </div>
              <div className="w-full bg-brand-beige-dark h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-forest h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 text-center font-light mt-1">
                {remainsForFreeShipping > 0 
                  ? `আর মাত্র ৳${remainsForFreeShipping.toLocaleString("bn-BD")} সমমূল্যের পণ্য কিনলে ফ্রি শিপিং পাবেন!` 
                  : "অভিনন্দন! আপনি ফ্রি ডেলিভারি কোটা অর্জন করেছেন।"}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Brand Value Props / Trust Indicators */}
      <section className="py-12 bg-brand-beige border-b border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Prop 1 */}
            <div className="flex items-start gap-4 p-4">
              <div className="p-3 bg-brand-forest/5 text-brand-forest rounded-2xl border border-brand-forest/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">নিরাপদ পেমেন্ট (SSLCommerz)</h3>
                <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">বিকাশ, রকেট, নগদ বা যেকোনো ডেবিট/ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট করুন নিরাপদে ও স্বাচ্ছন্দ্যে।</p>
              </div>
            </div>

            {/* Value Prop 2 */}
            <div className="flex items-start gap-4 p-4">
              <div className="p-3 bg-brand-forest/5 text-brand-forest rounded-2xl border border-brand-forest/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">দ্রুত ডেলিভারি ও অর্ডার ট্র্যাকিং</h3>
                <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">অর্ডার করার পর ইন-অ্যাপ ট্র্যাকিং কোড দিয়ে ট্র্যাক করুন আপনার প্রোডাক্টের লাইভ লোকেশন।</p>
              </div>
            </div>

            {/* Value Prop 3 */}
            <div className="flex items-start gap-4 p-4">
              <div className="p-3 bg-brand-forest/5 text-brand-forest rounded-2xl border border-brand-forest/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট</h3>
                <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">যেকোনো প্রশ্ন অথবা কাস্টমাইজেশন অর্ডারের জন্য সরাসরি আমাদের কাস্টমার এজেন্টের সাথে কথা বলুন।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop Categories & Promos */}
      <section id="shop" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-brand-charcoal">পোষা প্রাণীর ক্যাটাগরি</h2>
          <p className="text-sm text-stone-500 font-light">আপনার পোষা প্রাণীর ধরন অনুযায়ী প্রয়োজনীয় জিনিসপত্র খুঁজে নিন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Cat Card */}
          <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-beige-dark shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 bg-brand-beige flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl">🐱</span>
            </div>
            <div className="p-6 bg-white space-y-2 text-center border-t border-brand-beige-dark">
              <h3 className="text-lg font-bold text-brand-charcoal">বিড়াল (Cats)</h3>
              <p className="text-xs text-stone-500 font-light">ফুড বোল, বেল্ট, ক্যাট নিপ ও খেলনা সামগ্রী</p>
              <a href="/products?cat=cats" className="inline-block pt-2 text-xs font-semibold text-brand-forest hover:underline">ব্রাউজ করুন →</a>
            </div>
          </div>

          {/* Dog Card */}
          <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-beige-dark shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 bg-brand-beige flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl">🐶</span>
            </div>
            <div className="p-6 bg-white space-y-2 text-center border-t border-brand-beige-dark">
              <h3 className="text-lg font-bold text-brand-charcoal">কুকুর (Dogs)</h3>
              <p className="text-xs text-stone-500 font-light">আউটডোর লিশ, লেদার কলার ও প্রিমিয়াম খাবার</p>
              <a href="/products?cat=dogs" className="inline-block pt-2 text-xs font-semibold text-brand-forest hover:underline">ব্রাউজ করুন →</a>
            </div>
          </div>

          {/* Birds Card */}
          <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-beige-dark shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 bg-brand-beige flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl">🦜</span>
            </div>
            <div className="p-6 bg-white space-y-2 text-center border-t border-brand-beige-dark">
              <h3 className="text-lg font-bold text-brand-charcoal">পাখি ও অন্যান্য</h3>
              <p className="text-xs text-stone-500 font-light">খাঁচার সামগ্রী, ভিটামিন সাপ্লিমেন্ট ও সিড মিক্স</p>
              <a href="/products?cat=birds" className="inline-block pt-2 text-xs font-semibold text-brand-forest hover:underline">ব্রাউজ করুন →</a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Bundle & Save Promo */}
      <section id="bundles" className="bg-[#1E3F20] text-brand-beige py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-brand-beige-dark">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-brand-beige-dark text-xs font-semibold uppercase tracking-wider">
            🎉 স্পেশাল অফার
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            বান্ডেল অফারে পণ্য কিনে সাশ্রয় করুন ২৫% পর্যন্ত!
          </h2>
          <p className="text-sm sm:text-base text-brand-beige-dark max-w-2xl mx-auto font-light leading-relaxed">
            একটি ক্যাট ফুড ও একটি ক্যাট লিটার একসাথে কিনলে পাচ্ছেন ১৫% ডিসকাউন্ট এবং সাথে ফ্রি ডেন্টাল ট্রিট! কাস্টম বান্ডেল বানাতে সরাসরি আমাদের হেল্পলাইনে মেসেজ দিন।
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/8801700000000?text=Hi,%20I'm%20interested%20in%20custom%20bundles!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-brand-beige text-brand-forest px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all shadow-md focus:outline-none"
            >
              হোয়াটসঅ্যাপে বুক করুন
            </a>
          </div>
        </div>
      </section>

      {/* 5. Sleek Minimalist Footer Footer */}
      <footer className="w-full bg-[#1A1A1A] text-stone-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Paws&Co.</h3>
            <p className="text-xs font-light leading-relaxed">
              পোষা প্রাণীদের জন্য স্টাইলিশ ও মানসম্মত এক্সেসরিজ সরবরাহ করতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">ক্যাটাগরি</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="/products?cat=cats" className="hover:text-brand-beige transition-colors">বিড়ালের পণ্য</a></li>
              <li><a href="/products?cat=dogs" className="hover:text-brand-beige transition-colors">কুকুরের পণ্য</a></li>
              <li><a href="/products?cat=birds" className="hover:text-brand-beige transition-colors">পাখির পণ্য</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">গ্রাহক সেবা</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="/tracking" className="hover:text-brand-beige transition-colors">অর্ডার ট্র্যাকিং</a></li>
              <li><a href="/faq" className="hover:text-brand-beige transition-colors">জিজ্ঞাসাবাদ (FAQs)</a></li>
              <li><a href="https://wa.me/8801700000000" className="hover:text-brand-beige transition-colors">হোয়াটসঅ্যাপ সাপোর্ট</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">যোগাযোগ</h4>
            <p className="text-xs font-light leading-relaxed">
              গুলশান-২, ঢাকা, বাংলাদেশ<br />
              ইমেইল: support@pawsco.com.bd<br />
              ফোন: +৮৮০ ১৭০০০০০০০০
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-light gap-4">
          <p>© ২০২৬ Paws & Co. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</a>
            <a href="/terms" className="hover:text-white transition-colors">শর্তাবলী</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
