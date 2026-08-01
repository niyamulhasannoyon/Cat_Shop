"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Order } from "@/types";

export default function AdminOrdersManager() {
  const { orders, updateOrderStatus, updateOrderPayment, updateOrderCourier } = useShop();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courier, setCourier] = useState<Order["courierPartner"]>("Pathao");
  const [trackingNo, setTrackingNo] = useState("");

  const handleUpdateCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !trackingNo) return;
    updateOrderCourier(selectedOrder.id, courier || "Pathao", trackingNo);
    setSelectedOrder(null);
    setTrackingNo("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">অর্ডার ম্যানেজার (Order Pipeline)</h1>
        <p className="text-xs text-neutral-500 mt-1">অর্ডার স্ট্যাটাস আপডেট করুন, কুরিয়ার ট্র্যাকিং সেট করুন এবং পেমেন্ট ভেরিফাই করুন</p>
      </div>

      {/* Courier Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-neutral-900">কুরিয়ার ও ট্র্যাকিং নম্বর নির্ধারণ ({selectedOrder.id})</h2>
            <form onSubmit={handleUpdateCourier} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">কুরিয়ার পার্টনার</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value as Order["courierPartner"])}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                >
                  <option value="Pathao">পাঠাও (Pathao)</option>
                  <option value="RedX">রেড-এক্স (RedX)</option>
                  <option value="Steadfast">স্টেডফাস্ট (Steadfast)</option>
                  <option value="Own delivery">নিজস্ব ডেলিভারি (Own Delivery)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">ট্র্যাকিং নম্বর</label>
                <input
                  type="text"
                  required
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="PTH-123456"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-forest text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">অর্ডার আইডি</th>
              <th className="py-3 px-2">গ্রাহক তথ্য</th>
              <th className="py-3 px-2">আইটেমসমূহ</th>
              <th className="py-3 px-2">মোট টাকা</th>
              <th className="py-3 px-2">পেমেন্ট</th>
              <th className="py-3 px-2">কুরিয়ার & ট্র্যাকিং</th>
              <th className="py-3 px-2">স্ট্যাটাস পরিবর্তন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-2 font-mono font-bold text-brand-forest">{o.id}</td>
                <td className="py-3 px-2 space-y-0.5">
                  <div className="font-bold text-neutral-900">{o.customerName}</div>
                  <div className="text-neutral-500 text-[11px]">{o.customerPhone}</div>
                  <div className="text-neutral-400 text-[10px] truncate max-w-xs">{o.customerAddress}</div>
                </td>
                <td className="py-3 px-2 space-y-1">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="text-[11px]">
                      • {item.name} x{item.quantity} (৳{item.price})
                    </div>
                  ))}
                </td>
                <td className="py-3 px-2 font-bold text-neutral-900">৳{o.grandTotal.toLocaleString("bn-BD")}</td>
                <td className="py-3 px-2 space-y-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold block w-fit ${o.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {o.paymentMethod.toUpperCase()} ({o.paymentStatus || "Unpaid"})
                  </span>
                  {o.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => updateOrderPayment(o.id, "Paid", o.transactionId || "ADMIN_VERIFIED")}
                      className="text-[9px] font-bold text-emerald-700 underline cursor-pointer"
                    >
                      পেইড মার্ক করুন
                    </button>
                  )}
                </td>
                <td className="py-3 px-2 space-y-1">
                  {o.courierPartner ? (
                    <div className="text-[11px]">
                      <span className="font-semibold text-neutral-800">{o.courierPartner}:</span>{" "}
                      <span className="font-mono text-brand-forest">{o.trackingNumber}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      + অ্যাসাইন করুন
                    </button>
                  )}
                </td>
                <td className="py-3 px-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                    className="bg-neutral-100 border border-neutral-200 rounded-xl p-1.5 text-[11px] font-bold text-neutral-800"
                  >
                    <option value="Received">Received (প্রাপ্ত)</option>
                    <option value="Processing">Processing (প্রসেসিং)</option>
                    <option value="Shipped">Shipped (শিপড)</option>
                    <option value="Delivered">Delivered (ডেলিভারড)</option>
                    <option value="Cancelled">Cancelled (বাতিল)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
