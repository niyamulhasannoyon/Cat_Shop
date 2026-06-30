"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const { addToCart, products } = useShop();

  // Search parameters states
  const categoryParam = searchParams.get("cat") || "";
  const queryParam = searchParams.get("search") || "";

  // Filtering states
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync state with URL search parameters
  useEffect(() => {
    setSearchVal(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  // Filter handlers
  const filteredProducts = products.filter((product) => {
    const category = product.category || "cats";
    const brand = product.brand || "Pawsome";

    const matchesSearch =
      product.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      category.toLowerCase().includes(searchVal.toLowerCase()) ||
      brand.toLowerCase().includes(searchVal.toLowerCase());

    const matchesCategory = selectedCategory ? category === selectedCategory : true;
    const matchesBrand = selectedBrand ? brand === selectedBrand : true;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div className="bg-brand-beige flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-beige-dark pb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-charcoal">পেট এক্সেসরিজ কালেকশন</h1>
            <p className="text-sm text-stone-500 font-light mt-1">প্রিমিয়াম কোয়ালিটির প্রোডাক্ট খুঁজুন ও কার্টে যোগ করুন</p>
          </div>
          {searchVal && (
            <div className="text-xs bg-brand-forest/5 text-brand-forest px-3 py-1.5 rounded-full border border-brand-forest/15 font-medium">
              অনুসন্ধানের ফলাফল: &quot;{searchVal}&quot; ({filteredProducts.length}টি প্রোডাক্ট পাওয়া গেছে)
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex lg:hidden justify-between items-center bg-white p-4 rounded-xl border border-brand-beige-dark shadow-sm gap-4">
          <div className="text-xs font-semibold text-brand-charcoal">
            ফিল্টার অপশন খুঁজে দেখুন
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{mobileFiltersOpen ? "ফিল্টার বন্ধ করুন ✕" : "ফিল্টার দেখান 🛠️"}</span>
          </button>
        </div>

        {/* Catalog Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className={`${mobileFiltersOpen ? "block" : "hidden lg:block"} bg-white rounded-3xl p-6 border border-brand-beige-dark/60 shadow-sm h-fit space-y-6`}>
            <h2 className="text-base font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">ফিল্টার অপশন</h2>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">পোষা প্রাণী</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-brand-beige/50 border border-brand-beige-dark/80 text-sm rounded-xl py-3 px-4 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
              >
                <option value="">সকল ক্যাটাগরি</option>
                <option value="cats">বিড়াল (Cats)</option>
                <option value="dogs">কুকুর (Dogs)</option>
                <option value="birds">পাখি (Birds)</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">ব্র্যান্ড</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-brand-beige/50 border border-brand-beige-dark/80 text-sm rounded-xl py-3 px-4 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
              >
                <option value="">সকল ব্র্যান্ড</option>
                <option value="Pawsome">Pawsome</option>
                <option value="MeowMix">MeowMix</option>
                <option value="DoggyStyles">DoggyStyles</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">সর্বোচ্চ বাজেট</label>
                <span className="text-xs font-semibold text-brand-forest">৳{maxPrice.toLocaleString("bn-BD")}</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-beige-dark rounded-lg appearance-none cursor-pointer accent-brand-forest"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>৳৩০০</span>
                <span>৳৩,০০০</span>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedBrand("");
                setMaxPrice(3000);
                setSearchVal("");
              }}
              className="w-full bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal py-3 rounded-xl text-xs font-semibold transition-colors border border-brand-beige-dark/80 cursor-pointer"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const category = product.category || "cats";
                  const brand = product.brand || "Pawsome";
                  
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl border border-brand-beige-dark/45 p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(45,90,39,0.06)] hover:-translate-y-1 hover:border-brand-forest/15 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-brand-forest/5 text-brand-forest px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border border-brand-forest/10">
                            {category === "cats" ? "বিড়াল" : category === "dogs" ? "কুকুর" : "পাখি"}
                          </span>
                          <span className="text-[10px] text-stone-400">{brand}</span>
                        </div>

                        {/* Visual Product Image with Fallback */}
                        <div className="h-44 bg-brand-beige rounded-2xl overflow-hidden border border-brand-beige-dark/50 flex items-center justify-center relative">
                          {product.id === "1" ? (
                            <img src="/collar.png" alt={product.name} className="w-full h-full object-cover" />
                          ) : product.id === "cat_litter_premium" ? (
                            <img src="/litter.png" alt={product.name} className="w-full h-full object-cover" />
                          ) : product.id === "leather_dog_leash" ? (
                            <img src="/leash.png" alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-brand-beige-dark/30 shadow-inner">
                              {category === "cats" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-forest/60">
                                  <path d="M12 21c-4.418 0-8-3.582-8-8 0-3.55 2.317-6.56 5.5-7.58L6 2l4 3.5C10.63 5.17 11.3 5 12 5s1.37.17 2 .5L18 2l-3.5 3.42c3.183 1.02 5.5 4.03 5.5 7.58 0 4.418-3.582 8-8 8z" />
                                  <circle cx="9" cy="12" r="1" fill="currentColor" />
                                  <circle cx="15" cy="12" r="1" fill="currentColor" />
                                  <path d="M12 14.5l-1-1h2z" fill="currentColor" />
                                </svg>
                              ) : category === "dogs" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-forest/60">
                                  <path d="M6 5c0-1.657 1-3 3-3h6c2 0 3 1.343 3 3v4.586c0 .53-.21 1.04-.586 1.414L15 13.414V17a3 3 0 01-6 0v-3.586L6.586 11c-.375-.374-.586-.884-.586-1.414V5z" />
                                  <path d="M6 5.5C4 5.5 3 7 3 9.5c0 3 2 4.5 3 2.5V5.5z" />
                                  <path d="M18 5.5c2 0 3 1.5 3 4c0 3-2 4.5-3 2.5V5.5z" />
                                  <circle cx="9.5" cy="9.5" r="1" fill="currentColor" />
                                  <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-forest/60">
                                  <path d="M15.5 8.5c0-2.5-2-4.5-4.5-4.5S6.5 6 6.5 8.5c0 1.5.5 2.5 1.5 3.5L7 19.5c0 1 1 1.5 2 1l2.5-3 2.5 3c1 .5 2 0 2-1l-1-7.5c1-1 1.5-2 1.5-3.5z" />
                                  <path d="M6.5 7.5L3 9l3.5 1.5Z" fill="currentColor" />
                                  <circle cx="9.5" cy="7.5" r="1" fill="currentColor" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-brand-charcoal tracking-tight line-clamp-2 h-10 leading-snug">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-beige-dark/50 flex items-center justify-between">
                        <span className="text-base font-bold text-brand-forest">
                          ৳{product.price.toLocaleString("bn-BD")}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-4 py-2.5 rounded-full text-xs font-semibold transition-colors focus:outline-none cursor-pointer"
                        >
                          কার্টে যোগ করুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-brand-beige-dark shadow-sm space-y-4">
                <span className="text-5xl block">🔍</span>
                <h3 className="text-base font-semibold text-brand-charcoal">কোনো পণ্য পাওয়া যায়নি!</h3>
                <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
                  অনুগ্রহ করে আপনার অনুসন্ধানের কি-ওয়ার্ড পরিবর্তন করুন অথবা ফিল্টার রিসেট করে আবার চেষ্টা করুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedBrand("");
                    setMaxPrice(3000);
                    setSearchVal("");
                  }}
                  className="bg-brand-forest text-brand-beige px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-forest-light transition-colors"
                >
                  ক্যাটালগ রিসেট করুন
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalog() {
  return (
    <Suspense fallback={
      <div className="bg-brand-beige flex-1 flex items-center justify-center min-h-screen">
        <div className="text-brand-forest font-semibold text-sm">লোড হচ্ছে...</div>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
