"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";

export default function AdminProductsManager() {
  const { products, addProduct, deleteProduct, updateStock } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("cats");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/collar.png");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    addProduct({
      name,
      price: parseFloat(price),
      category,
      brand: brand || "Paws & Co.",
      stock: parseInt(stock, 10),
      lowStockThreshold: 5,
      description,
      imageUrl: imageUrl || "/collar.png",
    });

    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">পণ্য ম্যানেজমেন্ট (Products Catalog)</h1>
          <p className="text-xs text-neutral-500 mt-1">পণ্য যোগ করুন, স্টক এডিট করুন এবং ক্যাটালগ আপডেট করুন</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-forest hover:bg-brand-forest/90 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          + নতুন পণ্য যোগ করুন
        </button>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-neutral-900">নতুন পণ্য যোগ করুন</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">পণ্যের নাম (Bengali/English)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম ক্যাট ফুড"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">মূল্য (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                  >
                    <option value="cats">বিড়াল (Cats)</option>
                    <option value="dogs">কুকুর (Dogs)</option>
                    <option value="birds">পাখি/অন্যান্য (Birds)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ব্র্যান্ড</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Paws & Co."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ইমেজ URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-forest text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">ছবি</th>
              <th className="py-3 px-2">নাম</th>
              <th className="py-3 px-2">ক্যাটাগরি</th>
              <th className="py-3 px-2">মূল্য (৳)</th>
              <th className="py-3 px-2">স্টক</th>
              <th className="py-3 px-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100">
                    <Image src={p.imageUrl || "/collar.png"} alt={p.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="py-3 px-2 font-bold text-neutral-900 max-w-xs">{p.name}</td>
                <td className="py-3 px-2 uppercase font-semibold text-neutral-500 text-[10px]">{p.category}</td>
                <td className="py-3 px-2 font-bold text-brand-forest">৳{p.price.toLocaleString("bn-BD")}</td>
                <td className="py-3 px-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock <= (p.lowStockThreshold || 5) ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {p.stock}টি স্টক
                  </span>
                </td>
                <td className="py-3 px-2 space-x-2">
                  <button
                    onClick={() => updateStock(p.id, null, p.stock + 5, "restock", "admin")}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    +5 স্টক
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
