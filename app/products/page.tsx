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
    <div className="bg-[#F0EDE6] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">পেট এক্সেসরিজ কালেকশন</h1>
          <p className="text-xs text-neutral-600 mt-1">প্রিমিয়াম কোয়ালিটির প্রোডাক্ট খুঁজুন ও অর্ডার করুন</p>
        </div>

        <ProductsCatalogView
          initialProducts={products}
          initialCategory={params.cat}
          initialSearch={params.search}
        />
      </div>
    </div>
  );
}
