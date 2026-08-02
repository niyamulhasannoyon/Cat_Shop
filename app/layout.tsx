import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paws & Co. | Premium Pet Accessories Bangladesh",
  description: "High-scale professional e-commerce platform for pet accessories in Bangladesh. Premium quality collars, food, and grooming tools with free delivery above ৳3,000.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Paws & Co. | Premium Pet Accessories Bangladesh",
    description: "Premium quality collars, food, and grooming tools for pets with free delivery across Bangladesh.",
    siteName: "Paws & Co.",
    images: [{ url: "/favicon.svg" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body 
        className="min-h-full flex flex-col bg-brand-beige text-brand-charcoal"
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ShopProvider>
            {children}
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
