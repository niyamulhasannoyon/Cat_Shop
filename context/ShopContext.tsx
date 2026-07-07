"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, ShopContextType, Customer, Coupon, CouponUsage, StockLog, ProductVariant } from "@/types";

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "আরিফ রহমান",
    email: "arif@example.com",
    phone: "01712345678",
    shippingAddresses: ["গুলশান-১, ঢাকা", "বনানী, ব্লক-ডি, ঢাকা"],
    totalOrders: 1,
    totalSpent: 2960,
    signupDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    lastLoginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cust-2",
    name: "তাহমিদ হাসান",
    email: "tahmid@example.com",
    phone: "01898765432",
    shippingAddresses: ["মিরপুর-১০, ঢাকা"],
    totalOrders: 1,
    totalSpent: 1160,
    signupDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    emailVerified: true,
    phoneVerified: false,
    lastLoginDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cust-3",
    name: "সাদিয়া ইসলাম",
    email: "sadia@example.com",
    phone: "01511223344",
    shippingAddresses: ["উত্তরা সেক্টর-৪, ঢাকা"],
    totalOrders: 3,
    totalSpent: 8750,
    signupDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "blocked",
    emailVerified: true,
    phoneVerified: true,
    lastLoginDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cust-4",
    name: "নিলয় দত্ত",
    email: "niloy@example.com",
    phone: "01987654321",
    shippingAddresses: ["মোহাম্মদপুর, ঢাকা"],
    totalOrders: 0,
    totalSpent: 0,
    signupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    emailVerified: false,
    phoneVerified: false,
    lastLoginDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cust-5",
    name: "তানজিনা আক্তার",
    email: "tanjina@example.com",
    phone: "01312345678",
    shippingAddresses: ["ধানমণ্ডি-৩২, ঢাকা"],
    totalOrders: 2,
    totalSpent: 4200,
    signupDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    emailVerified: false,
    phoneVerified: true,
    lastLoginDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cust-6",
    name: "রাইহান চৌধুরী",
    email: "raihan@example.com",
    phone: "01698765432",
    shippingAddresses: ["লালমাটিয়া, ঢাকা"],
    totalOrders: 5,
    totalSpent: 12500,
    signupDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    lastLoginDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const generateMockCustomers = (): Customer[] => {
  const base = [...INITIAL_CUSTOMERS];
  const banglaNames = ["জসিম উদ্দিন", "মেহেদী হাসান", "ফারজানা ইয়াসমিন", "কানিজ ফাতেমা", "সাকিব আল হাসান", "মুশফিকুর রহিম", "মাহমুদুল হাসান", "রুবেল হোসেন", "তাসকিন আহমেদ", "মেহেদী হাসান মিরাজ", "মোস্তাফিজুর রহমান", "লিটন দাস", "সৌম্য সরকার", "নুরুল হাসান সোহান", "শরিফুল ইসলাম"];
  const englishEmails = ["josim", "mehedi", "farjana", "kaniz", "shakib", "mushfiq", "mahmudul", "rubel", "taskin", "miraz", "fizz", "liton", "soumya", "sohan", "shoriful"];
  
  for (let i = 0; i < 15; i++) {
    const idNum = i + 7;
    const phoneNum = `017000000${idNum < 10 ? '0' + idNum : idNum}`;
    base.push({
      id: `cust-${idNum}`,
      name: banglaNames[i % banglaNames.length],
      email: `${englishEmails[i % englishEmails.length]}${idNum}@example.com`,
      phone: phoneNum,
      shippingAddresses: [`মিরপুর, ঢাকা`, `উত্তরা, ঢাকা`],
      totalOrders: i % 3,
      totalSpent: (i % 3) * 1200,
      signupDate: new Date(Date.now() - (idNum * 2) * 24 * 60 * 60 * 1000).toISOString(),
      status: i % 5 === 0 ? "blocked" : "active",
      emailVerified: i % 2 === 0,
      phoneVerified: i % 3 !== 0,
      lastLoginDate: new Date(Date.now() - (i) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return base;
};


const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: "log-1",
    productId: "1",
    productName: "Premium Velvet Cat Collar (Forest Green)",
    variantId: "var-1",
    variantDetails: "Size: M, Color: Forest Green",
    quantityChanged: 12,
    actionType: "restock",
    updatedBy: "admin",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-2",
    productId: "1",
    productName: "Premium Velvet Cat Collar (Forest Green)",
    variantId: "var-2",
    variantDetails: "Size: L, Color: Forest Green",
    quantityChanged: 8,
    actionType: "restock",
    updatedBy: "admin",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-3",
    productId: "1",
    productName: "Premium Velvet Cat Collar (Forest Green)",
    variantId: "var-3",
    variantDetails: "Size: M, Color: Crimson Red",
    quantityChanged: 3,
    actionType: "restock",
    updatedBy: "admin",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-4",
    productId: "2",
    productName: "Organic Salmon Grain-Free Food (1.5kg)",
    quantityChanged: 5,
    actionType: "restock",
    updatedBy: "admin",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-5",
    productId: "2",
    productName: "Organic Salmon Grain-Free Food (1.5kg)",
    quantityChanged: -1,
    actionType: "purchase",
    updatedBy: "customer_order_ORD-9304",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-6",
    productId: "dog_shampoo",
    productName: "অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার",
    quantityChanged: 2,
    actionType: "restock",
    updatedBy: "admin",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Velvet Cat Collar (Forest Green)",
    price: 1200,
    category: "cats",
    brand: "Pawsome",
    stock: 23,
    lowStockThreshold: 5,
    variants: [
      { id: "var-1", size: "M", color: "Forest Green", stock: 12 },
      { id: "var-2", size: "L", color: "Forest Green", stock: 8 },
      { id: "var-3", size: "M", color: "Crimson Red", stock: 3 },
      { id: "var-4", size: "L", color: "Crimson Red", stock: 0 },
    ]
  },
  { id: "2", name: "Organic Salmon Grain-Free Food (1.5kg)", price: 1250, category: "cats", brand: "MeowMix", stock: 4, lowStockThreshold: 5 },
  { id: "cat_litter_premium", name: "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)", price: 850, category: "cats", brand: "Pawsome", stock: 25, lowStockThreshold: 5 },
  { id: "leather_dog_leash", name: "লেদার ডগ লিশ ও হারনেস বেল্ট", price: 1100, category: "dogs", brand: "Pawsome", stock: 15, lowStockThreshold: 5 },
  { id: "dog_shampoo", name: "অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার", price: 650, category: "dogs", brand: "DoggyStyles", stock: 2, lowStockThreshold: 5 },
  { id: "bird_feed_mix", name: "প্রিমিয়াম সিড মিক্স পাখির খাবার (১ কেজি)", price: 450, category: "birds", brand: "Pawsome", stock: 18, lowStockThreshold: 5 },
  { id: "bird_cage_swing", name: "পাখির খাঁচার খেলনা ও দোলনা", price: 350, category: "birds", brand: "Pawsome", stock: 0, lowStockThreshold: 5 },
  { id: "cat_nip_spray", name: "অর্গানিক ক্যাটনিপ স্প্রে (১০০ মিলি)", price: 550, category: "cats", brand: "MeowMix", stock: 10, lowStockThreshold: 5 },
  { id: "dog_chew_toy", name: "ডেন্টাল ডগ চিউ টয়", price: 400, category: "dogs", brand: "DoggyStyles", stock: 30, lowStockThreshold: 5 },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8492",
    customerName: "আরিফ রহমান",
    customerPhone: "01712345678",
    customerAddress: "গুলশান-১, ঢাকা",
    items: [
      { id: "1", name: "Premium Velvet Cat Collar (Forest Green)", price: 1200, quantity: 1 },
      { id: "cat_litter_premium", name: "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)", price: 850, quantity: 2 },
    ],
    subtotal: 2900,
    shippingFee: 60,
    grandTotal: 2960,
    paymentMethod: "cod",
    status: "Delivered",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-9304",
    customerName: "তাহমিদ হাসান",
    customerPhone: "01898765432",
    customerAddress: "মিরপুর-১০, ঢাকা",
    items: [
      { id: "leather_dog_leash", name: "লেদার ডগ লিশ ও হারনেস বেল্ট", price: 1100, quantity: 1 },
    ],
    subtotal: 1100,
    shippingFee: 60,
    grandTotal: 1160,
    paymentMethod: "mfs",
    status: "Shipped",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coupon-1",
    code: "EID2026",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscountCap: 500,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // active 5 days ago
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // expires in 10 days
    totalUsageLimit: 100,
    perUserUsageLimit: 1,
    usedCount: 2,
    applicableOn: "all",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "coupon-2",
    code: "MEOWFIXED",
    discountType: "fixed",
    discountValue: 200,
    minOrderAmount: 1500,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 50,
    perUserUsageLimit: 2,
    usedCount: 1,
    applicableOn: "category",
    applicableCategory: "cats",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_COUPON_USAGE: CouponUsage[] = [
  {
    id: "usage-1",
    couponId: "coupon-1",
    couponCode: "EID2026",
    orderId: "ORD-8492",
    customerPhone: "01712345678",
    discountAmount: 435, // 15% of collar + litter
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "usage-2",
    couponId: "coupon-2",
    couponCode: "MEOWFIXED",
    orderId: "ORD-9304",
    customerPhone: "01898765432",
    discountAmount: 200,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponUsageLogs, setCouponUsageLogs] = useState<CouponUsage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Helper function to log stock changes (defined early so hydration can reference it)
  const logStockChange = (
    productId: string,
    productName: string,
    variantId: string | undefined,
    variantDetails: string | undefined,
    quantityChanged: number,
    actionType: StockLog["actionType"],
    updatedBy: string
  ) => {
    const newLog: StockLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName,
      variantId,
      variantDetails,
      quantityChanged,
      actionType,
      updatedBy,
      createdAt: new Date().toISOString(),
    };
    setStockLogs((prev) => {
      const updated = [newLog, ...prev];
      localStorage.setItem("paws_stock_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Mount Hydration from LocalStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("paws_products");
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedOrders = localStorage.getItem("paws_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCart = localStorage.getItem("paws_cart");
      if (storedCart) setCartItems(JSON.parse(storedCart));

      const storedCustomers = localStorage.getItem("paws_customers");
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        const initial = generateMockCustomers();
        setCustomers(initial);
        localStorage.setItem("paws_customers", JSON.stringify(initial));
      }

      const storedLogs = localStorage.getItem("paws_stock_logs");
      if (storedLogs) {
        setStockLogs(JSON.parse(storedLogs));
      } else {
        setStockLogs(INITIAL_STOCK_LOGS);
        localStorage.setItem("paws_stock_logs", JSON.stringify(INITIAL_STOCK_LOGS));
      }

      const storedCoupons = localStorage.getItem("paws_coupons");
      if (storedCoupons) {
        setCoupons(JSON.parse(storedCoupons));
      } else {
        setCoupons(INITIAL_COUPONS);
        localStorage.setItem("paws_coupons", JSON.stringify(INITIAL_COUPONS));
      }

      const storedCouponUsage = localStorage.getItem("paws_coupon_usage");
      if (storedCouponUsage) {
        setCouponUsageLogs(JSON.parse(storedCouponUsage));
      } else {
        setCouponUsageLogs(INITIAL_COUPON_USAGE);
        localStorage.setItem("paws_coupon_usage", JSON.stringify(INITIAL_COUPON_USAGE));
      }
    } catch (error) {
      console.error("Error reading localStorage keys:", error);
    }
  }, []);

  // 2. Calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 3. Cart Operators
  const addToCart = (product: Product, variantId?: string) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.id === product.id && item.selectedVariantId === variantId
      );

      let availableStock = product.stock;
      let selectedSize: string | undefined;
      let selectedColor: string | undefined;

      if (variantId && product.variants) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          availableStock = variant.stock;
          selectedSize = variant.size;
          selectedColor = variant.color;
        }
      }

      if (availableStock <= 0) {
        alert("⚠️ দুঃখিত, এই পণ্যটি বা ভ্যারিয়েন্টটি স্টকে নেই!");
        return prevItems;
      }

      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= availableStock) {
        alert(`⚠️ দুঃখিত, সর্বোচ্চ স্টক সীমা (${availableStock}) অতিক্রম করা সম্ভব নয়!`);
        return prevItems;
      }

      let updated: CartItem[];
      if (existing) {
        updated = prevItems.map((item) =>
          item.id === product.id && item.selectedVariantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            selectedVariantId: variantId,
            selectedSize,
            selectedColor,
          },
        ];
      }
      localStorage.setItem("paws_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string, variantId?: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter(
        (item) => !(item.id === id && item.selectedVariantId === variantId)
      );
      localStorage.setItem("paws_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: string, delta: number, variantId?: string) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.id === id && item.selectedVariantId === variantId
      );
      if (!existing) return prevItems;

      let availableStock = existing.stock;
      if (variantId && existing.variants) {
        const variant = existing.variants.find((v) => v.id === variantId);
        if (variant) {
          availableStock = variant.stock;
        }
      }

      const newQty = existing.quantity + delta;
      if (newQty > availableStock) {
        alert(`⚠️ দুঃখিত, সর্বোচ্চ স্টক সীমা (${availableStock}) অতিক্রম করা সম্ভব নয়!`);
        return prevItems;
      }
      if (newQty < 1) return prevItems;

      const updated = prevItems.map((item) =>
        item.id === id && item.selectedVariantId === variantId
          ? { ...item, quantity: newQty }
          : item
      );
      localStorage.setItem("paws_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("paws_cart");
  };

  // 4. Products CRUD (Admin Panel actions)
  const addProduct = (newProduct: Omit<Product, "id">) => {
    const newStock = newProduct.stock !== undefined ? Number(newProduct.stock) : 0;
    const threshold = newProduct.lowStockThreshold !== undefined ? Number(newProduct.lowStockThreshold) : 5;
    
    let calculatedStock = newStock;
    if (newProduct.variants && newProduct.variants.length > 0) {
      calculatedStock = newProduct.variants.reduce((sum, v) => sum + Number(v.stock), 0);
    }

    const productWithId: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      stock: calculatedStock,
      lowStockThreshold: threshold,
    };
    setProducts((prev) => {
      const updated = [...prev, productWithId];
      localStorage.setItem("paws_products", JSON.stringify(updated));
      return updated;
    });

    // Log restock for the new product
    logStockChange(
      productWithId.id,
      productWithId.name,
      undefined,
      undefined,
      calculatedStock,
      "restock",
      "admin"
    );

    if (productWithId.variants) {
      productWithId.variants.forEach((v) => {
        logStockChange(
          productWithId.id,
          productWithId.name,
          v.id,
          `Size: ${v.size || ""}, Color: ${v.color || ""}`,
          v.stock,
          "restock",
          "admin"
        );
      });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("paws_products", JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Orders Management Actions
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    let oldOrder: Order | undefined;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === id) {
          oldOrder = { ...order };
          return { ...order, status };
        }
        return order;
      });
      localStorage.setItem("paws_orders", JSON.stringify(updated));
      return updated;
    });

    if (!oldOrder) return;

    // Detect Stock Changes based on transitions to/from Cancelled
    const wasCancelled = oldOrder.status === "Cancelled";
    const isCancelled = status === "Cancelled";

    if (!wasCancelled && isCancelled) {
      // Return Stock to inventory
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map((prod) => {
          const matchingItems = oldOrder?.items.filter((item) => item.id === prod.id) || [];
          if (matchingItems.length === 0) return prod;

          let updatedStock = prod.stock;
          let updatedVariants = prod.variants;

          matchingItems.forEach((orderItem) => {
            updatedStock += orderItem.quantity;
            if (orderItem.selectedVariantId && updatedVariants) {
              updatedVariants = updatedVariants.map((v) => {
                if (v.id === orderItem.selectedVariantId) {
                  logStockChange(
                    prod.id,
                    prod.name,
                    v.id,
                    `Size: ${v.size || ""}, Color: ${v.color || ""}`,
                    orderItem.quantity,
                    "cancel_return",
                    `order_cancel_${id}`
                  );
                  return { ...v, stock: v.stock + orderItem.quantity };
                }
                return v;
              });
              updatedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            } else {
              logStockChange(
                prod.id,
                prod.name,
                undefined,
                undefined,
                orderItem.quantity,
                "cancel_return",
                `order_cancel_${id}`
              );
            }
          });

          return {
            ...prod,
            stock: updatedStock,
            variants: updatedVariants,
          };
        });
        localStorage.setItem("paws_products", JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    } else if (wasCancelled && !isCancelled) {
      // Deduct stock again when re-instating a cancelled order
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map((prod) => {
          const matchingItems = oldOrder?.items.filter((item) => item.id === prod.id) || [];
          if (matchingItems.length === 0) return prod;

          let updatedStock = prod.stock;
          let updatedVariants = prod.variants;

          matchingItems.forEach((orderItem) => {
            updatedStock = Math.max(0, updatedStock - orderItem.quantity);
            if (orderItem.selectedVariantId && updatedVariants) {
              updatedVariants = updatedVariants.map((v) => {
                if (v.id === orderItem.selectedVariantId) {
                  logStockChange(
                    prod.id,
                    prod.name,
                    v.id,
                    `Size: ${v.size || ""}, Color: ${v.color || ""}`,
                    -orderItem.quantity,
                    "purchase",
                    `order_restore_${id}`
                  );
                  return { ...v, stock: Math.max(0, v.stock - orderItem.quantity) };
                }
                return v;
              });
              updatedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            } else {
              logStockChange(
                prod.id,
                prod.name,
                undefined,
                undefined,
                -orderItem.quantity,
                "purchase",
                `order_restore_${id}`
              );
            }
          });

          return {
            ...prod,
            stock: updatedStock,
            variants: updatedVariants,
          };
        });
        localStorage.setItem("paws_products", JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    }
  };

  const updateCustomerStatus = (id: string, status: "active" | "blocked") => {
    setCustomers((prev) => {
      const updated = prev.map((cust) =>
        cust.id === id ? { ...cust, status } : cust
      );
      localStorage.setItem("paws_customers", JSON.stringify(updated));
      return updated;
    });
  };

  const updateStock = (
    productId: string,
    variantId: string | null,
    newStock: number,
    actionType: StockLog["actionType"],
    updatedBy: string
  ) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((prod) => {
        if (prod.id !== productId) return prod;

        let oldStock = prod.stock;
        let updatedStock = prod.stock;
        let updatedVariants = prod.variants;

        if (variantId && prod.variants) {
          updatedVariants = prod.variants.map((v) => {
            if (v.id === variantId) {
              oldStock = v.stock;
              const diff = newStock - oldStock;
              logStockChange(
                prod.id,
                prod.name,
                v.id,
                `Size: ${v.size || ""}, Color: ${v.color || ""}`,
                diff,
                actionType,
                updatedBy
              );
              return { ...v, stock: newStock };
            }
            return v;
          });
          updatedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        } else {
          oldStock = prod.stock;
          const diff = newStock - oldStock;
          logStockChange(
            prod.id,
            prod.name,
            undefined,
            undefined,
            diff,
            actionType,
            updatedBy
          );
          updatedStock = newStock;
        }

        return {
          ...prod,
          stock: updatedStock,
          variants: updatedVariants,
        };
      });
      localStorage.setItem("paws_products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const bulkUpdateStock = (csvText: string) => {
    try {
      const lines = csvText.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        return { success: false, message: "CSV ফাইলে কোনো ডেটা পাওয়া যায়নি!", updatedCount: 0 };
      }

      const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
      const prodIdIdx = headers.indexOf("productid");
      const varIdIdx = headers.indexOf("variantid");
      const stockIdx = headers.indexOf("newstock");

      if (prodIdIdx === -1 || stockIdx === -1) {
        return {
          success: false,
          message: "CSV হেডার কলামে অবশ্যই ProductID এবং NewStock থাকতে হবে!",
          updatedCount: 0,
        };
      }

      let updatedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",").map((c) => c.trim());
        const productId = columns[prodIdIdx];
        const variantId = varIdIdx !== -1 && columns[varIdIdx] ? columns[varIdIdx] : null;
        const newStock = parseInt(columns[stockIdx], 10);

        if (!productId || isNaN(newStock)) continue;

        updateStock(productId, variantId, newStock, "restock", "admin_bulk_csv");
        updatedCount++;
      }

      return {
        success: true,
        message: `সফলভাবে ${updatedCount} টি পণ্যের স্টক আপডেট করা হয়েছে!`,
        updatedCount,
      };
    } catch (e) {
      console.error("Bulk CSV update error:", e);
      return { success: false, message: "CSV ফাইল পার্স করা যায়নি। সঠিক কলাম চেক করুন।", updatedCount: 0 };
    }
  };

  const validateCoupon = (code: string, phone: string): { success: boolean; message: string; discountAmount: number } => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, message: "কুপন কোডটি সঠিক নয়!", discountAmount: 0 };
    }

    if (!coupon.isActive) {
      return { success: false, message: "কুপনটি বর্তমানে নিষ্ক্রিয় রয়েছে।", discountAmount: 0 };
    }

    const now = new Date().toISOString();
    if (now < coupon.startDate) {
      return { success: false, message: "কুপনের মেয়াদ এখনো শুরু হয়নি।", discountAmount: 0 };
    }
    if (now > coupon.endDate) {
      return { success: false, message: "কুপনটির মেয়াদ শেষ হয়ে গেছে!", discountAmount: 0 };
    }

    if (coupon.usedCount >= coupon.totalUsageLimit) {
      return { success: false, message: "কুপনটি ব্যবহারের সর্বোচ্চ সীমা অতিক্রম করেছে।", discountAmount: 0 };
    }

    // Check per-user limit
    const userUsageCount = couponUsageLogs.filter(log => log.couponCode.toUpperCase() === code.trim().toUpperCase() && log.customerPhone === phone).length;
    if (userUsageCount >= coupon.perUserUsageLimit) {
      return { success: false, message: "আপনি ইতিমধ্যে এই কুপনটি সর্বোচ্চ সংখ্যক বার ব্যবহার করেছেন!", discountAmount: 0 };
    }

    // Check minimum order amount constraint
    if (cartTotal < coupon.minOrderAmount) {
      return { success: false, message: `এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${coupon.minOrderAmount} এর অর্ডার করতে হবে।`, discountAmount: 0 };
    }

    // Calculate discount amount based on applicableOn
    let applicableTotal = 0;
    if (coupon.applicableOn === "all") {
      applicableTotal = cartTotal;
    } else if (coupon.applicableOn === "category" && coupon.applicableCategory) {
      cartItems.forEach(item => {
        if (item.category === coupon.applicableCategory) {
          applicableTotal += item.price * item.quantity;
        }
      });
      if (applicableTotal <= 0) {
        return { success: false, message: `এই কুপনটি শুধুমাত্র "${coupon.applicableCategory === "cats" ? "বিড়াল" : coupon.applicableCategory === "dogs" ? "কুকুর" : "পাখি"}" ক্যাটাগরির পণ্যে প্রযোজ্য।`, discountAmount: 0 };
      }
    } else if (coupon.applicableOn === "product" && coupon.applicableProductIds) {
      cartItems.forEach(item => {
        if (coupon.applicableProductIds?.includes(item.id)) {
          applicableTotal += item.price * item.quantity;
        }
      });
      if (applicableTotal <= 0) {
        return { success: false, message: "এই কুপনটি আপনার কার্টের কোনো পণ্যে প্রযোজ্য নয়।", discountAmount: 0 };
      }
    }

    let discount = 0;
    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    } else {
      discount = (applicableTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
        discount = coupon.maxDiscountCap;
      }
    }

    // Cap at applicableTotal
    if (discount > applicableTotal) {
      discount = applicableTotal;
    }

    return { success: true, message: "কুপনটি সফলভাবে প্রয়োগ করা হয়েছে!", discountAmount: discount };
  };

  const applyCoupon = (code: string, phone: string) => {
    const res = validateCoupon(code, phone);
    if (res.success) {
      const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponDiscount(res.discountAmount);
      }
    } else {
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
    return { success: res.success, message: res.message };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const addCoupon = (newCoupon: Omit<Coupon, "id" | "usedCount" | "createdAt">) => {
    const id = `coupon-${Date.now()}`;
    const coupon: Coupon = {
      ...newCoupon,
      id,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    setCoupons(prev => {
      const updated = [...prev, coupon];
      localStorage.setItem("paws_coupons", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
      localStorage.setItem("paws_coupons", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem("paws_coupons", JSON.stringify(updated));
      return updated;
    });
  };

  const placeOrder = (
    name: string,
    phone: string,
    address: string,
    paymentMethod: "cod" | "mfs",
    area: "inside" | "outside"
  ): string => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomCode}`;
    const FREE_SHIPPING_THRESHOLD = 3000;
    const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : area === "inside" ? 60 : 120;
    
    let discount = 0;
    if (appliedCoupon) {
      const valRes = validateCoupon(appliedCoupon.code, phone);
      if (valRes.success) {
        discount = valRes.discountAmount;
      }
    }
    const grandTotal = cartTotal + shippingFee - discount;
    
    const newOrder: Order = {
      id: orderId,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      items: [...cartItems],
      subtotal: cartTotal,
      shippingFee,
      grandTotal,
      paymentMethod,
      status: "Received",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem("paws_orders", JSON.stringify(updated));
      return updated;
    });

    // Automatically deduct stock for items in cart
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((prod) => {
        const matchingCartItems = cartItems.filter((item) => item.id === prod.id);
        if (matchingCartItems.length === 0) return prod;

        let updatedStock = prod.stock;
        let updatedVariants = prod.variants;

        matchingCartItems.forEach((cartItem) => {
          updatedStock = Math.max(0, updatedStock - cartItem.quantity);
          if (cartItem.selectedVariantId && updatedVariants) {
            updatedVariants = updatedVariants.map((v) => {
              if (v.id === cartItem.selectedVariantId) {
                logStockChange(
                  prod.id,
                  prod.name,
                  v.id,
                  `Size: ${v.size || ""}, Color: ${v.color || ""}`,
                  -cartItem.quantity,
                  "purchase",
                  `customer_order_${orderId}`
                );
                return { ...v, stock: Math.max(0, v.stock - cartItem.quantity) };
              }
              return v;
            });
            updatedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
          } else {
            logStockChange(
              prod.id,
              prod.name,
              undefined,
              undefined,
              -cartItem.quantity,
              "purchase",
              `customer_order_${orderId}`
            );
          }
        });

        return {
          ...prod,
          stock: updatedStock,
          variants: updatedVariants,
        };
      });
      localStorage.setItem("paws_products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Automatically update/create customer
    setCustomers((prev) => {
      const existingIdx = prev.findIndex((c) => c.phone === phone);
      let updated: Customer[];
      if (existingIdx > -1) {
        updated = prev.map((c, idx) => {
          if (idx === existingIdx) {
            const hasAddress = c.shippingAddresses.includes(address);
            return {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + grandTotal,
              shippingAddresses: hasAddress ? c.shippingAddresses : [...c.shippingAddresses, address],
              lastLoginDate: new Date().toISOString(),
            };
          }
          return c;
        });
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name,
          email: `${phone}@example.com`,
          phone,
          shippingAddresses: [address],
          totalOrders: 1,
          totalSpent: grandTotal,
          signupDate: new Date().toISOString(),
          status: "active",
          emailVerified: false,
          phoneVerified: true,
          lastLoginDate: new Date().toISOString(),
        };
        updated = [...prev, newCust];
      }
      localStorage.setItem("paws_customers", JSON.stringify(updated));
      return updated;
    });

    // Record Coupon usage if applied
    if (appliedCoupon && discount > 0) {
      setCoupons(prev => {
        const updated = prev.map(c => c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c);
        localStorage.setItem("paws_coupons", JSON.stringify(updated));
        return updated;
      });

      const newUsageLog: CouponUsage = {
        id: `usage-${Date.now()}`,
        couponId: appliedCoupon.id,
        couponCode: appliedCoupon.code,
        orderId,
        customerPhone: phone,
        discountAmount: discount,
        createdAt: new Date().toISOString()
      };
      setCouponUsageLogs(prev => {
        const updated = [newUsageLog, ...prev];
        localStorage.setItem("paws_coupon_usage", JSON.stringify(updated));
        return updated;
      });
    }

    setAppliedCoupon(null);
    setCouponDiscount(0);
    clearCart();
    return orderId;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        cartItems,
        cartCount,
        cartTotal,
        customers,
        stockLogs,
        coupons,
        couponUsageLogs,
        appliedCoupon,
        couponDiscount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        updateCustomerStatus,
        updateStock,
        bulkUpdateStock,
        placeOrder,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopContextType {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
