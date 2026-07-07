# Database Schema Suggestions

Since this application utilizes Firebase (Authentication) on the frontend, we provide two recommended database designs matching the requirements of the **Customer Management** module:

---

## 1. Firebase Firestore Schema (NoSQL)

Firestore organizes data into collections of documents. For a scalable e-commerce application, we suggest creating a `/users` (or `/customers`) collection and a `/orders` collection.

### Collection: `users`
Each document ID in this collection should match the authenticated user's Firebase Authentication UID (`auth.currentUser.uid`).

```json
{
  "id": "USER_UID_HERE",
  "name": "আরিফ রহমান",
  "email": "arif@example.com",
  "phone": "01712345678",
  "shippingAddresses": [
    "গুলশান-১, ঢাকা",
    "বনানী, ব্লক-ডি, ঢাকা"
  ],
  "totalOrders": 1,
  "totalSpent": 2960,
  "signupDate": "2026-05-15T10:30:00.000Z",
  "status": "active", // Enum: "active" | "blocked"
  "emailVerified": true,
  "phoneVerified": true,
  "lastLoginDate": "2026-07-06T18:40:00.000Z"
}
```

### Collection: `orders`
Orders reference users by storing their user/customer ID.

```json
{
  "id": "ORD-8492",
  "customerId": "USER_UID_HERE", // Reference link
  "customerName": "আরিফ রহমান",
  "customerPhone": "01712345678",
  "customerAddress": "গুলশান-১, ঢাকা",
  "items": [
    {
      "id": "1",
      "name": "Premium Velvet Cat Collar (Forest Green)",
      "price": 1200,
      "quantity": 1
    },
    {
      "id": "cat_litter_premium",
      "name": "প্রিমিয়াম সিলিকা ক্যাট লিটার (৫ লিটার)",
      "price": 850,
      "quantity": 2
    }
  ],
  "subtotal": 2900,
  "shippingFee": 60,
  "grandTotal": 2960,
  "paymentMethod": "cod", // Enum: "cod" | "mfs"
  "status": "Delivered", // Enum: "Received" | "Processing" | "Shipped" | "Delivered"
  "createdAt": "2026-07-04T17:49:21.000Z"
}
```

---

## 2. Relational Database Schema (Prisma ORM Example)

If migrating to PostgreSQL, MySQL, or SQLite using Prisma, we suggest the following schemas with relations between the `User`/`Customer` and `Order` models:

```prisma
// datasource db config
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User / Customer Model
model User {
  id                String             @id @default(uuid())
  name              String
  email             String             @unique
  phone             String             @unique
  signupDate        DateTime           @default(now())
  lastLoginDate     DateTime           @updatedAt
  status            UserStatus         @default(ACTIVE)
  emailVerified     Boolean            @default(false)
  phoneVerified     Boolean            @default(false)
  shippingAddresses ShippingAddress[]
  orders            Order[]

  @@map("users")
}

// Shipping Address sub-table (handles 1-to-many shipping locations)
model ShippingAddress {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  address    String
  createdAt  DateTime @default(now())

  @@map("shipping_addresses")
}

// Order Model
model Order {
  id            String      @id @default(uuid())
  orderNumber   String      @unique // e.g., "ORD-8492"
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Restrict)
  shippingFee   Float
  subtotal      Float
  grandTotal    Float
  paymentMethod PaymentMode @default(COD)
  status        OrderStatus @default(RECEIVED)
  createdAt     DateTime    @default(now())
  items         OrderItem[]

  @@map("orders")
}

// Order Items model
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  name      String
  price     Float
  quantity  Int

  @@map("order_items")
}

// Enums
enum UserStatus {
  ACTIVE
  BLOCKED
}

enum PaymentMode {
  COD
  MFS
}

enum OrderStatus {
  RECEIVED
  PROCESSING
  SHIPPED
  DELIVERED
}
```
