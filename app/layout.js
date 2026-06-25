import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Paws & Co. | Premium Pet Accessories Bangladesh",
  description: "High-scale professional e-commerce platform for pet accessories in Bangladesh. Premium quality collars, food, and grooming tools with free delivery above ৳3,000.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-beige text-brand-charcoal">
        <CartProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
