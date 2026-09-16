"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { cart, useCartCount } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/collections/all-slippers",
    label: "All Slippers",
    children: [
      { href: "/collections/high-cut-slippers", label: "High-Cut Slippers" },
      { href: "/collections/slip-on-slippers", label: "Slip-On Slippers" },
      { href: "/collections/all-slippers", label: "View all slippers" },
    ],
  },
  { href: "/collections/slippers-women", label: "Women's Slippers" },
  { href: "/collections/slippers-men", label: "Men's Slippers" },
  { href: "/collections/slippers-kids", label: "Kids Slippers" },
  { href: "/our-story", label: "Our Story" },
];

export function Header() {
  const pathname = usePathname();
  const count = useCartCount();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 transition-shadow">
      <div className="container-page flex h-18 items-center gap-6">
        {/* Mobile menu trigger */}
        <MobileMenu />

        {/* Wordmark with stitched cloud insignia */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Nyanopan home"
        >
          <Image
            src="/brand/logo-cloud.png?v=2"
            alt="Nyanopan wool felt cloud emblem"
            width={46}
            height={28}
            className="h-6.5 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-2xs"
            priority
          />
          <span className="font-serif text-2xl font-normal tracking-tight text-foreground transition-colors group-hover:text-primary">
            Nyanopan
          </span>
        </Link>

        {/* Primary navigation */}
        <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (item.children) {
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-sm px-3.5 py-2 text-[13.5px] transition-colors",
                      active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 min-w-56 rounded-sm border border-border bg-popover/98 p-1.5 opacity-0 shadow-lg backdrop-blur-sm motion-safe:transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3.5 py-2 text-xs font-medium text-popover-foreground hover:bg-accent/70 hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm px-3.5 py-2 text-[13.5px] transition-colors",
                  active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hover:bg-accent/60"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Open cart, ${count} items`}
            className="relative hover:bg-accent/60"
            onClick={() => cart.open()}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold leading-none text-white shadow-xs">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDrawer />
    </header>
  );
}
