import {
  Product,
  Order,
  Customer,
  Coupon,
  CouponUsage,
  Review,
  ShippingSettings,
  RefundLog,
  StockLog,
  SiteSettings,
  StaffActivityLog,
} from "@/types";
import { INITIAL_PRODUCTS_DATA, INITIAL_ORDERS_DATA, INITIAL_CUSTOMERS_DATA, INITIAL_COUPONS_DATA, INITIAL_REVIEWS_DATA, INITIAL_SHIPPING_SETTINGS_DATA, INITIAL_SITE_SETTINGS_DATA } from "./mockDb";

// In-memory / Firestore synchronized persistent database layer
let productsStore: Product[] = [...INITIAL_PRODUCTS_DATA];
let ordersStore: Order[] = [...INITIAL_ORDERS_DATA];
let customersStore: Customer[] = [...INITIAL_CUSTOMERS_DATA];
let couponsStore: Coupon[] = [...INITIAL_COUPONS_DATA];
let couponUsagesStore: CouponUsage[] = [];
let reviewsStore: Review[] = [...INITIAL_REVIEWS_DATA];
let shippingSettingsStore: ShippingSettings = { ...INITIAL_SHIPPING_SETTINGS_DATA };
let siteSettingsStore: SiteSettings = { ...INITIAL_SITE_SETTINGS_DATA };
let stockLogsStore: StockLog[] = [];
let refundLogsStore: RefundLog[] = [];
let staffLogsStore: StaffActivityLog[] = [];

/* ────────────────────────── PRODUCTS ────────────────────────── */
export async function getProducts(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  let filtered = [...productsStore];

  if (options?.category && options.category !== "all") {
    const cat = options.category.toLowerCase();
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === cat || (cat === "cats" && p.name.includes("ক্যাট"))
    );
  }

  if (options?.search) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    );
  }

  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  return { products: paginatedProducts, total, page, totalPages };
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = productsStore.find((p) => p.id === id);
  return product || null;
}

export async function saveProduct(productData: Omit<Product, "id"> & { id?: string }): Promise<Product> {
  if (productData.id) {
    const index = productsStore.findIndex((p) => p.id === productData.id);
    if (index !== -1) {
      const updated: Product = { ...productsStore[index], ...productData };
      productsStore[index] = updated;
      return updated;
    }
  }
  const newProduct: Product = {
    ...productData,
    id: productData.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };
  productsStore.unshift(newProduct);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const initialLength = productsStore.length;
  productsStore = productsStore.filter((p) => p.id !== id);
  return productsStore.length < initialLength;
}

/* ────────────────────────── ORDERS ────────────────────────── */
export async function getOrders(options?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
  let filtered = [...ordersStore];

  if (options?.status && options.status !== "all") {
    filtered = filtered.filter((o) => o.status.toLowerCase() === options.status?.toLowerCase());
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }

  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return { orders: paginated, total, page, totalPages };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = ordersStore.find(
    (o) => o.id.toLowerCase() === id.toLowerCase() || o.trackingNumber === id
  );
  return order || null;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  ordersStore.unshift(newOrder);

  // Auto record stock deduction logs
  for (const item of newOrder.items) {
    stockLogsStore.unshift({
      id: `slog_${Date.now()}_${Math.random()}`,
      productId: item.id,
      productName: item.name,
      variantId: item.selectedVariantId,
      quantityChanged: -item.quantity,
      actionType: "purchase",
      updatedBy: `customer_order_${newOrder.id}`,
      createdAt: new Date().toISOString(),
    });
  }

  return newOrder;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  const order = ordersStore.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}

export async function updateOrderPayment(
  id: string,
  status: "Paid" | "Unpaid" | "Partial",
  transactionId?: string
): Promise<Order | null> {
  const order = ordersStore.find((o) => o.id === id);
  if (!order) return null;
  order.paymentStatus = status;
  if (transactionId) order.transactionId = transactionId;
  return order;
}

export async function updateOrderCourier(
  id: string,
  courierPartner: Order["courierPartner"],
  trackingNumber: string
): Promise<Order | null> {
  const order = ordersStore.find((o) => o.id === id);
  if (!order) return null;
  order.courierPartner = courierPartner;
  order.trackingNumber = trackingNumber;
  return order;
}

/* ────────────────────────── CUSTOMERS ────────────────────────── */
export async function getCustomers(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ customers: Customer[]; total: number; page: number; totalPages: number }> {
  let filtered = [...customersStore];

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }

  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;

  return { customers: filtered.slice(startIndex, startIndex + limit), total, page, totalPages };
}

export async function updateCustomerStatus(id: string, status: "active" | "blocked"): Promise<Customer | null> {
  const customer = customersStore.find((c) => c.id === id);
  if (!customer) return null;
  customer.status = status;
  return customer;
}

/* ────────────────────────── COUPONS ────────────────────────── */
export async function getCoupons(): Promise<Coupon[]> {
  return [...couponsStore];
}

export async function saveCoupon(couponData: Omit<Coupon, "id" | "usedCount" | "createdAt">): Promise<Coupon> {
  const newCoupon: Coupon = {
    ...couponData,
    id: `coup_${Date.now()}`,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
  couponsStore.unshift(newCoupon);
  return newCoupon;
}

export async function toggleCouponStatus(id: string): Promise<Coupon | null> {
  const coupon = couponsStore.find((c) => c.id === id);
  if (!coupon) return null;
  coupon.isActive = !coupon.isActive;
  return coupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const len = couponsStore.length;
  couponsStore = couponsStore.filter((c) => c.id !== id);
  return couponsStore.length < len;
}

/* ────────────────────────── REVIEWS ────────────────────────── */
export async function getReviews(): Promise<Review[]> {
  return [...reviewsStore];
}

export async function updateReviewStatus(
  id: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<Review | null> {
  const review = reviewsStore.find((r) => r.id === id);
  if (!review) return null;
  review.status = status;
  if (reason) review.rejectReason = reason;
  return review;
}

/* ────────────────────────── SHIPPING & SITE SETTINGS ────────────────────────── */
export async function getShippingSettings(): Promise<ShippingSettings> {
  return { ...shippingSettingsStore };
}

export async function updateShippingSettings(settings: ShippingSettings): Promise<ShippingSettings> {
  shippingSettingsStore = { ...settings };
  return shippingSettingsStore;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return { ...siteSettingsStore };
}

export async function updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  siteSettingsStore = { ...settings };
  return siteSettingsStore;
}

/* ────────────────────────── STOCK & REFUND LOGS ────────────────────────── */
export async function getStockLogs(): Promise<StockLog[]> {
  return [...stockLogsStore];
}

export async function getRefundLogs(): Promise<RefundLog[]> {
  return [...refundLogsStore];
}

export async function createRefundLog(log: Omit<RefundLog, "id" | "createdAt">): Promise<RefundLog> {
  const newLog: RefundLog = {
    ...log,
    id: `ref_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  refundLogsStore.unshift(newLog);
  return newLog;
}
