import { Metadata } from "next";
import { getProducts } from "@/lib/db";
import ProductsCatalogView from "@/components/shop/ProductsCatalogView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.cat ? ` ${params.cat.toUpperCase()}` : "";
  const query = params.search ? ` - "${params.search}"` : "";

  return {
    title: `পেট শপ ক্যাটালগ${category}${query} | Paws & Co. Bangladesh`,
    description:
      "বাংলাদেশে বিড়াল, কুকুর ও পাখির জন্য সেরা প্রিমিয়াম কলার, লিটার, খাবার এবং এক্সেসরিজ কিনুন। ক্যাশ অন ডেলিভারি ও দ্রুত হোম ডেলিভারি।",
    openGraph: {
      title: "Paws & Co. Pet Accessories Catalog",
      description: "Premium bilingual pet accessories store in Bangladesh.",
      images: ["/hero.png"],
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { products } = await getProducts();

  return (
    <div className="bg-[#F4F1EA] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Modern Premium Page Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-forest via-brand-forest-light to-emerald-900 p-6 sm:p-10 text-white shadow-xl shadow-brand-forest/10 border border-brand-forest/20">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute right-1/3 -top-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-brand-beige text-xs font-semibold uppercase tracking-wider border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              প্রিমিয়াম পেট শপ ক্যাটালগ
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              পেট এক্সেসরিজ কালেকশন
            </h1>
            
            <p className="text-xs sm:text-sm text-brand-beige/90 font-medium leading-relaxed">
              আপনার প্রিয় পোষা প্রাণীর জন্য সেরা প্রিমিয়াম কোয়ালিটির অর্গানিক ফুড, কলার, লিশ ও এক্সেসরিজ এক্সপ্লোর করুন।
            </p>
          </div>
        </div>

        {/* Interactive Products Catalog View */}
        <ProductsCatalogView
          initialProducts={products}
          initialCategory={params.cat}
          initialSearch={params.search}
        />
      </div>
    </div>
  );
}
