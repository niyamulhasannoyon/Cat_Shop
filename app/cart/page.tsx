"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart, placeOrder } = useShop();

  // Delivery configuration
  const FREE_SHIPPING_THRESHOLD = 3000;
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : deliveryArea === "inside" ? 60 : 120;
  const remainsForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const grandTotal = cartTotal + shippingFee;

  // Checkout form states
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mfs">("cod");

  // Success checkout state
  const [placedOrderId, setPlacedOrderId] = useState<string>("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart");

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("অনুগ্রহ করে সব তথ্য সঠিক উপায়ে পূরণ করুন।");
      return;
    }
    
    // Call centralized placeOrder to sync with local storage & orders history
    const orderId = placeOrder(name, phone, address, paymentMethod, deliveryArea);
    
    setPlacedOrderId(orderId);
    setCheckoutStep("success");
  };

  if (checkoutStep === "success") {
    return (
      <div className="bg-brand-beige flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-brand-beige-dark p-8 text-center space-y-6 shadow-sm">
          <div className="text-6xl text-brand-forest">🎉</div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-brand-charcoal">অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h1>
            <p className="text-xs text-stone-500 font-light">আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই ফোন করে আপনার অর্ডারটি কনফার্ম করবেন।</p>
          </div>

          {/* Details summary */}
          <div className="bg-brand-beige p-5 rounded-2xl border border-brand-beige-dark text-left space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-500">অর্ডার নম্বর:</span>
              <span className="font-bold text-brand-forest text-sm">{placedOrderId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-500">কাস্টমার নাম:</span>
              <span className="font-medium text-brand-charcoal">{name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-500">মোবাইল নম্বর:</span>
              <span className="font-medium text-brand-charcoal">{phone}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-500">পেমেন্ট মেথড:</span>
              <span className="font-bold text-brand-forest uppercase">
                {paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : "বিকাশ / নগদ (MFS)"}
              </span>
            </div>
            <div className="border-t border-brand-beige-dark pt-3 flex justify-between items-center text-xs font-bold">
              <span className="text-stone-500">সর্বমোট মূল্য:</span>
              <span className="text-brand-forest text-base">৳{grandTotal.toLocaleString("bn-BD")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push(`/tracking?id=${placedOrderId}`)}
              className="flex-1 bg-brand-forest hover:bg-brand-forest-light text-brand-beige py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none"
            >
              অর্ডার ট্র্যাক করুন
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-brand-beige-dark focus:outline-none"
            >
              হোম পেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-beige flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-brand-beige-dark pb-6">
          <h1 className="text-3xl font-bold text-brand-charcoal">আপনার শপিং কার্ট</h1>
          <p className="text-sm text-stone-500 font-light mt-1">অর্ডার সম্পন্ন করতে প্রয়োজনীয় তথ্য দিয়ে ফর্মটি পূরণ করুন</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-brand-beige-dark p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm"
                >
                  {/* Info details */}
                  <div className="flex gap-3 sm:gap-4 items-center flex-1 min-w-0">
                    <span className="text-2xl sm:text-3xl p-2 sm:p-2.5 bg-brand-beige rounded-xl border border-brand-beige-dark flex-shrink-0">📦</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-brand-charcoal truncate">{item.name}</h3>
                      <p className="text-[11px] sm:text-xs text-brand-forest font-bold mt-1">৳{item.price.toLocaleString("bn-BD")}</p>
                    </div>
                  </div>

                  {/* Quantity Controller & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-brand-beige-dark pt-3 sm:pt-0 w-full sm:w-auto">
                    <div className="flex items-center bg-brand-beige border border-brand-beige-dark rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-stone-500 hover:text-brand-forest px-2.5 py-0.5 text-xs font-bold focus:outline-none"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-brand-charcoal min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-stone-500 hover:text-brand-forest px-2.5 py-0.5 text-xs font-bold focus:outline-none"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-stone-400 hover:text-red-700 hover:bg-stone-55 rounded-full transition-colors focus:outline-none"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form & Order Summary */}
            <div className="space-y-6">
              
              {/* Checkout Card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">অর্ডার বিবরণী</h2>
                
                {/* Free shipping indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-brand-charcoal">
                    <span>ডেলিভারি প্রগতি:</span>
                    <span>৳{cartTotal.toLocaleString("bn-BD")} / ৳৩,০০০</span>
                  </div>
                  <div className="w-full bg-brand-beige-dark h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-forest h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 font-light">
                    {remainsForFreeShipping > 0 
                      ? `আর মাত্র ৳${remainsForFreeShipping.toLocaleString("bn-BD")} সমমূল্যের পণ্য কিনলে ফ্রি শিপিং পাবেন!` 
                      : "অভিনন্দন! আপনি ফ্রি ডেলিভারি কোটা অর্জন করেছেন।"}
                  </p>
                </div>

                {/* Subtotals & Fees */}
                <div className="space-y-2.5 text-xs text-brand-charcoal border-b border-brand-beige-dark pb-4">
                  <div className="flex justify-between font-light">
                    <span>পণ্যের মূল্য:</span>
                    <span>৳{cartTotal.toLocaleString("bn-BD")}</span>
                  </div>
                  <div className="flex justify-between font-light">
                    <span>ডেলিভারি চার্জ:</span>
                    <span>{shippingFee === 0 ? "ফ্রি" : `৳${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-brand-forest pt-1">
                    <span>সর্বমোট মূল্য:</span>
                    <span>৳{grandTotal.toLocaleString("bn-BD")}</span>
                  </div>
                </div>

                {/* Address Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">ডেলিভারি তথ্য</h3>
                  
                  {/* Delivery Location Area Selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-stone-500">ডেলিভারি এলাকা:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryArea("inside")}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          deliveryArea === "inside"
                            ? "bg-brand-forest border-brand-forest text-brand-beige"
                            : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
                        }`}
                      >
                        ঢাকার ভেতরে
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryArea("outside")}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          deliveryArea === "outside"
                            ? "bg-brand-forest border-brand-forest text-brand-beige"
                            : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
                        }`}
                      >
                        ঢাকার বাইরে
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="customer-name" className="text-[11px] font-semibold text-stone-500">আপনার নাম:</label>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="নাম লিখুন"
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="customer-phone" className="text-[11px] font-semibold text-stone-500">মোবাইল নম্বর:</label>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="customer-address" className="text-[11px] font-semibold text-stone-500">পূর্ণ ঠিকানা:</label>
                    <textarea
                      id="customer-address"
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="জেলা, থানা, এলাকা ও বাসার নম্বর"
                      className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest"
                    />
                  </div>

                  {/* Payment selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-stone-500">পেমেন্ট পদ্ধতি:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          paymentMethod === "cod"
                            ? "bg-brand-forest border-brand-forest text-brand-beige"
                            : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
                        }`}
                      >
                        ক্যাশ অন ডেলিভারি
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mfs")}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          paymentMethod === "mfs"
                            ? "bg-brand-forest border-brand-forest text-brand-beige"
                            : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
                        }`}
                      >
                        বিকাশ / নগদ (MFS)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-forest hover:bg-brand-forest-light text-brand-beige py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md mt-6 focus:outline-none"
                  >
                    অর্ডার প্লেস করুন
                  </button>
                </form>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center border border-brand-beige-dark shadow-sm space-y-4 max-w-lg mx-auto">
            <span className="text-6xl block">🛒</span>
            <h2 className="text-base font-semibold text-brand-charcoal">আপনার কার্টটি খালি!</h2>
            <p className="text-xs text-stone-500 font-light">কার্টে কোনো পণ্য যোগ করা হয়নি। আমাদের চমৎকার ক্যাটালগ থেকে শপিং শুরু করুন।</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-brand-forest text-brand-beige px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-forest-light transition-colors"
            >
              পণ্য দেখতে যান
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
