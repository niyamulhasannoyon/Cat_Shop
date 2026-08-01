import React from "react";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function PriceTag({
  price,
  originalPrice,
  currency = "৳",
  size = "md",
  className = "",
}: PriceTagProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base font-bold",
    lg: "text-xl font-black",
    xl: "text-2xl lg:text-3xl font-black",
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`${sizeClasses[size]} text-brand-forest tracking-tight`}>
        {currency}
        {price.toLocaleString("bn-BD")}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs lg:text-sm text-neutral-400 line-through font-normal">
          {currency}
          {originalPrice.toLocaleString("bn-BD")}
        </span>
      )}
    </div>
  );
}
