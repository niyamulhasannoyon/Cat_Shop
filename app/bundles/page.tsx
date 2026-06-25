"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";

interface Bundle {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  savings: number;
  petType: "cats" | "dogs";
  emoji: string;
  description: string;
  items: Product[];
}

const BUNDLE_DEALS: Bundle[] = [
  {
    id: "cat_starter_pack",
    name: "ক্যাট স্টার্টার প্যাক (Cat Starter Pack)",
    price: 1800,
    originalPrice: 2050,
    savings: 250,
    petType: "cats",
    emoji: "🐱",
    description: "নতুন বিড়ালের জন্য প্রয়োজনীয় গ্রুমিং ও হাইজিন সামগ্রীর প্রিমিয়াম বান্ডেল অফার।",
    items: [
      { id: "1", name: "Premium Velvet Cat Collar (Forest Green)", price: 1200 },
      { id: "cat_litter_premium", name: "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)", price: 850 },
    ],
  },
  {
    id: "dog_hygiene_pack",
    name: "ডগ হাইজিন প্যাক (Dog Hygiene Pack)",
    price: 800,
    originalPrice: 1050,
    savings: 250,
    petType: "dogs",
    emoji: "🐶",
    description: "আপনার কুকুরের স্বাস্থ্যকর গ্রুমিং ও ডেন্টাল সুরক্ষার সেরা কম্বো প্যাক।",
    items: [
      { id: "dog_shampoo", name: "অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার", price: 650 },
      { id: "dog_chew_toy", name: "ডেন্টাল ডগ চিউ টয়", price: 400 },
    ],
  },
];

export default function BundlesPage() {
  const { addToCart } = useShop();

  const handleAddBundleToCart = (bundle: Bundle) => {
    // Add each product from the bundle into the cart
    bundle.items.forEach((item) => {
      // In production we would adjust product price for bundle or apply a coupon.
      // For this simulator, we directly add items to the cart.
      addToCart(item);
    });
    alert(`🎉 "${bundle.name}" এর সকল আইটেম কার্টে যোগ করা হয়েছে!`);
  };

  return (
    <div className="bg-brand-beige flex-1 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-forest/5 px-4 py-1.5 rounded-full text-brand-forest text-xs font-semibold uppercase tracking-wider">
            🔥 বান্ডেল ও সেভ অফার
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">সাশ্রয়ী পেট বান্ডেল সমূহ</h1>
          <p className="text-sm text-stone-500 font-light max-w-md mx-auto">
            আপনার পোষা প্রাণীর প্রয়োজনীয় সামগ্রীগুলো একসাথে কম্বো প্যাক হিসেবে কিনে সাশ্রয় করুন আকর্ষণীয় ডিসকাউন্ট।
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BUNDLE_DEALS.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-brand-beige-dark p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Savings Badge */}
              <div className="absolute top-4 right-4 bg-brand-forest text-brand-beige px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                ৳{bundle.savings} সাশ্রয়!
              </div>

              <div className="space-y-6">
                {/* Bundle Header */}
                <div className="flex gap-4 items-center">
                  <span className="text-4xl p-3 bg-brand-beige rounded-2xl border border-brand-beige-dark">
                    {bundle.emoji}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-brand-charcoal leading-snug">
                      {bundle.name}
                    </h2>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                      {bundle.petType === "cats" ? "বিড়াল কম্বো" : "কুকুর কম্বো"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {bundle.description}
                </p>

                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">বান্ডেলে থাকা পণ্যসমূহ:</h3>
                  <div className="space-y-2">
                    {bundle.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-brand-beige p-3 rounded-xl border border-brand-beige-dark text-xs text-brand-charcoal font-medium"
                      >
                        <span className="text-lg">📦</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{item.name}</p>
                          <p className="text-[10px] text-stone-400 font-light mt-0.5">৳{item.price.toLocaleString("bn-BD")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart button */}
              <div className="mt-8 pt-6 border-t border-brand-beige-dark flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-400 line-through">
                    পূর্বমূল্য ৳{bundle.originalPrice.toLocaleString("bn-BD")}
                  </p>
                  <p className="text-xl font-black text-brand-forest">
                    ৳{bundle.price.toLocaleString("bn-BD")}
                  </p>
                </div>
                <button
                  onClick={() => handleAddBundleToCart(bundle)}
                  className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors focus:outline-none"
                >
                  প্যাকটি কিনুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
