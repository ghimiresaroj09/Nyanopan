"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/api/categories";

interface HeaderNavProps {
  categories: Category[];
}

export function HeaderNav({ categories }: HeaderNavProps) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      href: "/collections/all",
      label: "All Products",
      children: categories.map((category) => ({
        href: `/collections/${category.slug}`,
        label: category.name,
      })),
    },
    { href: "/collections/men", label: "Mens Collections" },
    { href: "/collections/women", label: "Womens Collections" },
    { href: "/collections/unisex", label: "Unisex Collections" },
    { href: "/our-story", label: "Our Story" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        if (item.children && item.children.length > 0) {
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
  );
}
