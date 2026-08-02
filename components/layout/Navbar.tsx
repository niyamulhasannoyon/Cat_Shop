"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, cartTotal } = useShop();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const FREE_SHIPPING_THRESHOLD = 3000;
  const remainsForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 1. Dynamic Free Delivery Announcement Bar (Static Top Bar) */}
      <div className="w-full bg-brand-forest text-brand-beige py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-wide shadow-sm">
        {remainsForFreeShipping > 0 ? (
          <span>
            ৳{remainsForFreeShipping.toLocaleString("bn-BD")} সমমূল্যের পণ্য যোগ করলেই পাচ্ছেন{" "}
            <span className="underline decoration-brand-beige-dark underline-offset-4 font-semibold text-white">ফ্রি ডেলিভারি!</span>
          </span>
        ) : (
          <span className="text-brand-beige-dark font-semibold">🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!</span>
        )}
      </div>

      {/* 2. Single-Row Premium Sticky Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-brand-beige/90 backdrop-blur-md text-brand-charcoal font-sans antialiased shadow-sm border-b border-brand-beige-dark/70 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3 md:gap-6">
            
            {/* Brand Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-95 transition-opacity">
              <Logo variant="store" size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-wider font-semibold text-brand-charcoal">
              <Link 
                href="/" 
                className={`py-1.5 transition-colors relative ${
                  isActive('/') ? 'text-brand-forest font-bold' : 'hover:text-brand-forest text-stone-700'
                }`}
              >
                হোম
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-forest rounded-full"></span>
                )}
              </Link>

              <Link 
                href="/products" 
                className={`py-1.5 transition-colors relative ${
                  isActive('/products') ? 'text-brand-forest font-bold' : 'hover:text-brand-forest text-stone-700'
                }`}
              >
                পণ্যসমূহ
                {isActive('/products') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-forest rounded-full"></span>
                )}
              </Link>

              <Link 
                href="/bundles" 
                className="flex items-center gap-1 bg-brand-forest/10 hover:bg-brand-forest/15 text-brand-forest font-bold px-3 py-1.5 rounded-full transition-all border border-brand-forest/20 shadow-xs"
              >
                <span>বান্ডেল অফার</span>
                <span className="text-sm">🎉</span>
              </Link>

              <Link 
                href="/tracking" 
                className={`py-1.5 transition-colors relative flex items-center gap-1 ${
                  isActive('/tracking') ? 'text-brand-forest font-bold' : 'hover:text-brand-forest text-stone-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                ট্র্যাক অর্ডার
              </Link>
            </nav>

            {/* Desktop Search Bar (Compact Integrated) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য খুঁজুন..."
                  className="w-full bg-white/90 text-brand-charcoal placeholder-stone-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-full border border-brand-beige-dark/80 focus:outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand-forest text-brand-beige rounded-full hover:bg-brand-forest-light transition-all focus:outline-none cursor-pointer"
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Right Action Utilities (WhatsApp, Cart, Auth, Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              
              {/* WhatsApp Support Pill */}
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/15 text-emerald-800 py-2 px-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border border-emerald-600/20"
                title="হোয়াটসঅ্যাপ সহায়তা"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.488 5.35 1.489 5.517 0 10.005-4.487 10.008-10.007.001-2.673-1.04-5.187-2.932-7.078C17.18 1.666 14.67 1.624 12.01 1.624c-5.523 0-10.01 4.488-10.013 10.01 0 2.136.564 4.218 1.634 6.012L2.57 21.43l3.877-1.017-.1-1.259z" />
                </svg>
                <span>সহায়তা</span>
              </a>

              {/* Shopping Cart Button */}
              <Link
                href="/cart"
                className="relative p-2.5 text-brand-charcoal hover:text-brand-forest transition-colors hover:bg-stone-200/50 rounded-full"
                aria-label="Shopping cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-extrabold leading-none text-white bg-brand-forest rounded-full shadow-xs border-2 border-brand-beige">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Authentication Actions */}
              <div className="relative flex items-center">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 focus:outline-none cursor-pointer"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-forest/30 hover:ring-brand-forest transition-all"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-brand-forest text-brand-beige flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                          {user.displayName ? user.displayName.substring(0, 1) : (user.email ? user.email.substring(0, 1) : "U")}
                        </div>
                      )}
                    </button>

                    {/* User Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-3.5 w-60 rounded-2xl bg-white border border-brand-beige-dark shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                        onMouseLeave={() => setProfileDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-brand-beige-dark mb-2">
                          <p className="text-sm font-bold text-brand-charcoal truncate">
                            {user.displayName || "ক্রেতা"}
                          </p>
                          <p className="text-xs text-stone-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <Link
                          href="/tracking"
                          className="block px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-stone-50 hover:text-brand-forest transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          আমার অর্ডারসমূহ
                        </Link>

                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await logout();
                            router.push("/");
                          }}
                          className="w-full text-left block px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          লগ আউট (Sign Out)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center justify-center border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-brand-beige py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                  >
                    লগইন
                  </Link>
                )}
              </div>

              {/* Hamburger Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-brand-charcoal hover:text-brand-forest transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Mobile Navigation Drawer Panel */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full lg:hidden bg-brand-beige/95 backdrop-blur-xl border-t border-brand-beige-dark py-4 px-4 space-y-4 shadow-xl z-50">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য খুঁজুন..."
                className="w-full bg-white text-brand-charcoal placeholder-stone-400 text-sm pl-4 pr-12 py-2.5 rounded-full border border-brand-beige-dark focus:outline-none focus:border-brand-forest transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-forest text-brand-beige rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3 font-medium text-sm tracking-wide text-brand-charcoal">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-forest py-1.5 border-b border-brand-beige-dark/40 transition-colors"
              >
                হোম (Home)
              </Link>
              <Link 
                href="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-forest py-1.5 border-b border-brand-beige-dark/40 transition-colors"
              >
                পণ্যসমূহ (All Products)
              </Link>
              <Link 
                href="/bundles" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-forest py-1.5 border-b border-brand-beige-dark/40 font-semibold text-brand-forest flex items-center justify-between transition-colors"
              >
                <span>বান্ডেল অফার (Bundle & Save)</span>
                <span>🎉</span>
              </Link>
              <Link 
                href="/tracking" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-forest py-1.5 flex items-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                অর্ডার ট্র্যাকিং
              </Link>
            </nav>

            {/* Mobile Actions & Auth */}
            <div className="pt-3 border-t border-brand-beige-dark/50 space-y-3">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.488 5.35 1.489 5.517 0 10.005-4.487 10.008-10.007.001-2.673-1.04-5.187-2.932-7.078C17.18 1.666 14.67 1.624 12.01 1.624c-5.523 0-10.01 4.488-10.013 10.01 0 2.136.564 4.218 1.634 6.012L2.57 21.43l3.877-1.017-.1-1.259z" />
                </svg>
                <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
              </a>

              {user ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3 py-1">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-forest/20"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-brand-forest text-brand-beige flex items-center justify-center font-bold text-sm uppercase">
                        {user.displayName ? user.displayName.substring(0, 1) : (user.email ? user.email.substring(0, 1) : "U")}
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-bold text-brand-charcoal truncate">
                        {user.displayName || "ক্রেতা"}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      router.push("/");
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 active:bg-red-100 transition-all cursor-pointer"
                  >
                    লগ আউট (Sign Out)
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-brand-forest hover:bg-brand-forest-light text-brand-beige py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  লগইন করুন
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
