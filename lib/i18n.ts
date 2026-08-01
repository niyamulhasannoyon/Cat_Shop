export type Locale = "bn" | "en";

export const dictionary = {
  bn: {
    brandName: "Paws & Co. (পজ & কো.)",
    heroTitle: "বাংলাদেশের ১ নম্বর বিশ্বস্ত পেট শপ",
    heroSubtitle: "আপনার প্রিয় বিড়াল, কুকুর ও পাখির জন্য সেরা মানসম্মত পণ্য সরাসরি আপনার ঘরে।",
    addToCart: "কার্টে যোগ করুন",
    outOfStock: "আউট অফ স্টক",
    price: "মূল্য",
    insideDhaka: "ঢাকার ভেতরে (৬০৳)",
    outsideDhaka: "ঢাকার বাইরে (১২০৳)",
    subArea: "সাব-এরিয়া (১০০৳)",
    placeOrder: "অর্ডার কনফার্ম করুন",
    cod: "ক্যাশ অন ডেলিভারি (COD)",
    bkash: "বিকাশ (bKash)",
    nagad: "নগদ (Nagad)",
    card: "কার্ড পেমেন্ট (SSLCommerz)",
  },
  en: {
    brandName: "Paws & Co.",
    heroTitle: "Bangladesh's #1 Trusted Pet Shop",
    heroSubtitle: "Premium quality accessories and supplies for your cats, dogs, and birds delivered to your doorstep.",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    price: "Price",
    insideDhaka: "Inside Dhaka (60৳)",
    outsideDhaka: "Outside Dhaka (120৳)",
    subArea: "Sub-Area (100৳)",
    placeOrder: "Place Order",
    cod: "Cash on Delivery (COD)",
    bkash: "bKash Mobile Wallet",
    nagad: "Nagad Mobile Wallet",
    card: "Card / Mobile Banking (SSLCommerz)",
  },
};

export function t(key: keyof typeof dictionary["bn"], locale: Locale = "bn"): string {
  return dictionary[locale]?.[key] || dictionary["bn"][key] || key;
}
