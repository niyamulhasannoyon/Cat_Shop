import { Customer, Order, Coupon, CouponUsage, Review, ShippingSettings, RefundLog } from "@/types";

// In-memory mock database for server-side API routes
let customers: Customer[] = [
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

// Generate extra mock customers for server list
const initializeServerMock = () => {
  if (customers.length > 6) return;
  const banglaNames = ["জসিম উদ্দিন", "মেহেদী হাসান", "ফারজানা ইয়াসমিন", "কানিজ ফাতেমা", "সাকিব আল হাসান", "মুশফিকুর রহিম", "মাহমুদুল হাসান", "রুবেল হোসেন", "তাসকিন আহমেদ", "মেহেদী হাসান মিরাজ", "মোস্তাফিজুর রহমান", "লিটন দাস", "সৌম্য সরকার", "নুরুল হাসান সোহান", "শরিফুল ইসলাম"];
  const englishEmails = ["josim", "mehedi", "farjana", "kaniz", "shakib", "mushfiq", "mahmudul", "rubel", "taskin", "miraz", "fizz", "liton", "soumya", "sohan", "shoriful"];
  
  for (let i = 0; i < 15; i++) {
    const idNum = i + 7;
    const phoneNum = `017000000${idNum < 10 ? '0' + idNum : idNum}`;
    customers.push({
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
};

initializeServerMock();

// Server-side order history matching orders in ShopContext (to render complete history)
const orders: Order[] = [
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

let coupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "EID2026",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscountCap: 500,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
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

let couponUsageLogs: CouponUsage[] = [
  {
    id: "usage-1",
    couponId: "coupon-1",
    couponCode: "EID2026",
    orderId: "ORD-8492",
    customerPhone: "01712345678",
    discountAmount: 435,
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

let reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    productName: "Premium Leather Cat Collar",
    customerName: "নিয়ামুল হাসান",
    customerPhone: "01712345678",
    rating: 5,
    comment: "চমৎকার কলার! কোয়ালিটি অনেক ভালো এবং বিড়ালের গলায় সুন্দর মানিয়েছে। অত্যন্ত সন্তুষ্ট!",
    status: "approved",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-2",
    productId: "prod-2",
    productName: "Grain-Free Salmon & Chicken Cat Dry Food",
    customerName: "নাবিলা রহমান",
    customerPhone: "01898765432",
    rating: 4,
    comment: "আমার বিড়াল খাবারটি খুব পছন্দ করেছে। হজমে কোনো সমস্যা হয়নি। ডেলিভারিও ফাস্ট ছিল।",
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-3",
    productId: "prod-3",
    productName: "Ultra Odor-Control Silica Gel Cat Litter",
    customerName: "কাজী আশিক",
    customerPhone: "01511223344",
    rating: 5,
    comment: "সত্যিই অসাধারণ গন্ধ নিয়ন্ত্রণ করে! ঘর একদম ফ্রেশ থাকে। সবাই নিতে পারেন।",
    photoUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-4",
    productId: "prod-4",
    productName: "Ergonomic Retractable Cat Leash",
    customerName: "তানভীর আহমেদ",
    customerPhone: "01988776655",
    rating: 2,
    comment: "বেল্টটি একটু ভারী এবং রিলিজ বাটন কাজ করতে একটু সমস্যা করছে। আশা করি ইম্প্রুভ করবেন।",
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-5",
    productId: "prod-6",
    productName: "Stainless Steel Bird Water Fountain",
    customerName: "সাদিয়া ইসলাম",
    customerPhone: "01799887766",
    rating: 1,
    comment: "আজব প্রোডাক্ট! এটি পাখি কেনার বিজ্ঞাপন ছাড়া আর কিছুই না। ভুলেও কেউ কিনবেন না।",
    status: "rejected",
    rejectReason: "বিজ্ঞাপন এবং অপ্রাসঙ্গিক মন্তব্য।",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let shippingSettings: ShippingSettings = {
  insideDhakaCharge: 60,
  outsideDhakaCharge: 120,
  subAreaCharge: 90,
  freeShippingThreshold: 3000
};

let refundLogs: RefundLog[] = [
  {
    id: "ref-1",
    orderId: "ORD-9304",
    customerName: "তাহমিদ হাসান",
    customerPhone: "01898765432",
    refundAmount: 500,
    refundMethod: "bkash",
    refundReason: "অর্ডারকৃত আইটেম ত্রুটিপূর্ণ ছিল এবং ফেরত দেওয়া হয়েছে।",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const db = {
  getCustomers: (
    search?: string,
    status?: string,
    verified?: string,
    page: number = 1,
    limit: number = 20
  ) => {
    let filtered = [...customers];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    if (status && (status === "active" || status === "blocked")) {
      filtered = filtered.filter((c) => c.status === status);
    }

    if (verified) {
      if (verified === "verified") {
        filtered = filtered.filter((c) => c.emailVerified || c.phoneVerified);
      } else if (verified === "unverified") {
        filtered = filtered.filter((c) => !c.emailVerified && !c.phoneVerified);
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      customers: paginated,
      total,
      totalPages,
      page,
      limit,
    };
  },

  getAllCustomersForExport: () => {
    return customers;
  },

  getCustomerById: (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return null;

    // Fetch related order history
    const customerOrders = orders.filter((o) => o.customerPhone === customer.phone);
    
    return {
      ...customer,
      orders: customerOrders,
    };
  },

  updateCustomerStatus: (id: string, status: "active" | "blocked") => {
    const index = customers.findIndex((c) => c.id === id);
    if (index > -1) {
      customers[index] = {
        ...customers[index],
        status,
      };
      return customers[index];
    }
    return null;
  },

  getCoupons: () => {
    return coupons;
  },

  addCoupon: (newC: Omit<Coupon, "id" | "usedCount" | "createdAt">) => {
    const coupon: Coupon = {
      ...newC,
      id: `coupon-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    coupons = [coupon, ...coupons];
    return coupon;
  },

  toggleCouponStatus: (id: string) => {
    const index = coupons.findIndex(c => c.id === id);
    if (index > -1) {
      coupons[index] = {
        ...coupons[index],
        isActive: !coupons[index].isActive,
      };
      return coupons[index];
    }
    return null;
  },

  deleteCoupon: (id: string) => {
    coupons = coupons.filter(c => c.id !== id);
    return true;
  },

  getCouponUsageLogs: () => {
    return couponUsageLogs;
  },

  getReviews: () => {
    return reviews;
  },

  updateReviewStatus: (id: string, status: "approved" | "rejected", rejectReason?: string) => {
    const index = reviews.findIndex(r => r.id === id);
    if (index > -1) {
      reviews[index] = {
        ...reviews[index],
        status,
        rejectReason: status === "rejected" ? rejectReason : undefined
      };
      return reviews[index];
    }
    return null;
  },

  bulkUpdateReviews: (ids: string[], status: "approved" | "rejected", rejectReason?: string) => {
    reviews = reviews.map(r => {
      if (ids.includes(r.id)) {
        return {
          ...r,
          status,
          rejectReason: status === "rejected" ? rejectReason : undefined
        };
      }
      return r;
    });
    return true;
  },

  getShippingSettings: () => {
    return shippingSettings;
  },

  updateShippingSettings: (settings: ShippingSettings) => {
    shippingSettings = settings;
    return shippingSettings;
  },

  getRefundLogs: () => {
    return refundLogs;
  },

  addRefundLog: (log: Omit<RefundLog, "id" | "createdAt">) => {
    const newLog: RefundLog = {
      ...log,
      id: `ref-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    refundLogs = [newLog, ...refundLogs];
    return newLog;
  },
};
