"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLastPlacedNumber } from "@/lib/orders";
import { formatOrderNumber, formatPrice } from "@/lib/format";
import type { CheckoutOrder } from "@/types/checkout";

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order");
    const localOrderNumber = Number(params.get("local"));
    try {
      const storedOrder = sessionStorage.getItem("nyanopan-checkout-order");
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder) as CheckoutOrder;
        if (!orderId || parsed.id === orderId) setCheckoutOrder(parsed);
        sessionStorage.removeItem("nyanopan-checkout-order");
      }
    } catch {
      sessionStorage.removeItem("nyanopan-checkout-order");
    }
    setOrderNumber(Number.isFinite(localOrderNumber) && localOrderNumber > 0
      ? localOrderNumber
      : getLastPlacedNumber());
  }, []);

  const displayOrderReference = checkoutOrder?.id ?? (orderNumber !== null ? formatOrderNumber(orderNumber) : null);

  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-border/80 bg-card p-8 md:p-12 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <PackageCheck className="h-8 w-8 stroke-[1.75]" />
        </div>

        <span className="editorial-eyebrow justify-center">Order {checkoutOrder?.status ?? "Confirmed"}</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground font-normal">
          Dhanyabad! Thank you for your order.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {displayOrderReference && (
            <>
              Your order reference is{" "}
              <strong className="font-mono text-base font-semibold text-foreground">
                {displayOrderReference}
              </strong>
              .{" "}
            </>
          )}
          We have received your order details. Our Kathmandu atelier team is preparing your pure wool slippers for delivery.
        </p>

        {checkoutOrder && (
          <div className="mt-8 space-y-5 text-left">
            <section className="rounded-xl border border-border/70 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Order details</h2>
              <div className="mt-4 space-y-3">
                {checkoutOrder.items.map((item, index) => (
                  <div key={`${item.sku}-${index}`} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">{item.variant_name} · Qty {item.quantity}</p>
                    </div>
                    <span className="shrink-0">{formatPrice(Number(item.line_total))}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{formatPrice(Number(checkoutOrder.product_subtotal))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery · {checkoutOrder.delivery_location_name}</span><span>{formatPrice(Number(checkoutOrder.delivery_charge))}</span></div>
                <div className="flex justify-between font-semibold"><span>Total ({checkoutOrder.currency})</span><span>{formatPrice(Number(checkoutOrder.subtotal))}</span></div>
              </div>
            </section>

            <section className="rounded-xl border border-border/70 p-5 text-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Customer and delivery</h2>
              <p className="mt-3 font-medium">{checkoutOrder.customer_name}</p>
              <p className="text-muted-foreground">{checkoutOrder.email} · {checkoutOrder.phone}</p>
              {checkoutOrder.alternate_phone && <p className="text-muted-foreground">Alternate: {checkoutOrder.alternate_phone}</p>}
              <p className="mt-3">{checkoutOrder.address}{checkoutOrder.landmark ? ` · ${checkoutOrder.landmark}` : ""}</p>
              <p className="text-muted-foreground">{checkoutOrder.city_district}</p>
              {checkoutOrder.notes && <p className="mt-3 text-muted-foreground">Note: {checkoutOrder.notes}</p>}
              {checkoutOrder.company_name && <p className="mt-3 text-muted-foreground">{checkoutOrder.company_name}{checkoutOrder.pan_vat_number ? ` · PAN/VAT ${checkoutOrder.pan_vat_number}` : ""}</p>}
            </section>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-border/70 bg-[#faf6ee] p-5 text-left text-xs space-y-2.5">
          <p className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
            What happens next?
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">&bull;</span>
              <span>Our team verifies your order and phone number before dispatch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">&bull;</span>
              <span>Inside Kathmandu Valley: Delivered within 24–48 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">&bull;</span>
              <span>Outside Valley / Regional districts: Dispatched via express courier (2–4 days).</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/collections/all-slippers" className="inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-border/80 hover:border-terracotta hover:text-terracotta">
            <Link href="/our-story">Discover our makers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
