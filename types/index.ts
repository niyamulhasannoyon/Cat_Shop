export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  description?: string;
  imageUrl?: string;
  stock: number;
  lowStockThreshold?: number; // default: 5
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariantId?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: "cod" | "bkash" | "nagad" | "card" | "mfs";
  paymentStatus?: "Paid" | "Unpaid" | "Partial";
  transactionId?: string;
  courierPartner?: "Pathao" | "RedX" | "Steadfast" | "Own delivery";
  trackingNumber?: string;
  refundStatus?: "None" | "Initiated" | "Refunded";
  refundAmount?: number;
  refundReason?: string;
  refundMethod?: string;
  status: "Received" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddresses: string[];
  totalOrders: number;
  totalSpent: number;
  signupDate: string;
  status: "active" | "blocked";
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginDate: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantDetails?: string; // e.g. "Size: M, Color: Red"
  quantityChanged: number; // positive or negative
  actionType: "restock" | "purchase" | "cancel_return" | "manual_adjust";
  updatedBy: string; // "admin" or "customer_order_ORD-1234"
  createdAt: string;
}

export interface ShopContextType {
  products: Product[];
  orders: Order[];
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  customers: Customer[];
  stockLogs: StockLog[];
  coupons: Coupon[];
  couponUsageLogs: CouponUsage[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  addToCart: (product: Product, variantId?: string) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, delta: number, variantId?: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  updateCustomerStatus: (id: string, status: "active" | "blocked") => void;
  updateStock: (
    productId: string,
    variantId: string | null,
    newStock: number,
    actionType: StockLog["actionType"],
    updatedBy: string
  ) => void;
  bulkUpdateStock: (csvText: string) => { success: boolean; message: string; updatedCount: number };
  placeOrder: (
    name: string,
    phone: string,
    address: string,
    paymentMethod: "cod" | "bkash" | "nagad" | "card" | "mfs",
    area: "inside" | "outside" | "sub_area",
    transactionId?: string
  ) => string;
  applyCoupon: (code: string, phone: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount" | "createdAt">) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  reviews: Review[];
  approveReview: (id: string) => void;
  rejectReview: (id: string, reason?: string) => void;
  bulkApproveReviews: (ids: string[]) => void;
  bulkRejectReviews: (ids: string[], reason?: string) => void;
  shippingSettings: ShippingSettings;
  updateShippingSettings: (settings: ShippingSettings) => void;
  refundLogs: RefundLog[];
  initiateRefund: (orderId: string, amount: number, method: string, reason: string) => void;
  updateOrderPayment: (orderId: string, status: "Paid" | "Unpaid" | "Partial", transactionId?: string) => void;
  updateOrderCourier: (orderId: string, courier: "Pathao" | "RedX" | "Steadfast" | "Own delivery", trackingNumber: string) => void;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountCap?: number;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  totalUsageLimit: number;
  perUserUsageLimit: number;
  usedCount: number;
  applicableOn: "all" | "category" | "product";
  applicableCategory?: string;
  applicableProductIds?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  couponCode: string;
  orderId: string;
  customerPhone: string;
  discountAmount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  rating: number; // 1-5
  comment: string;
  photoUrl?: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  createdAt: string;
}

export interface RefundLog {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  refundAmount: number;
  refundMethod: string;
  refundReason: string;
  createdAt: string;
}

export interface ShippingSettings {
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  subAreaCharge: number;
  freeShippingThreshold: number;
}
