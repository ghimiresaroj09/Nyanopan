"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FreeShippingProgress } from "@/components/partials/free-shipping-progress";
import { cart, useCart, useCartSubtotal } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { lines, isOpen } = useCart();
  const subtotal = useCartSubtotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? cart.open() : cart.close())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? "Your cart is empty."
              : `${lines.length} ${lines.length === 1 ? "item" : "items"} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/70 text-muted-foreground">
              <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="font-serif text-lg font-normal text-foreground">Your cart is empty</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Explore our hand-felted Kathmandu collection to find your pair.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2 border-border/80 hover:border-terracotta hover:text-terracotta" onClick={() => cart.close()}>
              <Link href="/collections/all-slippers">Explore collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <FreeShippingProgress subtotal={subtotal} className="rounded-lg border border-border/70 bg-[#faf6ee] p-3.5" />
            <ul className="flex-1 divide-y divide-border/60 overflow-y-auto">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-4">
                  <Link href={line.url} onClick={() => cart.close()} className="shrink-0">
                    <Image
                      src={line.image}
                      alt={line.name}
                      width={76}
                      height={76}
                      className="rounded-md border border-border/70 bg-[#faf7f2] p-1 object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={line.url}
                      onClick={() => cart.close()}
                      className="block truncate text-sm font-medium hover:text-terracotta transition-colors"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {line.colorName} / EU {line.size}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border/80 bg-background shadow-2xs">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-l-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                          onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-medium" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-r-md hover:bg-accent text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                          onClick={() => cart.setQuantity(line.id, line.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sm font-normal text-foreground">
                          {formatPrice(line.unitPrice * line.quantity)}
                        </span>
                        <button
                          type="button"
                          className="text-muted-foreground/70 transition-colors hover:text-destructive"
                          aria-label={`Remove ${line.name} from cart`}
                          onClick={() => cart.remove(line.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3.5 border-t border-border/70 pt-4 bg-background">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-serif text-lg font-normal text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground/80">
                EU tax included. Complimentary delivery calculated against threshold.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <Button asChild variant="outline" className="border-border/80 hover:border-terracotta" onClick={() => cart.close()}>
                  <Link href="/cart">View bag</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" onClick={() => cart.close()}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
