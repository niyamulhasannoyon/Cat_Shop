"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, ShopContextType } from "@/types";

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Velvet Cat Collar (Forest Green)", price: 1200, category: "cats", brand: "Pawsome" },
  { id: "2", name: "Organic Salmon Grain-Free Food (1.5kg)", price: 1250, category: "cats", brand: "MeowMix" },
  { id: "cat_litter_premium", name: "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)", price: 850, category: "cats", brand: "Pawsome" },
  { id: "leather_dog_leash", name: "লেদার ডগ লিশ ও হারনেস বেল্ট", price: 1100, category: "dogs", brand: "Pawsome" },
  { id: "dog_shampoo", name: "অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার", price: 650, category: "dogs", brand: "DoggyStyles" },
  { id: "bird_feed_mix", name: "প্রিমিয়াম সিড মিক্স পাখির খাবার (১ কেজি)", price: 450, category: "birds", brand: "Pawsome" },
  { id: "bird_cage_swing", name: "পাখির খাঁচার খেলনা ও দোলনা", price: 350, category: "birds", brand: "Pawsome" },
  { id: "cat_nip_spray", name: "অর্গানিক ক্যাটনিপ স্প্রে (১০০ মিলি)", price: 550, category: "cats", brand: "MeowMix" },
  { id: "dog_chew_toy", name: "ডেন্টাল ডগ চিউ টয়", price: 400, category: "dogs", brand: "DoggyStyles" },
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

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 1. Mount Hydration from LocalStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("paws_products");
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedOrders = localStorage.getItem("paws_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCart = localStorage.getItem("paws_cart");
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } catch (error) {
      console.error("Error reading localStorage keys:", error);
    }
  }, []);

  // 2. Calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 3. Cart Operators
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prevItems, { ...product, quantity: 1 }];
      }
      localStorage.setItem("paws_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("paws_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
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
    const productWithId: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => {
      const updated = [...prev, productWithId];
      localStorage.setItem("paws_products", JSON.stringify(updated));
      return updated;
    });
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
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === id ? { ...order, status } : order
      );
      localStorage.setItem("paws_orders", JSON.stringify(updated));
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
    
    const newOrder: Order = {
      id: orderId,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      items: [...cartItems],
      subtotal: cartTotal,
      shippingFee,
      grandTotal: cartTotal + shippingFee,
      paymentMethod,
      status: "Received",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem("paws_orders", JSON.stringify(updated));
      return updated;
    });

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
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        placeOrder,
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
