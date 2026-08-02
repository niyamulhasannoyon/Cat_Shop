"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface ProductsCatalogViewProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductsCatalogView({
  initialProducts,
  initialCategory = "",
  initialSearch = "",
}: ProductsCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>("default");

  const categories = [
    { id: "all", label: "সকল পণ্য (All)", icon: "🐾" },
    { id: "cats", label: "বিড়াল (Cats)", icon: "🐱" },
    { id: "dogs", label: "কুকুর (Dogs)", icon: "🐶" },
    { id: "birds", label: "পাখি (Birds)", icon: "🦜" },
  ];

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter((p) => {
      const catMatch = !selectedCategory || selectedCategory === "all" || p.category === selectedCategory;
      const searchMatch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const priceMatch = p.price <= maxPrice;

      return catMatch && searchMatch && priceMatch;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, maxPrice, sortBy]);

  const hasActiveFilters = Boolean(
    (selectedCategory && selectedCategory !== "all") || searchQuery || maxPrice < 5000 || sortBy !== "default"
  );

  const resetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setMaxPrice(5000);
    setSortBy("default");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Ultra-Modern Filter & Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-md space-y-6">
        
        {/* Top Control Section: Category Pills + Search Box */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected =
                (cat.id === "all" && (!selectedCategory || selectedCategory === "all")) ||
                selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === "all" ? "" : cat.id)}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-brand-forest text-white shadow-md shadow-brand-forest/20 scale-[1.02]"
                      : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full bg-stone-50 border border-stone-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20 transition-all"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Control Section: Price Range + Sort + Reset */}
        <div className="pt-5 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Price Range Slider */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-stone-700">সর্বোচ্চ মূল্য:</span>
            <span className="bg-brand-forest/10 text-brand-forest px-3 py-1 rounded-full font-bold text-xs border border-brand-forest/20">
              ৳{maxPrice.toLocaleString("bn-BD")}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-stone-400">৳১০০</span>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-36 sm:w-48 accent-brand-forest cursor-pointer"
              />
              <span className="text-[10px] font-semibold text-stone-400">৳৫,০০০</span>
            </div>
          </div>

          {/* Sort Selector & Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-500 hidden sm:inline">সাজান:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-700 font-semibold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-forest cursor-pointer"
              >
                <option value="default">ডিফল্ট (Default)</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>ফিল্টার রিসেট</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 2. Results Header Bar */}
      <div className="flex items-center justify-between px-2 text-xs text-stone-600 font-semibold">
        <div className="flex items-center gap-2">
          <span>মোট <strong className="text-brand-forest font-bold">{filteredProducts.length}টি</strong> পণ্য পাওয়া গেছে</span>
          {hasActiveFilters && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </div>

        {searchQuery && (
          <div className="text-stone-500 font-normal">
            অনুসন্ধান: <span className="font-semibold text-stone-800">"{searchQuery}"</span>
          </div>
        )}
      </div>

      {/* 3. Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-3xl">
            🐾
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">কোনো পণ্য পাওয়া যায়নি!</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              আপনার ফিল্টার অথবা সার্চ কি-ওয়ার্ড পরিবর্তন করে দেখুন।
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-brand-forest text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-forest-light transition-all shadow-md cursor-pointer"
          >
            সকল পণ্য দেখুন
          </button>
        </div>
      )}
    </div>
  );
}
