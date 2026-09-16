"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { FreeShippingProgress } from "@/components/partials/free-shipping-progress";
import { cart, useCart, useCartSubtotal } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { lines } = useCart();
  const subtotal = useCartSubtotal();

  if (lines.length === 0) {
    return (
      <div className="container-page py-16 md:py-24">
        <h1 className="font-serif text-3xl">Your cart</h1>
        <div className="mt-8 rounded-md border border-dashed px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6">
            <Link href="/collections/all-slippers">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-4 font-serif text-3xl">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start max-w-6xl">
        <div>
          <div className="hidden grid-cols-[1fr_120px_120px_40px] gap-4 border-b pb-3 text-xs uppercase tracking-wide text-muted-foreground md:grid">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          <ul className="divide-y">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-5 md:grid md:grid-cols-[1fr_120px_120px_40px] md:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <Link href={line.url} className="shrink-0">
                    <Image
                      src={line.image}
                      alt={line.name}
                      width={80}
                      height={80}
                      className="rounded-sm border object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link href={line.url} className="block text-sm font-medium hover:underline">
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {line.colorName} / EU {line.size}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPrice(line.unitPrice)} each
                    </p>
                  </div>
                </div>

                <div className="ml-auto flex items-center rounded-md border md:mx-auto md:ml-0">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-l-md hover:bg-accent"
                    aria-label="Decrease quantity"
                    onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-r-md hover:bg-accent"
                    aria-label="Increase quantity"
                    onClick={() => cart.setQuantity(line.id, line.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 md:justify-end">
                  <span className="text-sm font-medium md:text-right">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </span>
                  <button
                    type="button"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Remove ${line.name} from cart`}
                    onClick={() => cart.remove(line.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-md border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Order summary</h2>
          <FreeShippingProgress subtotal={subtotal} className="mt-4" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="text-base font-medium">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Tax included. Shipping calculated at checkout.
          </p>
          <Separator className="my-4" />
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Check out</Link>
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="/collections/all-slippers">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
