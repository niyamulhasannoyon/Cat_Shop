"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Product, Order } from "@/types";

type TabType = "dashboard" | "products" | "orders" | "bundles" | "audit_logs" | "staff";

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus,
    stockLogs,
    updateStock,
    bulkUpdateStock,
    refundLogs,
    initiateRefund,
    updateOrderPayment,
    updateOrderCourier,
    activeStaff,
    staffList,
    staffLogs,
    addStaff
  } = useShop();
  
  // Allowed Navigation Tabs based on Staff Role
  const allowedTabs = useMemo(() => {
    const role = activeStaff?.role || "Support";
    if (role === "Super Admin") {
      return [
        { id: "dashboard" as const, label: "📊 ড্যাশবোর্ড", desc: "স্টোর অ্যানালিটিক্স" },
        { id: "products" as const, label: "📦 পণ্য CRUD", desc: "পণ্য তালিকা ও সংযোজন" },
        { id: "orders" as const, label: "📋 অর্ডার ম্যানেজার", desc: "গ্রাহক অর্ডার ও স্ট্যাটাস" },
        { id: "bundles" as const, label: "🏷️ বান্ডেল অফার", desc: "সক্রিয় কম্বো সমূহ" },
        { id: "audit_logs" as const, label: "🪵 স্টক লগস", desc: "স্টক অডিট হিস্ট্রি" },
        { id: "staff" as const, label: "👥 স্টাফ ও রোলস", desc: "স্টাফ অ্যাকাউন্ট ও লগস" },
      ];
    }
    if (role === "Manager") {
      return [
        { id: "dashboard" as const, label: "📊 ড্যাশবোর্ড", desc: "স্টোর অ্যানালিটিক্স" },
        { id: "products" as const, label: "📦 পণ্য CRUD", desc: "পণ্য তালিকা ও সংযোজন" },
        { id: "orders" as const, label: "📋 অর্ডার ম্যানেজার", desc: "গ্রাহক অর্ডার ও স্ট্যাটাস" },
        { id: "audit_logs" as const, label: "🪵 স্টক লগস", desc: "স্টক অডিট হিস্ট্রি" },
      ];
    }
    // Support
    return [
      { id: "orders" as const, label: "📋 অর্ডার ম্যানেজার", desc: "গ্রাহক অর্ডার ও স্ট্যাটাস" },
    ];
  }, [activeStaff]);

  // Read active tab from URL param (set by sidebar links)
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") as TabType | null;

  const activeTab: TabType = useMemo(() => {
    const defaultTab = allowedTabs[0]?.id || "orders";
    if (!rawTab) return defaultTab;
    if (allowedTabs.some(t => t.id === rawTab)) return rawTab;
    return defaultTab;
  }, [rawTab, allowedTabs]);

  const setActiveTab = (tab: TabType) => {
    router.push(`/admin?tab=${tab}`);
  };

  // Order Details Modal and refund states
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState("");
  const [refundReasonInput, setRefundReasonInput] = useState("");
  const [refundMethodInput, setRefundMethodInput] = useState("bkash");
  const [showRefundForm, setShowRefundForm] = useState(false);

  // Staff Management State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"Super Admin" | "Manager" | "Support">("Support");

  const [courierInput, setCourierInput] = useState<"Pathao" | "RedX" | "Steadfast" | "Own delivery">("Pathao");
  const [trackingInput, setTrackingInput] = useState("");
  const [paymentStatusInput, setPaymentStatusInput] = useState<"Paid" | "Unpaid" | "Partial">("Unpaid");
  const [transactionIdInput, setTransactionIdInput] = useState("");

  const handleOpenOrderModal = (order: Order) => {
    setActiveOrderModal(order);
    setPaymentStatusInput(order.paymentStatus || "Unpaid");
    setTransactionIdInput(order.transactionId || "");
    setCourierInput(order.courierPartner || "Pathao");
    setTrackingInput(order.trackingNumber || "");
    setRefundAmountInput(order.grandTotal.toString());
    setRefundReasonInput("");
    setRefundMethodInput(order.paymentMethod === "cod" ? "cash" : order.paymentMethod);
    setShowRefundForm(false);
  };

  const handleStatusChange = (order: Order, newStatus: Order["status"]) => {
    if (newStatus === "Shipped") {
      if (!order.courierPartner || !order.trackingNumber) {
        alert("⚠️ অর্ডারটি Shipped করতে হলে অবশ্যই কুরিয়ার পার্টনার ও ট্র্যাকিং নম্বর নির্ধারণ করতে হবে! দয়া করে 'বিস্তারিত' বাটনে ক্লিক করে কুরিয়ার ইনফরমেশন যুক্ত করুন।");
        return;
      }
    }
    updateOrderStatus(order.id, newStatus);
  };

  // Stock inventory states
  const [restockInputs, setRestockInputs] = useState<{ [key: string]: string }>({});
  
  // Add Product Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cats");
  const [newProdBrand, setNewProdBrand] = useState("Pawsome");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  
  // Inventory form states
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdThreshold, setNewProdThreshold] = useState("5");
  const [variantInputs, setVariantInputs] = useState<Array<{ size: string; color: string; stock: number }>>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");

  // Tab is now driven by URL - no manual window.location parsing needed



  // Date range filter states
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "custom">("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; sales: number } | null>(null);

  // Filter orders by date range dynamically
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateFilter === "today") {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return orderDate >= todayStart;
      }
      if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      }
      if (dateFilter === "custom") {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        }
      }
      return true;
    });
  }, [orders, dateFilter, customStartDate, customEndDate]);

  // Business Analytics Calculations based on filteredOrders
  const totalOrders = filteredOrders.length;
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.grandTotal, 0);
  const avgBasketSize = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  
  const totalItemsSold = filteredOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  // New Metrics from filtered list
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const refundsThisMonth = useMemo(() => {
    return refundLogs.filter(log => {
      const d = new Date(log.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, log) => sum + log.refundAmount, 0);
  }, [refundLogs, currentMonth, currentYear]);

  const pendingPayments = useMemo(() => {
    return filteredOrders.filter(o => o.paymentStatus !== "Paid" && o.status !== "Cancelled").reduce((sum, o) => sum + o.grandTotal, 0);
  }, [filteredOrders]);

  // wholesale cost, profit & margin calculation
  const totalCost = useMemo(() => {
    return filteredOrders.reduce((acc, order) => {
      if (order.status === "Cancelled") return acc;
      const orderItemCost = order.items.reduce((itemAcc, item) => {
        const prod = products.find(p => p.id === item.id);
        const wholesaleCost = prod?.costPrice || item.price * 0.6;
        return itemAcc + (item.quantity * wholesaleCost);
      }, 0);
      return acc + orderItemCost;
    }, 0);
  }, [filteredOrders, products]);

  const totalProfit = Math.max(0, totalSales - totalCost);
  const profitMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;

  // Sales Trend line chart parsing
  const salesChartData = useMemo(() => {
    const now = new Date();
    let daysToGenerate = 30;
    if (dateFilter === "today") daysToGenerate = 1;
    else if (dateFilter === "week") daysToGenerate = 7;
    else if (dateFilter === "month") daysToGenerate = 30;
    else if (dateFilter === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      daysToGenerate = Math.max(1, Math.min(60, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))));
    }

    const dataPoints: { label: string; sales: number }[] = [];
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      let d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      if (dateFilter === "custom" && customEndDate) {
        const end = new Date(customEndDate);
        d = new Date(end.getTime() - i * 24 * 60 * 60 * 1000);
      }
      
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const daySales = filteredOrders
        .filter(o => {
          const od = new Date(o.createdAt);
          return od >= dayStart && od <= dayEnd;
        })
        .reduce((sum, o) => sum + o.grandTotal, 0);

      const label = d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
      dataPoints.push({ label, sales: daySales });
    }
    return dataPoints;
  }, [filteredOrders, dateFilter, customStartDate, customEndDate]);

  // Category Breakdown chart parsing
  const categorySales = useMemo(() => {
    const breakdown: { [key: string]: number } = { cats: 0, dogs: 0, birds: 0 };
    filteredOrders.forEach(o => {
      if (o.status === "Cancelled") return;
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        const cat = prod?.category || "cats";
        breakdown[cat] = (breakdown[cat] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [filteredOrders, products]);

  const totalCatSales = useMemo(() => categorySales.reduce((acc, c) => acc + c.value, 0), [categorySales]);

  const donutSlices = useMemo(() => {
    let accumulatedPercent = 0;
    return categorySales.map((c, idx) => {
      const percent = totalCatSales > 0 ? c.value / totalCatSales : 0;
      const strokeLength = percent * 251.2;
      const strokeOffset = 251.2 - (accumulatedPercent * 251.2) + 62.8; 
      accumulatedPercent += percent;
      
      const colors = ["#2D5A27", "#F59E0B", "#EF4444", "#3B82F6"]; 
      return {
        ...c,
        color: colors[idx % colors.length],
        strokeDash: `${strokeLength} 251.2`,
        strokeOffset,
        percent: Math.round(percent * 100)
      };
    });
  }, [categorySales, totalCatSales]);

  // Customer retention acquisition trend
  const customerSplit = useMemo(() => {
    let newCustomers = 0;
    let returningCustomers = 0;
    const seenPhonesInFiltered = new Set<string>();

    filteredOrders.forEach(o => {
      if (seenPhonesInFiltered.has(o.customerPhone)) {
        returningCustomers++;
        return;
      }
      seenPhonesInFiltered.add(o.customerPhone);
      
      const earliestFilteredDate = filteredOrders.length > 0 
        ? Math.min(...filteredOrders.map(fo => new Date(fo.createdAt).getTime()))
        : Date.now();
      
      const hasPriorOrder = orders.some(prior => {
        return prior.customerPhone === o.customerPhone && new Date(prior.createdAt).getTime() < earliestFilteredDate;
      });

      if (hasPriorOrder) {
        returningCustomers++;
      } else {
        newCustomers++;
      }
    });

    const total = newCustomers + returningCustomers;
    return {
      newCount: newCustomers,
      returningCount: returningCustomers,
      newPercent: total > 0 ? Math.round((newCustomers / total) * 100) : 50,
      returningPercent: total > 0 ? Math.round((returningCustomers / total) * 100) : 50
    };
  }, [filteredOrders, orders]);

  // Top selling products list
  const topProducts = useMemo(() => {
    const productStats: { [key: string]: { id: string; name: string; quantity: number; revenue: number } } = {};
    filteredOrders.forEach(o => {
      if (o.status === "Cancelled") return;
      o.items.forEach(item => {
        if (!productStats[item.id]) {
          productStats[item.id] = { id: item.id, name: item.name, quantity: 0, revenue: 0 };
        }
        productStats[item.id].quantity += item.quantity;
        productStats[item.id].revenue += item.price * item.quantity;
      });
    });
    
    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); 
  }, [filteredOrders]);

  const handleExportCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Paws&Co. Analytics Report\n";
    csvContent += `Filter Range: ${dateFilter.toUpperCase()}\n`;
    csvContent += `Generated At: ${new Date().toLocaleString()}\n\n`;
    csvContent += "SUMMARY METRICS\n";
    csvContent += `Total Sales,${totalSales}\n`;
    csvContent += `Total Orders,${totalOrders}\n`;
    csvContent += `Avg Basket Size,${avgBasketSize}\n`;
    csvContent += `Total Items Sold,${totalItemsSold}\n`;
    csvContent += `Pending Payments,${pendingPayments}\n`;
    csvContent += `Total wholesale cost,${totalCost}\n`;
    csvContent += `Total Net Profit,${totalProfit}\n`;
    csvContent += `Net profit margin,${profitMargin}%\n\n`;
    
    csvContent += "TOP SELLING PRODUCTS\n";
    csvContent += "Product Name,Quantity Sold,Revenue Generated\n";
    topProducts.forEach(p => {
      csvContent += `"${p.name.replace(/"/g, '""')}",${p.quantity},${p.revenue}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paws_analytics_report_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!newProdName.trim()) {
      setFormError("পণ্যের নাম আবশ্যিক।");
      return;
    }
    const priceNum = Number(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("দয়া করে সঠিক মূল্য নির্ধারণ করুন।");
      return;
    }

    addProduct({
      name: newProdName.trim(),
      price: priceNum,
      category: newProdCategory,
      brand: newProdBrand,
      description: newProdDesc.trim(),
      imageUrl: newProdImage.trim() || undefined,
      stock: Number(newProdStock),
      lowStockThreshold: Number(newProdThreshold),
      variants: variantInputs.length > 0
        ? variantInputs.map((v, idx) => ({ id: `var-${Date.now()}-${idx}`, ...v }))
        : undefined
    });

    // Reset Form
    setNewProdName("");
    setNewProdPrice("");
    setNewProdCategory("cats");
    setNewProdBrand("Pawsome");
    setNewProdDesc("");
    setNewProdImage("");
    setNewProdStock("10");
    setNewProdThreshold("5");
    setVariantInputs([]);
    setShowAddForm(false);
    alert("🎉 নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!");
  };

  // CSV Bulk Upload Handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = bulkUpdateStock(text);
      alert(res.message);
    };
    reader.readAsText(file);
  };

  const lowStockItems = useMemo(() => {
    const list: Array<{
      productId: string;
      productName: string;
      variantId?: string;
      variantDetails?: string;
      stock: number;
      threshold: number;
    }> = [];

    products.forEach((prod) => {
      const threshold = prod.lowStockThreshold || 5;
      if (prod.variants && prod.variants.length > 0) {
        prod.variants.forEach((v) => {
          if (v.stock <= threshold) {
            list.push({
              productId: prod.id,
              productName: prod.name,
              variantId: v.id,
              variantDetails: `Size: ${v.size || ""}, Color: ${v.color || ""}`,
              stock: v.stock,
              threshold,
            });
          }
        });
      } else {
        if (prod.stock <= threshold) {
          list.push({
            productId: prod.id,
            productName: prod.name,
            stock: prod.stock,
            threshold,
          });
        }
      }
    });

    return list;
  }, [products]);

  // Tab label lookup
  const activeTabLabel = allowedTabs.find(t => t.id === activeTab)?.label || "ড্যাশবোর্ড";

  return (
    <div className="flex-1 flex flex-col min-h-screen text-brand-charcoal antialiased">

      {/* Page Header Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5E0D8] px-6 pt-16 pb-4 lg:pt-5 lg:pb-4 sticky top-0 z-20 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-brand-charcoal">{activeTabLabel}</h2>
          <p className="text-[10px] text-stone-400 font-medium mt-0.5">
            {allowedTabs.find(t => t.id === activeTab)?.desc || ""}
          </p>
        </div>
        {/* Quick tab pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {allowedTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-brand-forest text-white shadow-sm"
                  : "bg-[#F0EDE6] text-stone-500 hover:text-brand-charcoal hover:bg-[#E5E0D8]"
              }`}
            >
              {tab.label.replace(/^[^ ]+ /, "")}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full py-6 px-4 sm:px-6">
        
        {/* TAB 1: DASHBOARD ANALYTICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Date Range Selector & Report Actions Header */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {(["today", "week", "month", "custom"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setDateFilter(filter);
                      setHoveredPoint(null);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      dateFilter === filter
                        ? "bg-brand-forest border-brand-forest text-brand-beige"
                        : "bg-white border-brand-beige-dark text-brand-charcoal hover:bg-brand-beige"
                    }`}
                  >
                    {filter === "today" ? "আজকের রিপোর্ট" : filter === "week" ? "এই সপ্তাহের" : filter === "month" ? "এই মাসের" : "কাস্টম রেঞ্জ"}
                  </button>
                ))}

                {dateFilter === "custom" && (
                  <div className="flex items-center gap-1.5 ml-2 animate-fadeIn">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-brand-beige border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400">থেকে</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-brand-beige border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCSVReport}
                  className="bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-beige px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  📥 এক্সেল/CSV রিপোর্ট
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white hover:bg-brand-beige border border-brand-beige-dark text-brand-charcoal px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  📄 PDF / প্রিন্ট করুন
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Sales card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">মোট বিক্রয়</span>
                  <p className="text-xl font-black text-brand-forest">৳{totalSales.toLocaleString("bn-BD")}</p>
                  <p className="text-[9px] text-stone-400 font-light">সফল অর্ডারের যোগফল</p>
                </div>
                <div className="p-2 bg-brand-forest/5 text-brand-forest rounded-xl border border-brand-forest/10 text-base font-bold">
                  ৳
                </div>
              </div>

              {/* Orders card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">মোট অর্ডার</span>
                  <p className="text-xl font-black text-brand-charcoal">{totalOrders} টি</p>
                  <p className="text-[9px] text-stone-400 font-light">তারিখ অনুযায়ী অর্ডার সংখ্যা</p>
                </div>
                <div className="p-2 bg-stone-100 text-brand-charcoal rounded-xl border border-stone-200 text-base font-bold">
                  📋
                </div>
              </div>

              {/* Basket Size card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">গড় অর্ডার মূল্য</span>
                  <p className="text-xl font-black text-brand-charcoal">৳{avgBasketSize.toLocaleString("bn-BD")}</p>
                  <p className="text-[9px] text-stone-400 font-light">প্রতি অর্ডারের গড় খরচ</p>
                </div>
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-base font-bold">
                  ⚖️
                </div>
              </div>

              {/* Items sold card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">বিক্রীত আইটেম</span>
                  <p className="text-xl font-black text-brand-forest">{totalItemsSold} টি</p>
                  <p className="text-[9px] text-stone-400 font-light">পরিমাণ অনুযায়ী গণনা</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-base font-bold">
                  📦
                </div>
              </div>

              {/* Pending Payments card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">বাকি পেমেন্ট</span>
                  <p className="text-xl font-black text-amber-600">৳{pendingPayments.toLocaleString("bn-BD")}</p>
                  <p className="text-[9px] text-stone-400 font-light">বকেয়া বিলের মোট পরিমাণ</p>
                </div>
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-base font-bold">
                  ⏳
                </div>
              </div>

              {/* Refunds This Month card */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block font-semibold text-red-650">রিফান্ড (চলতি মাস)</span>
                  <p className="text-xl font-black text-red-700">৳{refundsThisMonth.toLocaleString("bn-BD")}</p>
                  <p className="text-[9px] text-stone-400 font-light">সব রিফান্ডের মোট পরিমাণ</p>
                </div>
                <div className="p-2 bg-red-50 text-red-700 rounded-xl border border-red-100 text-base font-bold">
                  💸
                </div>
              </div>

            </div>

            {/* Charts Section: Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sales Trend Line Chart (Spans 2 cols) */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-brand-charcoal">বিক্রয়ের ট্রেন্ড এনালাইসিস (Sales Trend)</h3>
                    <p className="text-[10px] text-stone-450 text-stone-400">ফিল্টার অনুযায়ী গ্রাফিকাল সেলস রিপোর্ট</p>
                  </div>
                  {hoveredPoint && (
                    <span className="bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-[10px] font-bold px-2 py-0.5 rounded-lg animate-fadeIn">
                      {hoveredPoint.label}: ৳{hoveredPoint.sales.toLocaleString("bn-BD")}
                    </span>
                  )}
                </div>

                <div className="relative h-60 w-full flex items-end justify-center pt-6">
                  {salesChartData.length > 0 ? (
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2D5A27" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="35" y1="25" x2="565" y2="25" stroke="#EAEAEA" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="35" y1="80" x2="565" y2="80" stroke="#EAEAEA" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="35" y1="135" x2="565" y2="135" stroke="#EAEAEA" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="35" y1="165" x2="565" y2="165" stroke="#D1D5DB" strokeWidth="1" />

                      {/* Area */}
                      {(() => {
                        const maxSales = Math.max(...salesChartData.map(dp => dp.sales), 100);
                        const points = salesChartData.map((d, index) => {
                          const x = 35 + (index / (salesChartData.length - 1 || 1)) * 530;
                          const y = 165 - (d.sales / maxSales) * 140;
                          return { x, y, label: d.label, sales: d.sales };
                        });
                        const linePath = points.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");
                        const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} 165 L ${points[0].x} 165 Z` : "";
                        return (
                          <>
                            {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
                            {linePath && <path d={linePath} fill="none" stroke="#2D5A27" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                            
                            {/* Hover Interactive Dots */}
                            {points.map((p, idx) => (
                              <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#2D5A27"
                                stroke="#FFFFFF"
                                strokeWidth="1.5"
                                className="cursor-pointer hover:r-6 transition-all"
                                onMouseEnter={() => setHoveredPoint(p)}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  ) : (
                    <p className="text-stone-400 text-xs text-center py-20">চার্ট লোড করার মতো পর্যাপ্ত তথ্য নেই।</p>
                  )}
                </div>
                {/* X Axis Labels */}
                <div className="flex justify-between text-[8px] sm:text-[10px] text-stone-400 font-bold px-8 pt-1">
                  <span>{salesChartData[0]?.label || ""}</span>
                  <span>{salesChartData[Math.floor(salesChartData.length / 2)]?.label || ""}</span>
                  <span>{salesChartData[salesChartData.length - 1]?.label || ""}</span>
                </div>
              </div>

              {/* Category-wise Sales Breakdown Donut Chart */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-1 space-y-4">
                <div className="border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">ক্যাটেগরি বিক্রয় শেয়ার (Category Share)</h3>
                  <p className="text-[10px] text-stone-400">পোষা প্রাণীদের ক্যাটেগরি অনুযায়ী মোট রেভিনিউ শেয়ার</p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                  {totalCatSales > 0 ? (
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                        {donutSlices.map((slice, idx) => (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="10"
                            strokeDasharray={slice.strokeDash}
                            strokeDashoffset={slice.strokeOffset}
                            className="transition-all duration-500"
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-stone-400">সর্বমোট</span>
                        <span className="text-xs font-black text-brand-forest">৳{totalCatSales.toLocaleString("bn-BD")}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-stone-200 animate-spin" />
                  )}

                  {/* Legends */}
                  <div className="w-full text-[10px] font-bold text-stone-500 space-y-1">
                    {donutSlices.map((slice, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} />
                          <span className="capitalize">{slice.name === "cats" ? "বিড়াল (Cats)" : slice.name === "dogs" ? "কুকুর (Dogs)" : "পাখি ও অন্যান্য"}</span>
                        </div>
                        <span className="text-brand-charcoal font-black">{slice.percent}% (৳{slice.value.toLocaleString("bn-BD")})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Charts Section: Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profit Margins & Cost Analysis */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">লাভ-ক্ষতি ও মার্জিন (Profit Margins)</h3>
                  <p className="text-[10px] text-stone-400">রাজস্ব, ক্রয় মূল্য ও নিট লাভ তুলনা বিশ্লেষণ</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-brand-beige/20 p-2.5 rounded-lg border border-brand-beige-dark">
                      <p className="text-[9px] font-bold text-stone-400 block uppercase">রাজস্ব (Revenue)</p>
                      <p className="text-xs font-black text-brand-forest mt-1">৳{totalSales.toLocaleString("bn-BD")}</p>
                    </div>
                    <div className="bg-red-50/20 p-2.5 rounded-lg border border-red-100">
                      <p className="text-[9px] font-bold text-red-400 block uppercase">ক্রয়মূল্য (Cost)</p>
                      <p className="text-xs font-black text-red-700 mt-1">৳{totalCost.toLocaleString("bn-BD")}</p>
                    </div>
                    <div className="bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100">
                      <p className="text-[9px] font-bold text-emerald-500 block uppercase">নিট লাভ (Profit)</p>
                      <p className="text-xs font-black text-emerald-800 mt-1">৳{totalProfit.toLocaleString("bn-BD")}</p>
                    </div>
                  </div>

                  {/* Progress Gauge */}
                  <div className="bg-brand-beige/10 p-4 rounded-xl border border-brand-beige-dark space-y-2.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>নিট লাভ মার্জিন (Net Profit Margin):</span>
                      <span className="text-emerald-700 font-extrabold">{profitMargin}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${profitMargin}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-stone-400 font-light mt-0.5">অর্ডারের গড় মুনাফার হার {profitMargin}% যা খুবই সন্তোষজনক।</p>
                  </div>
                </div>
              </div>

              {/* Customer Acquisition (New vs Returning) */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">গ্রাহক রিটেনশন রিপোর্ট (Acquisition)</h3>
                  <p className="text-[10px] text-stone-400">নতুন বনাম নিয়মিত খরিদ্দার বিশ্লেষণ রিপোর্ট</p>
                </div>

                <div className="space-y-6 pt-4">
                  {/* Split Visual Meter */}
                  <div className="flex w-full h-8 rounded-xl overflow-hidden border border-brand-beige-dark text-[9px] font-black text-white text-center">
                    {customerSplit.newPercent > 0 && (
                      <div 
                        className="bg-brand-forest flex items-center justify-center transition-all" 
                        style={{ width: `${customerSplit.newPercent}%` }}
                        title={`নতুন খরিদ্দার: ${customerSplit.newCount}টি`}
                      >
                        নতুন ({customerSplit.newPercent}%)
                      </div>
                    )}
                    {customerSplit.returningPercent > 0 && (
                      <div 
                        className="bg-amber-500 flex items-center justify-center transition-all" 
                        style={{ width: `${customerSplit.returningPercent}%` }}
                        title={`নিয়মিত খরিদ্দার: ${customerSplit.returningCount}টি`}
                      >
                        নিয়মিত ({customerSplit.returningPercent}%)
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <span className="w-2.5 h-2.5 bg-brand-forest rounded-full" />
                        <span>নতুন গ্রাহক (New Customers)</span>
                      </div>
                      <p className="text-lg font-black text-brand-charcoal pl-4">{customerSplit.newCount} জন</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                        <span>নিয়মিত গ্রাহক (Returning)</span>
                      </div>
                      <p className="text-lg font-black text-brand-charcoal pl-4">{customerSplit.returningCount} জন</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Selling Products List */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">সেরা বিক্রিত পণ্য (Top Products)</h3>
                  <p className="text-[10px] text-stone-400">এই সময়সীমায় সর্বোচ্চ বিক্রয়কৃত ৫টি পোষা সামগ্রী</p>
                </div>

                <div className="space-y-3.5 pt-2 text-xs">
                  {topProducts.length > 0 ? (
                    topProducts.map((p, idx) => {
                      const maxRevenue = Math.max(...topProducts.map(t => t.revenue), 1);
                      const percentWidth = (p.revenue / maxRevenue) * 100;
                      return (
                        <div key={p.id} className="space-y-1.5">
                          <div className="flex justify-between font-bold text-brand-charcoal">
                            <span className="truncate max-w-[150px]">{idx + 1}. {p.name}</span>
                            <span className="font-extrabold text-brand-forest">৳{p.revenue.toLocaleString("bn-BD")} ({p.quantity}x)</span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-brand-forest h-2 rounded-full" 
                              style={{ width: `${percentWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-stone-400 text-center py-8">কোনো প্রোডাক্ট বিক্রির ডাটা পাওয়া যায়নি।</p>
                  )}
                </div>
              </div>

            </div>

            {/* Sub details charts & recent timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-1 space-y-6">
                <h3 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">অর্ডার স্ট্যাটাস রিপোর্ট</h3>
                
                {(() => {
                  const getCount = (status: Order["status"]) => filteredOrders.filter((o) => o.status === status).length;
                  const received = getCount("Received");
                  const processing = getCount("Processing");
                  const shipped = getCount("Shipped");
                  const delivered = getCount("Delivered");

                  const getPercentage = (count: number) => (totalOrders > 0 ? (count / totalOrders) * 100 : 0);

                  return (
                    <div className="space-y-4 text-xs font-semibold text-brand-charcoal">
                      {/* Received */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Received ({received}টি)</span>
                          <span>{Math.round(getPercentage(received))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-stone-500 h-2.5 rounded-full" style={{ width: `${getPercentage(received)}%` }} />
                        </div>
                      </div>

                      {/* Processing */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Processing ({processing}টি)</span>
                          <span>{Math.round(getPercentage(processing))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${getPercentage(processing)}%` }} />
                        </div>
                      </div>

                      {/* Shipped */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Shipped ({shipped}টি)</span>
                          <span>{Math.round(getPercentage(shipped))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${getPercentage(shipped)}%` }} />
                        </div>
                      </div>

                      {/* Delivered */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-light">
                          <span>Delivered ({delivered}টি)</span>
                          <span>{Math.round(getPercentage(delivered))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-brand-forest h-2.5 rounded-full" style={{ width: `${getPercentage(delivered)}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Recent Activities Timeline */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <h3 className="text-sm font-bold text-brand-charcoal">সাম্প্রতিক কার্যক্রম</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-[11px] font-semibold text-brand-forest hover:underline cursor-pointer">
                    সব অর্ডার দেখুন →
                  </button>
                </div>

                <div className="flow-root">
                  <ul className="-mb-8">
                    {filteredOrders.slice(0, 4).map((order, idx) => (
                      <li key={order.id}>
                        <div className="relative pb-8">
                          {idx !== filteredOrders.slice(0, 4).length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-brand-beige-dark" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3 items-start">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white text-xs ${
                                order.status === "Delivered" 
                                  ? "bg-brand-forest/10 text-brand-forest border border-brand-forest/20" 
                                  : order.status === "Shipped" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}>
                                📦
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-xs font-semibold text-brand-charcoal">
                                  নতুন অর্ডার {order.id} তৈরি হয়েছে -{" "}
                                  <span className="font-normal text-stone-500">{order.customerName} (৳{order.grandTotal})</span>
                                </p>
                              </div>
                              <div className="text-right text-[10px] whitespace-nowrap text-stone-400 font-light">
                                {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Low Stock Alert Widget */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
              <div className="border-b border-brand-beige-dark pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-650 flex items-center gap-1.5">
                  ⚠️ স্টক সতর্কতা (Low Stock Alerts)
                </h3>
                <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {lowStockItems.length}টি পণ্য রি-স্টক করা প্রয়োজন
                </span>
              </div>
              
              {lowStockItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                    <thead>
                      <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        <th className="py-2 px-3">পণ্য</th>
                        <th className="py-2 px-3">ভ্যারিয়েন্ট</th>
                        <th className="py-2 px-3 text-center">বর্তমান স্টক</th>
                        <th className="py-2 px-3 text-center">কম স্টক এলার্ট লিমিট</th>
                        <th className="py-2 px-3 text-center">রি-স্টক পরিমাণ</th>
                        <th className="py-2 px-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark text-brand-charcoal">
                      {lowStockItems.map((item) => {
                        const inputKey = `${item.productId}-${item.variantId || "general"}`;
                        return (
                          <tr key={inputKey} className="hover:bg-red-50/10">
                            <td className="py-3 px-3 font-semibold">{item.productName}</td>
                            <td className="py-3 px-3 text-stone-500">{item.variantDetails || "—"}</td>
                            <td className="py-3 px-3 text-center font-bold text-red-600">{item.stock} টি</td>
                            <td className="py-3 px-3 text-center text-stone-400 font-light">{item.threshold} টি</td>
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="number"
                                placeholder="যেমন: ১০"
                                value={restockInputs[inputKey] || ""}
                                onChange={(e) =>
                                  setRestockInputs((prev) => ({
                                    ...prev,
                                    [inputKey]: e.target.value,
                                  }))
                                }
                                className="w-20 text-center bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-1 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
                              />
                            </td>
                            <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  const qty = parseInt(restockInputs[inputKey], 10);
                                  if (isNaN(qty) || qty <= 0) {
                                    alert("দয়া করে সঠিক রি-স্টক পরিমাণ লিখুন।");
                                    return;
                                  }
                                  updateStock(item.productId, item.variantId || null, item.stock + qty, "restock", "admin");
                                  setRestockInputs((prev) => ({ ...prev, [inputKey]: "" }));
                                  alert(`🎉 স্টক সফলভাবে আপডেট করা হয়েছে!`);
                                }}
                                className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                              >
                                স্টক যোগ করুন
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-stone-400 text-xs">
                  ✓ সকল পণ্য পর্যাপ্ত পরিমাণে স্টকে রয়েছে!
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-brand-beige-dark pb-4">
              <div>
                <h3 className="text-base font-bold text-brand-charcoal">পণ্য তালিকা পরিচালনা</h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">স্টোরে প্রোডাক্ট সংযোজন এবং অপসারণ করুন</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Bulk CSV upload */}
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="bulk-csv-upload"
                  />
                  <label
                    htmlFor="bulk-csv-upload"
                    className="bg-white border border-brand-beige-dark hover:bg-brand-beige text-brand-charcoal px-4 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    📥 বাল্ক আপডেট (CSV)
                  </label>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন +"}
                </button>
              </div>
            </div>

            {/* Add Product Modal Form */}
            {showAddForm && (
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-md max-w-2xl animate-slideDown">
                <h4 className="text-sm font-bold text-brand-charcoal border-b border-brand-beige-dark pb-2 mb-4">পণ্য সংযোজন ফর্ম</h4>
                
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs font-semibold mb-4">
                    ⚠️ {formError}
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <label htmlFor="prod-name" className="text-[11px] font-bold text-stone-500">পণ্যের নাম <span className="text-red-500">*</span></label>
                      <input
                        id="prod-name"
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="যেমন: প্রিমিয়াম সিলিকা ক্যাট লিটার"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-price" className="text-[11px] font-bold text-stone-500">মূল্য (৳) <span className="text-red-500">*</span></label>
                      <input
                        id="prod-price"
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="যেমন: ৮৫০"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-cat" className="text-[11px] font-bold text-stone-500">পোষা প্রাণীর ধরন</label>
                      <select
                        id="prod-cat"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      >
                        <option value="cats">বিড়াল (Cats)</option>
                        <option value="dogs">কুকুর (Dogs)</option>
                        <option value="birds">পাখি ও অন্যান্য</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="prod-brand" className="text-[11px] font-bold text-stone-500">ব্র্যান্ড</label>
                      <select
                        id="prod-brand"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      >
                        <option value="Pawsome">Pawsome</option>
                        <option value="MeowMix">MeowMix</option>
                        <option value="DoggyStyles">DoggyStyles</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="prod-image" className="text-[11px] font-bold text-stone-500">প্রোডাক্ট ইমেজ ফাইল নেম (public/ ফোল্ডারে থাকতে হবে)</label>
                      <input
                        id="prod-image"
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="যেমন: litter.png अथवा খালি রাখুন"
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                      <div className="space-y-1">
                        <label htmlFor="prod-stock" className="text-[11px] font-bold text-stone-500">স্টক পরিমাণ (Stock) <span className="text-red-500">*</span></label>
                        <input
                          id="prod-stock"
                          type="number"
                          required
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          placeholder="যেমন: ১০"
                          className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="prod-threshold" className="text-[11px] font-bold text-stone-500">কম স্টক সতর্কীকরণ লিমিট <span className="text-red-500">*</span></label>
                        <input
                          id="prod-threshold"
                          type="number"
                          required
                          value={newProdThreshold}
                          onChange={(e) => setNewProdThreshold(e.target.value)}
                          placeholder="যেমন: ৫"
                          className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                        />
                      </div>
                    </div>

                    {/* Variant additions section */}
                    <div className="sm:col-span-2 space-y-2 border border-dashed border-brand-beige-dark p-4 rounded-xl bg-brand-beige/25">
                      <div className="flex justify-between items-center pb-2 border-b border-brand-beige-dark">
                        <span className="text-[11px] font-bold text-brand-charcoal">পণ্যের ভ্যারিয়েন্ট সমূহ (ঐচ্ছিক)</span>
                        <button
                          type="button"
                          onClick={() => setVariantInputs((prev) => [...prev, { size: "", color: "", stock: 0 }])}
                          className="text-[10px] font-bold text-brand-forest hover:underline cursor-pointer"
                        >
                          + ভ্যারিয়েন্ট যোগ করুন
                        </button>
                      </div>
                      
                      {variantInputs.map((vInput, idx) => (
                        <div key={idx} className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            placeholder="সাইজ (M, L)"
                            value={vInput.size}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].size = e.target.value;
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="রঙ (Red, Green)"
                            value={vInput.color}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].color = e.target.value;
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="স্টক"
                            value={vInput.stock || ""}
                            onChange={(e) => {
                              const updated = [...variantInputs];
                              updated[idx].stock = Number(e.target.value);
                              setVariantInputs(updated);
                            }}
                            className="bg-white border border-brand-beige-dark text-[11px] rounded-lg p-1.5 text-brand-charcoal focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setVariantInputs((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-[10px] text-red-650 hover:underline cursor-pointer col-span-3 sm:col-span-1 text-right sm:text-center text-red-600"
                          >
                            মুছুন ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="prod-desc" className="text-[11px] font-bold text-stone-500">পণ্যের বিবরণ (Description)</label>
                      <textarea
                        id="prod-desc"
                        rows={2}
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
                        className="w-full bg-brand-beige border border-brand-beige-dark text-xs rounded-lg p-2.5 text-brand-charcoal focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-colors"
                      />
                    </div>

                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal px-6 py-2.5 rounded-full text-xs font-semibold border border-brand-beige-dark transition-colors cursor-pointer"
                    >
                      বাতিল করুন
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-forest hover:bg-brand-forest-light text-brand-beige px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Listing Table */}
            <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-beige-dark">
                  <thead className="bg-brand-beige">
                    <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-3 sm:py-4 sm:px-6">পণ্যের বিবরণ</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">আইডি</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">ক্যাটাগরি</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">ব্র্যান্ড</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 text-center">স্টক পরিমাণ</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6">মূল্য</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                    {products.map((product) => {
                      const category = product.category || "cats";
                      const brand = product.brand || "Pawsome";
                      return (
                        <tr key={product.id} className="hover:bg-brand-beige/20 text-brand-charcoal">
                          <td className="py-3 px-3 sm:py-4 sm:px-6 space-y-1.5">
                            <span className="font-semibold">{product.name}</span>
                            {product.variants && product.variants.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 text-[9px] text-stone-500 font-medium mt-1">
                                {product.variants.map((v) => (
                                  <span key={v.id} className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded">
                                    {v.size ? `Size: ${v.size}` : ""} {v.color ? `Color: ${v.color}` : ""} ({v.stock}টি)
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-mono text-stone-400">{product.id}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-forest/5 text-brand-forest border border-brand-forest/10 font-medium">
                              {category === "cats" ? "🐱 বিড়াল" : category === "dogs" ? "🐶 কুকুর" : "🦜 পাখি"}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-stone-500 font-medium">{brand}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-center">
                            {product.stock <= 0 ? (
                              <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200 uppercase tracking-wider text-[10px]">
                                স্টক আউট
                              </span>
                            ) : product.stock <= (product.lowStockThreshold || 5) ? (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-250 text-[10px] animate-pulse">
                                {product.stock} টি বাকি ⚠️
                              </span>
                            ) : (
                              <span className="font-semibold text-brand-charcoal">
                                {product.stock} টি
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-brand-forest">৳{product.price.toLocaleString("bn-BD")}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি সত্যিই "${product.name}" মুছতে চান?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="text-stone-400 hover:text-red-700 hover:bg-stone-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div>
              <h3 className="text-base font-bold text-brand-charcoal border-b border-brand-beige-dark pb-3">গ্রাহক অর্ডারসমূহ</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">সবগুলো অর্ডার স্ট্যাটাস এবং বিবরণ ট্র্যাক ও আপডেট করুন</p>
            </div>

            {orders.length > 0 ? (
              <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-beige-dark">
                    <thead className="bg-brand-beige">
                      <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        <th className="py-3 px-3 sm:py-4 sm:px-6">অর্ডার আইডি</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">তারিখ</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">ক্রেতার বিবরণ</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">পণ্যের তালিকা (পরিমাণ)</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">মোট বিল</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6">পেমেন্ট মেথড</th>
                        <th className="py-3 px-3 sm:py-4 sm:px-6 text-center">স্ট্যাটাস আপডেট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark bg-white text-xs">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-beige/20 text-brand-charcoal items-start">
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold font-mono text-brand-forest">{order.id}</td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-stone-400 font-light">
                            {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 space-y-1">
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-[10px] text-stone-500">{order.customerPhone}</p>
                            <p className="text-[10px] text-stone-400 font-light leading-relaxed max-w-[150px] break-words">{order.customerAddress}</p>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <ul className="space-y-1 text-stone-600">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                  <span className="text-[10px]">📦</span>
                                  <span className="truncate max-w-[150px]">{item.name}</span>
                                  <span className="font-semibold text-brand-charcoal text-[11px]">({item.quantity}x)</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-brand-charcoal">
                            ৳{order.grandTotal.toLocaleString("bn-BD")}
                            <p className="text-[9px] text-stone-400 font-light mt-0.5">(ডেলিভারি: ৳{order.shippingFee})</p>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 space-y-1">
                            <div className="flex gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 text-[9px] rounded bg-stone-100 border border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                                {order.paymentMethod}
                              </span>
                              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold border ${
                                order.paymentStatus === "Paid"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : order.paymentStatus === "Partial"
                                  ? "bg-amber-50 border-amber-200 text-amber-700"
                                  : "bg-red-50 border-red-200 text-red-700"
                              }`}>
                                {order.paymentStatus || "Unpaid"}
                              </span>
                            </div>
                            {order.transactionId && (
                              <p className="text-[9px] font-mono text-stone-400">TXID: {order.transactionId}</p>
                            )}
                            {order.courierPartner && (
                              <p className="text-[9px] font-semibold text-brand-forest mt-0.5">🚚 {order.courierPartner}</p>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 text-center space-y-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order, e.target.value as Order["status"])}
                              className={`text-xs font-semibold rounded-lg p-1.5 border focus:outline-none focus:ring-1 focus:ring-brand-forest cursor-pointer transition-all ${
                                order.status === "Delivered"
                                  ? "bg-brand-forest/10 border-brand-forest/25 text-brand-forest"
                                  : order.status === "Shipped"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : order.status === "Processing"
                                  ? "bg-amber-50 border-amber-200 text-amber-750"
                                  : order.status === "Cancelled"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-stone-50 border-stone-200 text-stone-600"
                              }`}
                            >
                              <option value="Received">Received</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleOpenOrderModal(order)}
                              className="block mx-auto text-[10px] bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-beige px-2 py-1 rounded transition-colors font-bold cursor-pointer"
                            >
                              🔍 বিস্তারিত (Details)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-brand-beige-dark shadow-sm space-y-3">
                <span className="text-5xl block">🛒</span>
                <h4 className="text-base font-semibold text-brand-charcoal">কোনো অর্ডার এখনো পাওয়া যায়নি!</h4>
                <p className="text-xs text-stone-400 font-light max-w-sm mx-auto">
                  ক্রেতারা যখনই লাইভ শপে অর্ডার প্লেস করবেন, তখনই সেগুলো স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হয়ে যাবে।
                </p>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: BUNDLES OVERVIEW */}
        {activeTab === "bundles" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-brand-beige-dark pb-4">
              <h3 className="text-base font-bold text-brand-charcoal">সক্রিয় বান্ডেল ও প্রমোশন সমূহ</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">কম্বো বান্ডেল ডিল এবং ডিসকাউন্ট ক্যাম্পেইন সমূহ ট্র্যাক করুন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Bundle 1 */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-brand-beige p-2 rounded-xl border border-brand-beige-dark">🐱</span>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal">ক্যাট স্টার্টার প্যাক (Starter Bundle)</h4>
                      <p className="text-[10px] text-stone-400 font-semibold tracking-wider">বিড়াল কম্বো অফার</p>
                    </div>
                  </div>
                  <span className="bg-brand-forest text-brand-beige px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ১৫% সাশ্রয়!
                  </span>
                </div>
                
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  নতুন বিড়ালের জন্য প্রয়োজনীয় গ্রুমিং ও হাইজিন সামগ্রীর প্রিমিয়াম বান্ডেল অফার।
                </p>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">বান্ডেলে থাকা আইটেমসমূহ:</h5>
                  <div className="space-y-1.5">
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">Premium Velvet Cat Collar</span>
                      <span className="font-bold text-brand-forest">৳১,২০০</span>
                    </div>
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">প্রিমিয়াম সিলিকা ক্যাট লিটার</span>
                      <span className="font-bold text-brand-forest">৳৮৫০</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[10px] text-stone-400 line-through">পূর্বমূল্য ৳২,০৫০</p>
                    <p className="text-base font-black text-brand-forest">বান্ডেল মূল্য ৳১,৮০০</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">ক্যাম্পেইন স্ট্যাটাস: <span className="text-emerald-700">সক্রিয়</span></span>
                </div>
              </div>

              {/* Bundle 2 */}
              <div className="bg-white rounded-2xl border border-brand-beige-dark p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-brand-beige-dark pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-brand-beige p-2 rounded-xl border border-brand-beige-dark">🐶</span>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal">ডগ হাইজিন প্যাক (Hygiene Bundle)</h4>
                      <p className="text-[10px] text-stone-400 font-semibold tracking-wider">কুকুর কম্বো অফার</p>
                    </div>
                  </div>
                  <span className="bg-brand-forest text-brand-beige px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ৳২৫০ ছাড়!
                  </span>
                </div>
                
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  আপনার কুকুরের স্বাস্থ্যকর গ্রুমিং ও ডেন্টাল সুরক্ষার সেরা কম্বো প্যাক।
                </p>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">বান্ডেলে থাকা আইটেমসমূহ:</h5>
                  <div className="space-y-1.5">
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">অর্গানিক ডগ শ্যাম্পু ও কন্ডিশনার</span>
                      <span className="font-bold text-brand-forest">৳৬৫০</span>
                    </div>
                    <div className="bg-brand-beige p-2.5 rounded-lg border border-brand-beige-dark text-xs flex justify-between">
                      <span className="font-medium text-brand-charcoal">ডেন্টাল ডগ চিউ টয়</span>
                      <span className="font-bold text-brand-forest">৳৪০০</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[10px] text-stone-400 line-through">পূর্বমূল্য ৳১,০৫০</p>
                    <p className="text-base font-black text-brand-forest">বান্ডেল মূল্য ৳৮০০</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">ক্যাম্পেইন স্ট্যাটাস: <span className="text-emerald-700">সক্রিয়</span></span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit_logs" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-brand-beige-dark pb-4">
              <h3 className="text-base font-bold text-brand-charcoal">স্টক অডিট লগ হিস্ট্রি (Stock History Logs)</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">স্টোরে পণ্য ইনভেন্টরির পরিবর্তন ও স্টক হিস্ট্রি ট্র্যাক করুন</p>
            </div>

            <div className="bg-white rounded-2xl border border-brand-beige-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                  <thead className="bg-brand-beige">
                    <tr className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">তারিখ ও সময়</th>
                      <th className="py-3 px-4">পণ্যের বিবরণ</th>
                      <th className="py-3 px-4">ভ্যারিয়েন্ট</th>
                      <th className="py-3 px-4 text-center">পরিবর্তন</th>
                      <th className="py-3 px-4">অ্যাকশন টাইপ</th>
                      <th className="py-3 px-4">সম্পাদনকারী</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white">
                    {stockLogs && stockLogs.length > 0 ? (
                      stockLogs.map((log) => {
                        const isPositive = log.quantityChanged > 0;
                        return (
                          <tr key={log.id} className="hover:bg-brand-beige/25">
                            <td className="py-3 px-4 text-stone-400">
                              {new Date(log.createdAt).toLocaleString("bn-BD")}
                            </td>
                            <td className="py-3 px-4 font-semibold text-brand-charcoal">{log.productName}</td>
                            <td className="py-3 px-4 text-stone-500">{log.variantDetails || "—"}</td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  isPositive 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                    : "bg-red-50 text-red-700 border border-red-100"
                                }`}
                              >
                                {isPositive ? `+${log.quantityChanged}` : log.quantityChanged}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-[10px]">
                                {log.actionType === "restock" 
                                  ? "🟢 রি-স্টক (Restock)" 
                                  : log.actionType === "purchase" 
                                  ? "🔵 ক্রয় (Purchase)" 
                                  : log.actionType === "cancel_return" 
                                  ? "🟡 ফেরত (Cancel Return)" 
                                  : "🟠 সমন্বয় (Adjust)"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-stone-600 font-mono text-[11px]">{log.updatedBy}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          কোনো স্টক লগ হিস্ট্রি পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: STAFF & ROLES */}
        {activeTab === "staff" && activeStaff?.role === "Super Admin" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="border-b border-brand-beige-dark pb-4">
              <h3 className="text-base font-bold text-brand-charcoal">স্টাফ ও রোলস ম্যানেজমেন্ট (Staff & Roles Management)</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">নতুন স্টাফ যুক্ত করুন, রোল নির্ধারণ করুন এবং তাদের কার্যক্রমের অডিট হিস্ট্রি দেখুন</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Staff Form Card */}
              <div className="bg-white rounded-3xl border border-brand-beige-dark shadow-sm p-6 space-y-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">নতুন স্টাফ মেম্বার যুক্ত করুন</h4>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword.trim()) {
                      alert("⚠️ অনুগ্রহ করে সকল ইনপুট ফিল্ড পূরণ করুন।");
                      return;
                    }
                    addStaff(newStaffName.trim(), newStaffEmail.trim(), newStaffRole, newStaffPassword);
                    alert("✓ স্টাফ মেম্বার সফলভাবে যুক্ত করা হয়েছে!");
                    setNewStaffName("");
                    setNewStaffEmail("");
                    setNewStaffPassword("");
                    setNewStaffRole("Support");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">পূর্ণ নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আরিয়ান হোসাইন"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-forest transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ইমেইল অ্যাড্রেস</label>
                    <input
                      type="email"
                      required
                      placeholder="aroyan@paws.co"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-forest transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">লগইন পাসওয়ার্ড</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      className="w-full bg-brand-beige border border-brand-beige-dark rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-forest transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">রোলে সিলেক্ট (Select Role)</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as any)}
                      className="w-full bg-brand-beige border border-brand-beige-dark rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-forest transition-all font-semibold"
                    >
                      <option value="Support">Support (অর্ডার আপডেট ও রিড-অনলি)</option>
                      <option value="Manager">Manager (পণ্য, অর্ডার, কাস্টমার অ্যাক্সেস)</option>
                      <option value="Super Admin">Super Admin (সম্পূর্ণ অ্যাক্সেস)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-forest hover:bg-brand-forest/90 text-brand-beige py-3 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer mt-2"
                  >
                    যুক্ত করুন +
                  </button>
                </form>
              </div>

              {/* Staff list directory */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-brand-beige-dark shadow-sm p-6 space-y-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">সক্রিয় স্টাফ ডিরেক্টরি ({staffList.length})</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                    <thead className="bg-brand-beige">
                      <tr className="text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                        <th className="py-2.5 px-4">নাম</th>
                        <th className="py-2.5 px-4">ইমেইল</th>
                        <th className="py-2.5 px-4">রোল</th>
                        <th className="py-2.5 px-4">যোগদানের তারিখ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-beige-dark bg-white">
                      {staffList.map((s) => (
                        <tr key={s.id} className="hover:bg-brand-beige/25">
                          <td className="py-3 px-4 font-bold text-brand-charcoal">{s.name}</td>
                          <td className="py-3 px-4 text-stone-500">{s.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                              s.role === "Super Admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : s.role === "Manager"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              {s.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-400">
                            {new Date(s.createdAt).toLocaleDateString("bn-BD")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Staff Activity Audit Logs Table */}
            <div className="bg-white rounded-3xl border border-brand-beige-dark shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">স্টাফ এক্টিভিটি লগস (Audit Trail Logs)</h4>
              
              <div className="overflow-x-auto font-sans">
                <table className="min-w-full divide-y divide-brand-beige-dark text-xs">
                  <thead className="bg-brand-beige">
                    <tr className="text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4">সময় ও তারিখ</th>
                      <th className="py-2.5 px-4">স্টাফ মেম্বার</th>
                      <th className="py-2.5 px-4">রোল</th>
                      <th className="py-2.5 px-4">সম্পাদিত কাজ (Action Performed)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige-dark bg-white font-medium">
                    {staffLogs && staffLogs.length > 0 ? (
                      staffLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-brand-beige/25">
                          <td className="py-3 px-4 text-stone-400 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 font-bold text-brand-charcoal">
                            {log.staffName}
                            <span className="text-[10px] text-stone-400 font-normal block">{log.staffEmail}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              log.staffRole === "Super Admin"
                                ? "bg-purple-50 text-purple-700"
                                : log.staffRole === "Manager"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {log.staffRole}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-600 font-semibold">{log.action}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-stone-400">
                          কোনো স্টাফ এক্টিভিটি রেকর্ড পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Order Details Modal Overlay */}
        {activeOrderModal && (() => {
          const liveOrder = orders.find(o => o.id === activeOrderModal.id) || activeOrderModal;
          return (
            <div className="fixed inset-0 bg-brand-charcoal/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
              <div className="bg-white rounded-3xl border border-brand-beige-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative animate-scaleUp">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveOrderModal(null)}
                  className="absolute top-5 right-5 text-stone-400 hover:text-brand-charcoal text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>

                {/* Modal Title */}
                <div className="border-b border-brand-beige-dark pb-4">
                  <span className="bg-brand-forest/10 border border-brand-forest/20 text-brand-forest px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    অর্ডার বিবরণী
                  </span>
                  <h3 className="text-lg font-black text-brand-charcoal mt-2">অর্ডার আইডি: {liveOrder.id}</h3>
                  <p className="text-[10px] text-stone-400 font-light mt-0.5">
                    অর্ডার সময়: {new Date(liveOrder.createdAt).toLocaleString("bn-BD")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column: Order Summary & Address details */}
                  <div className="space-y-6">
                    <div className="bg-brand-beige/35 border border-brand-beige-dark p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">গ্রাহকের ডেলিভারি বিবরণ</h4>
                      <div className="text-xs space-y-2 text-brand-charcoal">
                        <p><span className="font-bold text-stone-400">নাম:</span> {liveOrder.customerName}</p>
                        <p><span className="font-bold text-stone-400">মোবাইল:</span> {liveOrder.customerPhone}</p>
                        <p><span className="font-bold text-stone-400">ঠিকানা:</span> {liveOrder.customerAddress}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">অর্ডারকৃত আইটেমসমূহ ({liveOrder.items.length})</h4>
                      <div className="divide-y divide-brand-beige-dark bg-white border border-brand-beige-dark rounded-2xl overflow-hidden">
                        {liveOrder.items.map((item, index) => (
                          <div key={index} className="p-3 text-xs flex justify-between items-center hover:bg-brand-beige/10">
                            <div>
                              <p className="font-bold text-brand-charcoal">{item.name}</p>
                              {item.selectedVariantId && (
                                <p className="text-[9px] text-stone-400 font-light">ভ্যারিয়েন্ট আইডি: {item.selectedVariantId}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-brand-charcoal">৳{item.price.toLocaleString("bn-BD")} x {item.quantity}</p>
                              <p className="text-[10px] text-brand-forest font-black">৳{(item.price * item.quantity).toLocaleString("bn-BD")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bill summary */}
                    <div className="bg-brand-beige/20 border border-brand-beige-dark p-4 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between font-light">
                        <span>পণ্যের মোট মূল্য (Subtotal):</span>
                        <span>৳{liveOrder.subtotal?.toLocaleString("bn-BD") || liveOrder.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString("bn-BD")}</span>
                      </div>
                      <div className="flex justify-between font-light">
                        <span>ডেলিভারি চার্জ:</span>
                        <span>৳{liveOrder.shippingFee.toLocaleString("bn-BD")}</span>
                      </div>
                      {liveOrder.grandTotal - (liveOrder.subtotal || 0) - liveOrder.shippingFee < 0 && (
                        <div className="flex justify-between text-red-600 font-medium">
                          <span>ডিসকাউন্ট/কুপন ছাড়:</span>
                          <span>-৳{Math.abs(liveOrder.grandTotal - (liveOrder.subtotal || 0) - liveOrder.shippingFee).toLocaleString("bn-BD")}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-sm text-brand-forest pt-2 border-t border-brand-beige-dark mt-2">
                        <span>সর্বমোট বিল (Grand Total):</span>
                        <span>৳{liveOrder.grandTotal.toLocaleString("bn-BD")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Administrative Controls & Refund */}
                  <div className="space-y-6">
                    
                    {/* Payment Control */}
                    <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">পেমেন্ট ট্র্যাকিং</h4>
                      {activeStaff?.role === "Support" ? (
                        <div className="text-xs space-y-2.5 font-bold text-stone-700">
                          <p>পেমেন্ট স্ট্যাটাস: <span className="text-brand-charcoal">{liveOrder.paymentStatus}</span></p>
                          <p>ট্রানজেকশন আইডি: <span className="text-brand-charcoal font-mono">{liveOrder.transactionId || "N/A"}</span></p>
                          <span className="text-[10px] text-amber-600 block bg-amber-50 px-2 py-1 rounded">⚠️ পেমেন্ট রেকর্ড পরিমার্জনার অ্যাক্সেস আপনার রোলের নেই।</span>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-400 block">পেমেন্ট স্ট্যাটাস</label>
                              <select
                                value={paymentStatusInput}
                                onChange={(e) => setPaymentStatusInput(e.target.value as any)}
                                className="w-full bg-brand-beige border border-brand-beige-dark rounded-lg p-2 focus:outline-none"
                              >
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Partial">Partial</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-400 block">ট্রানজেকশন আইডি (Txn ID)</label>
                              <input
                                type="text"
                                placeholder="যেমন: TRX92834"
                                value={transactionIdInput}
                                onChange={(e) => setTransactionIdInput(e.target.value)}
                                className="w-full bg-brand-beige border border-brand-beige-dark rounded-lg p-2 focus:outline-none uppercase font-mono font-semibold"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateOrderPayment(liveOrder.id, paymentStatusInput, transactionIdInput);
                              alert("✓ পেমেন্ট রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
                            }}
                            className="w-full bg-brand-charcoal text-brand-beige hover:bg-brand-charcoal/90 text-xs py-2 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            পেমেন্ট রেকর্ড আপডেট করুন
                          </button>
                        </>
                      )}
                    </div>

                    {/* Courier Control */}
                    <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">কুরিয়ার ও ডিসপ্যাচ বিবরণ</h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 block">কুরিয়ার পার্টনার</label>
                          <select
                            value={courierInput}
                            onChange={(e) => setCourierInput(e.target.value as any)}
                            className="w-full bg-brand-beige border border-brand-beige-dark rounded-lg p-2 focus:outline-none"
                          >
                            <option value="Pathao">Pathao</option>
                            <option value="RedX">RedX</option>
                            <option value="Steadfast">Steadfast</option>
                            <option value="Own delivery">Own delivery</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 block">কুরিয়ার ট্র্যাকিং আইডি</label>
                          <input
                            type="text"
                            placeholder="যেমন: PATHAO-984392"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="w-full bg-brand-beige border border-brand-beige-dark rounded-lg p-2 focus:outline-none font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!trackingInput.trim()) {
                            alert("⚠️ কুরিয়ার ট্র্যাকিং নম্বর প্রদান করা আবশ্যক!");
                            return;
                          }
                          updateOrderCourier(liveOrder.id, courierInput, trackingInput.trim());
                          alert("✓ কুরিয়ার বিবরণ ও ট্র্যাকিং আইডি সফলভাবে যুক্ত করা হয়েছে!");
                        }}
                        className="w-full bg-brand-charcoal text-brand-beige hover:bg-brand-charcoal/90 text-xs py-2 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        কুরিয়ার ট্র্যাকিং আপডেট করুন
                      </button>
                    </div>

                    {/* Refund initiator control */}
                    {activeStaff?.role !== "Support" && (
                      <div className="bg-white rounded-2xl border border-brand-beige-dark p-5 shadow-xs space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">রিফান্ড মডারেটর</h4>
                          {liveOrder.refundStatus ? (
                            <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {liveOrder.refundStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-light">কোনো রিফান্ড অ্যাকশন নেই</span>
                          )}
                        </div>

                        {!showRefundForm ? (
                          <button
                            type="button"
                            onClick={() => {
                              setShowRefundForm(true);
                              setRefundAmountInput(liveOrder.grandTotal.toString());
                            }}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs py-2 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            💸 রিফান্ড ইস্যু করুন (Refund Initiate)
                          </button>
                        ) : (
                          <div className="border border-red-200 bg-red-50/20 p-4 rounded-xl space-y-3 text-xs animate-slideDown">
                            <h5 className="font-bold text-red-700 text-[11px]">নতুন রিফান্ড ইস্যু ফর্ম</h5>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-400 block">রিফান্ড পরিমাণ (৳)</label>
                              <input
                                type="number"
                                value={refundAmountInput}
                                onChange={(e) => setRefundAmountInput(e.target.value)}
                                className="w-full bg-white border border-brand-beige-dark rounded-lg p-2 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-400 block">রিফান্ড মাধ্যম</label>
                              <select
                                value={refundMethodInput}
                                onChange={(e) => setRefundMethodInput(e.target.value)}
                                className="w-full bg-white border border-brand-beige-dark rounded-lg p-2 focus:outline-none"
                              >
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="card">Card</option>
                                <option value="cash">Cash (COD)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-400 block">রিফান্ড কারণ</label>
                              <textarea
                                rows={2}
                                placeholder="রিফান্ড ইস্যু করার কারণ লিখুন..."
                                value={refundReasonInput}
                                onChange={(e) => setRefundReasonInput(e.target.value)}
                                className="w-full bg-white border border-brand-beige-dark rounded-lg p-2 focus:outline-none"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const amount = Number(refundAmountInput);
                                  if (isNaN(amount) || amount <= 0) {
                                    alert("⚠️ অনুগ্রহ করে সঠিক পরিমাণ টাকা ইনপুট করুন।");
                                    return;
                                  }
                                  if (!refundReasonInput.trim()) {
                                    alert("⚠️ রিফান্ড ইস্যু করার কারণ অবশ্যই লিখতে হবে।");
                                    return;
                                  }
                                  initiateRefund(liveOrder.id, amount, refundMethodInput, refundReasonInput.trim());
                                  alert("✓ রিফান্ড ইস্যু সফল হয়েছে!");
                                  setShowRefundForm(false);
                                }}
                                className="flex-1 bg-red-650 hover:bg-red-750 bg-red-600 text-brand-beige py-2 rounded-lg font-bold text-center text-xs transition-colors cursor-pointer"
                              >
                                কনফার্ম রিফান্ড
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowRefundForm(false)}
                                className="bg-stone-200 text-brand-charcoal hover:bg-stone-300 py-2 px-4 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>

              </div>
            </div>
          );
        })()}

      </main>

    </div>
  );
}
