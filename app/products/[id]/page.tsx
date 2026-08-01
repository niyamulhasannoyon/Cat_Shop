import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import PriceTag from "@/components/shop/PriceTag";
import RatingStars from "@/components/shop/RatingStars";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Paws & Co.",
    };
  }

  return {
    title: `${product.name} | Paws & Co. Bangladesh`,
    description: product.description || `Buy ${product.name} at Paws & Co. Bangladesh`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl || "/collar.png"],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.imageUrl || "/collar.png"],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Paws & Co.",
    },
    offers: {
      "@type": "Offer",
      url: `https://pet-shop-bd.vercel.app/products/${product.id}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "24",
    },
  };

  return (
    <div className="bg-[#F0EDE6] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Inject Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-brand-forest transition-colors"
        >
          ← পণ্য ক্যাটালগে ফিরে যান
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square w-full bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
            <Image
              src={product.imageUrl || "/collar.png"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
                {product.brand || "Paws & Co."}
              </span>
              <h1 className="text-2xl font-black text-neutral-900 leading-snug">{product.name}</h1>
              <RatingStars rating={4.8} showNumber size="md" />

              <PriceTag price={product.price} size="xl" />

              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <h3 className="text-xs font-bold text-neutral-900 uppercase">পণ্যের বিবরণ</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <span>স্টক স্ট্যাটাস:</span>
                <span className={product.stock > 0 ? "text-emerald-600" : "text-rose-600"}>
                  {product.stock > 0 ? `ইন স্টক (${product.stock}টি এভেইলেবল)` : "আউট অফ স্টক"}
                </span>
              </div>

              <Link
                href="/cart"
                className="w-full bg-brand-forest hover:bg-brand-forest/90 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-center block transition-all shadow-md cursor-pointer"
              >
                অর্ডার করতে কার্ট দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
