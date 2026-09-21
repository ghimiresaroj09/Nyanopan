"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/lib/api/categories";

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      href: "/collections",
      label: "All Products",
      children: categories.map((category) => ({
        href: `/collections/${category.slug}`,
        label: category.name,
      })),
    },
    { href: "/collections/men", label: "Mens Collections" },
    { href: "/collections/women", label: "Womens Collections" },
    { href: "/collections/unisex", label: "Unisex Collections" },
    { href: "/wishlist", label: "My Wishlist" },
    { href: "/our-story", label: "Our Story" },
    { href: "/contact", label: "Contact Us" },
    { href: "/sustainability", label: "Sustainability" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-accent lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/brand/logo-cloud.png?v=2"
                alt="Nyanopan wool felt cloud emblem"
                width={42}
                height={25}
                className="h-5.5 w-auto object-contain drop-shadow-2xs"
              />
              <span className="font-serif text-xl">Nyanopan</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="px-6 py-4" aria-label="Mobile">
          <Accordion type="multiple" className="w-full">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <AccordionItem key={item.href} value={item.href}>
                    <AccordionTrigger className="text-base">
                      <Link href={item.href} className="hover:underline">
                        {item.label}
                      </Link>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block border-b py-3 text-base ${active ? "font-medium" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </Accordion>
          <Separator className="my-4" />
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/shipping" className="hover:text-foreground">
              Shipping Information
            </Link>
            <Link href="/exchanges-returns" className="hover:text-foreground">
              Exchanges &amp; Returns
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-foreground">
              Terms and Conditions
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
