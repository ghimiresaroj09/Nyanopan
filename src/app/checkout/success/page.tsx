"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLastPlacedNumber } from "@/lib/orders";
import { formatOrderNumber } from "@/lib/format";

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = Number(params.get("order"));
    setOrderNumber(
      Number.isFinite(fromParam) && fromParam > 0 ? fromParam : getLastPlacedNumber()
    );
  }, []);

  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-border/80 bg-card p-8 md:p-12 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <PackageCheck className="h-8 w-8 stroke-[1.75]" />
        </div>

        <span className="editorial-eyebrow justify-center">Order Confirmed</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground font-normal">
          Dhanyabad! Thank you for your order.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {orderNumber !== null && (
            <>
              Your order reference is{" "}
              <strong className="font-mono text-base font-semibold text-foreground">
                {formatOrderNumber(orderNumber)}
              </strong>
              .{" "}
            </>
          )}
          We have received your order details. Our Kathmandu atelier team is preparing your pure wool slippers for delivery.
        </p>

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
