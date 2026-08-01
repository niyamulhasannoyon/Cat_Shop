"use client";

import React, { useState } from "react";
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

  const filteredProducts = initialProducts.filter((p) => {
    const catMatch = !selectedCategory || selectedCategory === "all" || p.category === selectedCategory;
    const searchMatch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const priceMatch = p.price <= maxPrice;

    return catMatch && searchMatch && priceMatch;
  });

  return (
    <div className="space-y-8">
      {/* Category Tabs & Search Header */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: "all", label: "সকল পণ্য (All)" },
              { id: "cats", label: "বিড়াল (Cats)" },
              { id: "dogs", label: "কুকুর (Dogs)" },
              { id: "birds", label: "পাখি (Birds)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === "all" ? "" : cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  (cat.id === "all" && !selectedCategory) || selectedCategory === cat.id
                    ? "bg-brand-forest text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-brand-forest"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-600 pt-2 border-t border-neutral-100">
          <span>সর্বোচ্চ মূল্য: ৳{maxPrice.toLocaleString("bn-BD")}</span>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-48 accent-brand-forest cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 space-y-2">
          <div className="text-4xl">🐱</div>
          <h3 className="text-base font-bold text-neutral-800">কোনো পণ্য পাওয়া যায়নি!</h3>
          <p className="text-xs text-neutral-500">অন্য ফিল্টার বা ক্যাটাগরি ট্রাই করুন।</p>
        </div>
      )}
    </div>
  );
}
