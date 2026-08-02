"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/shop/ProductCard";
import Logo from "@/components/ui/Logo";

function HeroSlider() {
  const HERO_SLIDES = ["/hero.png", "/hero2.png", "/hero3.png"];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  return (
    <>
      {HERO_SLIDES.map((slide, idx) => (
        <Image
          key={slide}
          src={slide}
          alt={`Paws & Co. Premium Pet Lifestyle ${idx + 1}`}
          fill
          priority={idx === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 scale-[1.04] z-10" : "opacity-0 scale-100 z-0"
          }`}
        />
      ))}
    </>
  );
}

export default function Home() {
  const { products, siteSettings } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = products.filter((p) => siteSettings?.featuredProductIds?.includes(p.id));
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="bg-[#F4F1EA] flex-1 flex flex-col font-sans">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden py-14 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-forest/10 px-4 py-1.5 rounded-full text-brand-forest text-xs font-bold uppercase tracking-wider border border-brand-forest/20">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              বাংলাদেশে প্রথম প্রিমিয়াম পেট শপ
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-stone-900 leading-tight">
              {siteSettings?.heroBannerTitle || "আপনার পোষা প্রাণীর জন্য সেরা পেট এক্সেসরিজ"}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {siteSettings?.heroBannerSubtitle || "স্লিক ক্যাজুয়াল ডিজাইন, অর্গানিক ফুড ও ক্যাট লিটার সরাসরি বাসায় পৌঁছে যাবে।"}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto text-center bg-brand-forest hover:bg-brand-forest-light text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-brand-forest/20 active:scale-95"
              >
                শপিং শুরু করুন →
              </Link>
              <Link
                href="/bundles"
                className="w-full sm:w-auto text-center bg-stone-100 hover:bg-stone-200 text-stone-800 px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all border border-stone-200"
              >
                বান্ডেল অফার 🎉
              </Link>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100">
            {siteSettings?.heroBannerUrl && siteSettings.heroBannerUrl !== "/hero.png" ? (
              <Image
                src={siteSettings.heroBannerUrl}
                alt="Paws & Co. Hero Banner"
                fill
                priority
                className="object-cover"
              />
            ) : (
              <HeroSlider />
            )}
          </div>
        </div>
      </section>

      {/* 2. Trust & Value Badges Row */}
      <section className="py-8 bg-white/70 border-b border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200/60 shadow-xs hover:border-brand-forest/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center text-xl shrink-0">
              🚚
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">দ্রুত ডেলিভারি</h4>
              <p className="text-[11px] text-stone-500 font-medium">ঢাকার ভেতর ২৪ ঘণ্টায়</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200/60 shadow-xs hover:border-brand-forest/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0">
              💵
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[11px] text-stone-500 font-medium">পণ্য হাতে পেয়ে পেমেন্ট</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200/60 shadow-xs hover:border-brand-forest/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">১০০% অরিজিনাল</h4>
              <p className="text-[11px] text-stone-500 font-medium">সেফ ও প্রিমিয়াম আইটেম</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200/60 shadow-xs hover:border-brand-forest/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shrink-0">
              🔄
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">সহজ রিটার্ন পলিসি</h4>
              <p className="text-[11px] text-stone-500 font-medium">৩ দিনের ফাস্ট রিটার্ন</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Shop by Pet Categories */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-block bg-brand-forest/10 text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ক্যাটাগরি ব্রাউজ করুন
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Shop by Pet 🐾
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            আপনার পোষা প্রাণীর ধরন বেছে নিয়ে সেরা এক্সেসরিজটি অর্ডার করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Cats Category Card */}
          <Link href="/products?cat=cats" className="group">
            <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-50 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/60 text-stone-900 flex items-center justify-center text-3xl shadow-inner">
                  🐱
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 group-hover:text-brand-forest transition-colors">
                    বিড়াল (Cats)
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    ভেলভেট কলার, অ্যান্টি-অডোর সিলিকা লিটার, অর্গানিক ফুড ও ক্যাটনিপ স্প্রে
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:translate-x-1 transition-transform">
                <span>প্রোডাক্টসমূহ দেখুন</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Dogs Category Card */}
          <Link href="/products?cat=dogs" className="group">
            <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-50 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100/60 text-stone-900 flex items-center justify-center text-3xl shadow-inner">
                  🐶
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 group-hover:text-brand-forest transition-colors">
                    কুকুর (Dogs)
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    জেনুইন লেদার লিশ ও বেল্ট, সুদিং অর্গানিক শ্যাম্পু ও ডিউরেবল চিউ টয়
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:translate-x-1 transition-transform">
                <span>প্রোডাক্টসমূহ দেখুন</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Birds Category Card */}
          <Link href="/products?cat=birds" className="group">
            <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-100/60 text-stone-900 flex items-center justify-center text-3xl shadow-inner">
                  🦜
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 group-hover:text-brand-forest transition-colors">
                    পাখি ও অন্যান্য (Birds & Small Pets)
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    স্টেইনলেস স্টিল মেটাল খাঁচা, সিড মিক্স পাখির খাবার ও খেলার দোলনা
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:translate-x-1 transition-transform">
                <span>প্রোডাক্টসমূহ দেখুন</span>
                <span>→</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Popular Products Grid */}
      <section className="py-14 bg-white border-y border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                বেস্ট সেলার
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">পপুলার প্রোডাক্টসমূহ</h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">সবচেয়ে বেশি বিক্রিত ও পপুলার পেট এক্সেসরিজ</p>
            </div>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-forest-light bg-brand-forest/10 hover:bg-brand-forest/15 px-4 py-2.5 rounded-full transition-all border border-brand-forest/20 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>সব প্রোডাক্ট দেখুন</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Bundle Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-brand-forest p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="inline-block bg-brand-forest text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              বিশেষ ছাড় অফার 🎉
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              বান্ডেল প্যাক কিনুন ও ২০% পর্যন্ত বাঁচান!
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
              বিড়াল ও কুকুরের জন্য বিশেষ কম্বো প্যাক—ফুড, লিটার ও কলার একসাথে অর্ডার করে পান ফ্রি হোম ডেলিভারি।
            </p>
            <div className="pt-2">
              <Link
                href="/bundles"
                className="inline-block bg-white hover:bg-stone-100 text-stone-900 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
              >
                বান্ডেল অফার দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews & Social Proof */}
      <section className="py-14 bg-stone-50 border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span>⭐ ৪.৯/৫ কাস্টমার রেটিং</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              সন্তুষ্ট পোষ্য অভিভাবকদের মতামত 💬
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              আমাদের ৫০০+ হেপি কাস্টমার ও তাদের পোষা প্রাণীদের আসল অভিজ্ঞতা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ ভেরিফাইড বায়ার
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "প্রিমিয়াম ভেলভেট ক্যাট কলারটি হাতে পেয়ে খুবই খুশি! আমার বিড়ালের গলায় দেখতে দারুণ লাগছে এবং কোয়ালিটি সত্যিই ১০০% অরিজিনাল।"
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-forest/10 text-brand-forest font-bold flex items-center justify-center text-xs">
                  আ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">আরিফ রহমান</h4>
                  <p className="text-[10px] text-stone-400 font-medium">মিরপুর, ঢাকা</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ ভেরিফাইড বায়ার
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "সিলিকা ক্যাট লিটারটা অসাধারণ! গন্ধ একেবারেই থাকে না। ঢাকার ভেতরে মাত্র ২৪ ঘণ্টার মধ্যে ডেলিভারি পেয়ে গেছি।"
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                  স
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">সাদিয়া ইসলাম</h4>
                  <p className="text-[10px] text-stone-400 font-medium">গুলশান, ঢাকা</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ ভেরিফাইড বায়ার
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "লেদার ডগ লিশটা অনেক মজবুত ও টেকসই। কাস্টমার সাপোর্ট টিমও খুব হেল্পফুল ছিল। ধন্যবাদ Paws & Co.!"
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs">
                  ত
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">তাহমিদ হাসান</h4>
                  <p className="text-[10px] text-stone-400 font-medium">ধানমন্ডি, ঢাকা</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Pet Care Blog & Tips Section */}
      <section className="py-14 bg-white border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-block bg-brand-forest/10 text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                পেট কেয়ার টিপস
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">পোষ্য যত্ন সহায়িকা 📖</h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">বিড়াল ও কুকুরের সুস্বাস্থ্য বজায় রাখার দরকারী নিয়মাবলি</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Blog Card 1 */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/80 space-y-4 hover:shadow-md transition-all">
              <div className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                বিড়াল কেয়ার
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                শীতকালে বিড়ালের বাড়তি যত্ন নেওয়ার ৫টি দরকারি টিপস
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                শীতের দিনে বিড়ালের ঠাণ্ডা লাগা প্রতিরোধে সঠিক খাবার, গরম বিছানা ও পানির তাপমাত্রা কীভাবে বজায় রাখবেন জানুন।
              </p>
              <div className="pt-2 text-[11px] font-bold text-brand-forest">
                পড়ুন (৩ মি. রিড) →
              </div>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/80 space-y-4 hover:shadow-md transition-all">
              <div className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                লিটার গাইড
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                সঠিক ক্যাট লিটার বাছাই ও দুর্গন্ধমুক্ত রাখার সহজ উপায়
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                সিলিকা বনাম ক্লাম্পিং লিটার—কোনটি আপনার বিড়ালের জন্য ভালো এবং ঘরের দুর্গন্ধ কমানোর সেরা উপায়।
              </p>
              <div className="pt-2 text-[11px] font-bold text-brand-forest">
                পড়ুন (৪ মি. রিড) →
              </div>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/80 space-y-4 hover:shadow-md transition-all">
              <div className="inline-block bg-blue-100 text-blue-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                কুকুর কেয়ার
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                কুকুরের ত্বক ও কোটের জন্য অর্গানিক শ্যাম্পুর উপকারিতা
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                হাইপোঅ্যালার্জেনিক অর্গানিক শ্যাম্পু কীভাবে কুকুরের চুল পড়া কমায় এবং অ্যালার্জি মুক্ত সুস্থ ত্বক রাখে।
              </p>
              <div className="pt-2 text-[11px] font-bold text-brand-forest">
                পড়ুন (৩ মি. রিড) →
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. First-Order Discount Newsletter Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-brand-forest via-brand-forest-light to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6 relative overflow-hidden border border-brand-forest/30">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              🎁 বিশেষ সাবস্ক্রাইবার অফার
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              প্রথম অর্ডারে ১০% ডিসকাউন্ট পান!
            </h2>
            <p className="text-xs sm:text-sm text-brand-beige/90 font-medium leading-relaxed">
              ইমেইল সাবস্ক্রাইব করে পেয়ে যান প্রোমো কোড এবং আমাদের নতুন পেট প্রোডাক্ট আপডেট।
            </p>

            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-md text-white font-bold p-4 rounded-2xl border border-white/30 animate-in fade-in duration-300">
                🎉 ধন্যবাদ! আপনার ১০% ছাড়ের কুপন কোড: <span className="underline font-black text-amber-300">PAWS10</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                  className="flex-1 bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-sm px-4 py-3 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
                >
                  কুপন পান →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="w-full bg-[#111] text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800 text-xs">
          <div className="space-y-3">
            <Logo variant="dark" showSubtitle size="md" />
            <p className="leading-relaxed mt-2 text-neutral-400">পোষা প্রাণীদের জন্য স্টাইলিশ ও মানসম্মত এক্সেসরিজ সরবরাহ করতে আমরা প্রতিশ্রুতিবদ্ধ।</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-white">হোম</Link></li>
              <li><Link href="/products" className="hover:text-white">সকল পণ্য</Link></li>
              <li><Link href="/bundles" className="hover:text-white">বান্ডেল অফার</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">গ্রাহক সেবা</h4>
            <ul className="space-y-1.5">
              <li><Link href="/tracking" className="hover:text-white">অর্ডার ট্র্যাকিং</Link></li>
              <li><Link href="/cart" className="hover:text-white">শপিং কার্ট</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">যোগাযোগ</h4>
            <p>{siteSettings?.contactAddress || "গুলশান-১, ঢাকা, বাংলাদেশ"}</p>
            <p>ফোন: {siteSettings?.contactPhone || "01700-000000"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
