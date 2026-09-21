"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { HeaderNav } from "@/components/layout/header-nav";
import { cart, useCartCount } from "@/hooks/use-cart";
import { useWishlistCount } from "@/hooks/use-wishlist";
import type { Category } from "@/lib/api/categories";

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 transition-shadow">
      <div className="container-page flex h-18 items-center gap-6">
        {/* Mobile menu trigger */}
        <MobileMenu categories={categories} />

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
        <HeaderNav categories={categories} />

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
            asChild
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative hover:bg-accent/60"
          >
            <Link href="/wishlist">
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold leading-none text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Open cart, ${cartCount} items`}
            className="relative hover:bg-accent/60"
            onClick={() => cart.open()}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold leading-none text-white shadow-xs">
                {cartCount}
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
