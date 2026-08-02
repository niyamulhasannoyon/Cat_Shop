"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/shop/ProductCard";

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

  const featuredProducts = products.filter((p) => siteSettings?.featuredProductIds?.includes(p.id));
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="bg-[#F0EDE6] flex-1 flex flex-col font-sans">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-forest/10 px-4 py-1.5 rounded-full text-brand-forest text-xs font-bold uppercase tracking-wider">
              ✨ বাংলাদেশে প্রথম প্রিমিয়াম পেট শপ
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-neutral-900 leading-tight">
              {siteSettings?.heroBannerTitle || "আপনার পোষা প্রাণীর জন্য সেরা পেট এক্সেসরিজ"}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {siteSettings?.heroBannerSubtitle || "স্লিক ক্যাজুয়াল ডিজাইন, অর্গানিক ফুড ও ক্যাট লিটার সরাসরি বাসায় পৌঁছে যাবে।"}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto text-center bg-brand-forest hover:bg-brand-forest/90 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md"
              >
                শপিং শুরু করুন →
              </Link>
              <Link
                href="/bundles"
                className="w-full sm:w-auto text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all"
              >
                বান্ডেল ও সেভ অফার
              </Link>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-neutral-100">
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

      {/* 2. Category Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">পশুপাখির ক্যাটাগরি বেছে নিন</h2>
          <p className="text-xs text-neutral-500 font-medium">বিড়াল, কুকুর ও পাখির উন্নত মানের এক্সেসরিজ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-4 hover:shadow-lg transition-all">
            <div className="text-4xl">🐱</div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">বিড়াল (Cats)</h3>
              <p className="text-xs text-neutral-500 mt-1">ভেলভেট কলার, সিলিকা লিটার ও অর্গানিক ফুড</p>
            </div>
            <Link href="/products?cat=cats" className="inline-block text-xs font-bold text-brand-forest hover:underline">
              ব্রাউজ করুন →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-4 hover:shadow-lg transition-all">
            <div className="text-4xl">🐶</div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">কুকুর (Dogs)</h3>
              <p className="text-xs text-neutral-500 mt-1">লেদার লিশ, শ্যাম্পু ও ডিউরেবল চিউ টয়</p>
            </div>
            <Link href="/products?cat=dogs" className="inline-block text-xs font-bold text-brand-forest hover:underline">
              ব্রাউজ করুন →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-4 hover:shadow-lg transition-all">
            <div className="text-4xl">🦜</div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">পাখি ও অন্যান্য (Birds)</h3>
              <p className="text-xs text-neutral-500 mt-1">স্টেইনলেস স্টিল খাঁচা ও ফুড ফিডার</p>
            </div>
            <Link href="/products?cat=birds" className="inline-block text-xs font-bold text-brand-forest hover:underline">
              ব্রাউজ করুন →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-12 bg-white border-y border-neutral-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">পপুলার প্রোডাক্টসমূহ</h2>
              <p className="text-xs text-neutral-500 font-medium">সবচেয়ে বেশি বিক্রিত এক্সেসরিজ</p>
            </div>
            <Link href="/products" className="text-xs font-bold text-brand-forest hover:underline">
              সব দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="w-full bg-[#111] text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800 text-xs">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white">Paws & Co.</h3>
            <p className="leading-relaxed">পোষা প্রাণীদের জন্য স্টাইলিশ ও মানসম্মত এক্সেসরিজ সরবরাহ করতে আমরা প্রতিশ্রুতিবদ্ধ।</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">ক্যাটাগরি</h4>
            <ul className="space-y-1.5">
              <li><Link href="/products?cat=cats" className="hover:text-white">বিড়ালের পণ্য</Link></li>
              <li><Link href="/products?cat=dogs" className="hover:text-white">কুকুরের পণ্য</Link></li>
              <li><Link href="/products?cat=birds" className="hover:text-white">পাখির পণ্য</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">গ্রাহক সেবা</h4>
            <ul className="space-y-1.5">
              <li><Link href="/tracking" className="hover:text-white">অর্ডার ট্র্যাকিং</Link></li>
              <li><Link href="/faq" className="hover:text-white">জিজ্ঞাসাবাদ (FAQs)</Link></li>
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
