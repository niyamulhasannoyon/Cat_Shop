"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "store" | "admin" | "dark";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export const PawIconSvg = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dimensionClass = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9";

  return (
    <div className={`relative flex-shrink-0 ${dimensionClass}`}>
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <rect width="512" height="512" rx="140" fill="url(#logo-bg-grad)" />
        <rect x="16" y="16" width="480" height="480" rx="124" stroke="url(#logo-border-grad)" strokeWidth="12" strokeOpacity="0.35" />
        
        <g transform="translate(0, 10)">
          <path d="M256 376c-48 0-88-28-88-68 0-32 26-52 56-52 18 0 24 10 32 10s14-10 32-10c30 0 56 20 56 52 0 40-40 68-88 68z" fill="#FFFFFF"/>
          <ellipse cx="160" cy="220" rx="28" ry="38" fill="#FFFFFF" transform="rotate(-20 160 220)"/>
          <ellipse cx="224" cy="172" rx="28" ry="40" fill="#FFFFFF" transform="rotate(-6 224 172)"/>
          <ellipse cx="288" cy="172" rx="28" ry="40" fill="#FFFFFF" transform="rotate(6 288 172)"/>
          <ellipse cx="352" cy="220" rx="28" ry="38" fill="#FFFFFF" transform="rotate(20 352 220)"/>
          <path d="M256 95l9 27 27 9-27 9-9 27-9-27-27-9 27-9z" fill="#F59E0B"/>
        </g>

        <defs>
          <linearGradient id="logo-bg-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2D5A27"/>
            <stop offset="1" stopColor="#183615"/>
          </linearGradient>
          <linearGradient id="logo-border-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A7F3D0"/>
            <stop offset="1" stopColor="#059669"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function Logo({
  variant = "store",
  size = "md",
  showSubtitle = false,
  href = "/",
  className = "",
}: LogoProps) {
  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  };

  const isDark = variant === "admin" || variant === "dark";

  return (
    <Link href={href} className={`inline-flex items-center gap-3 group ${className}`}>
      <PawIconSvg size={size} />
      <div className="flex flex-col leading-none">
        <span className={`${titleSizes[size]} font-black tracking-tight ${isDark ? "text-white" : "text-brand-forest"} transition-colors`}>
          Paws<span className={isDark ? "text-emerald-400 font-light" : "text-brand-charcoal font-light"}>&Co.</span>
        </span>
        {showSubtitle && (
          <span className={`${subtitleSizes[size]} font-bold tracking-widest uppercase mt-0.5 ${isDark ? "text-emerald-400/80" : "text-stone-500"}`}>
            {variant === "admin" ? "Enterprise Admin" : "Premium Pet Boutique"}
          </span>
        )}
      </div>
    </Link>
  );
}
