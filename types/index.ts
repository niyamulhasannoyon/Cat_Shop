export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  description?: string;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: "cod" | "mfs";
  status: "Received" | "Processing" | "Shipped" | "Delivered";
  createdAt: string;
}

export interface ShopContextType {
  products: Product[];
  orders: Order[];
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  placeOrder: (
    name: string,
    phone: string,
    address: string,
    paymentMethod: "cod" | "mfs",
    area: "inside" | "outside"
  ) => string;
}
