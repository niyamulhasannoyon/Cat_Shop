"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import PriceTag from "./PriceTag";
import RatingStars from "./RatingStars";
import { useShop } from "@/context/ShopContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Stock badge */}
      {isOutOfStock ? (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          আউট অফ স্টক
        </div>
      ) : isLowStock ? (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          হাতে শেষ মাত্র {product.stock}টি!
        </div>
      ) : (
        <div className="absolute top-3 left-3 z-10 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          স্টক এভেইলবল
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full bg-stone-50 overflow-hidden block">
        <Image
          src={product.imageUrl || "/collar.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {product.brand && (
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
              {product.brand}
            </span>
          )}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-stone-900 text-sm lg:text-base line-clamp-2 hover:text-brand-forest transition-colors">
              {product.name}
            </h3>
          </Link>
          <RatingStars rating={4.8} showNumber />
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <PriceTag price={product.price} size="md" />

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-brand-forest hover:bg-brand-forest-light text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>যোগ হয়েছে!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>কার্টে নিন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
