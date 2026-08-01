import test from "node:test";
import assert from "node:assert/strict";

// Business logic calculations
function calculateCartSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function calculateShippingFee(area: "inside" | "outside" | "sub_area", subtotal: number): number {
  const freeThreshold = 3000;
  if (subtotal >= freeThreshold) return 0;
  if (area === "inside") return 60;
  if (area === "outside") return 120;
  return 100;
}

function calculateCouponDiscount(
  subtotal: number,
  coupon: { discountType: "percentage" | "fixed"; discountValue: number; minOrderAmount: number; maxDiscountCap?: number }
): number {
  if (subtotal < coupon.minOrderAmount) return 0;
  if (coupon.discountType === "percentage") {
    const rawDiscount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountCap && rawDiscount > coupon.maxDiscountCap) {
      return coupon.maxDiscountCap;
    }
    return rawDiscount;
  }
  return Math.min(coupon.discountValue, subtotal);
}

test("calculateCartSubtotal calculates accurate total", () => {
  const items = [
    { price: 1200, quantity: 2 },
    { price: 850, quantity: 1 },
  ];
  assert.equal(calculateCartSubtotal(items), 3250);
});

test("calculateShippingFee respects inside/outside Dhaka and free shipping threshold", () => {
  assert.equal(calculateShippingFee("inside", 1000), 60);
  assert.equal(calculateShippingFee("outside", 1500), 120);
  assert.equal(calculateShippingFee("inside", 3500), 0); // Above 3000 threshold
});

test("calculateCouponDiscount calculates percentage cap and fixed discounts", () => {
  const percentCoupon = {
    discountType: "percentage" as const,
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountCap: 200,
  };
  assert.equal(calculateCouponDiscount(1500, percentCoupon), 150);
  assert.equal(calculateCouponDiscount(3000, percentCoupon), 200); // capped at 200

  const fixedCoupon = {
    discountType: "fixed" as const,
    discountValue: 250,
    minOrderAmount: 1000,
  };
  assert.equal(calculateCouponDiscount(1500, fixedCoupon), 250);
  assert.equal(calculateCouponDiscount(500, fixedCoupon), 0); // below min amount
});
