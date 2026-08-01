"use client";

import React from "react";
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

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Stock badge */}
      {isOutOfStock ? (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          আউট অফ স্টক (Out of Stock)
        </div>
      ) : isLowStock ? (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          হাতে শেষ মাত্র {product.stock}টি!
        </div>
      ) : (
        <div className="absolute top-3 left-3 z-10 bg-brand-forest text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          স্টক এভেইলেবল
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full bg-neutral-50 overflow-hidden block">
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
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              {product.brand}
            </span>
          )}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-neutral-900 text-sm lg:text-base line-clamp-2 hover:text-brand-forest transition-colors">
              {product.name}
            </h3>
          </Link>
          <RatingStars rating={4.8} showNumber />
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <PriceTag price={product.price} size="md" />

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isOutOfStock
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-brand-forest hover:bg-brand-forest/90 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            <span>কার্টে নিন</span>
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
