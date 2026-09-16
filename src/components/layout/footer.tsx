import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Collections",
    links: [
      { href: "/collections/all-slippers", label: "All Slippers" },
      { href: "/collections/high-cut-slippers", label: "High-Cut Slippers" },
      { href: "/collections/slip-on-slippers", label: "Slip-On Slippers" },
      { href: "/collections/slippers-women", label: "Women's Slippers" },
      { href: "/collections/slippers-men", label: "Men's Slippers" },
      { href: "/collections/slippers-kids", label: "Kids Slippers" },
      { href: "/collections/baby-booties", label: "Baby Booties" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/our-story", label: "Our Story" },
      { href: "/sustainability", label: "Sustainability" },
      { href: "/shipping", label: "Shipping" },
      { href: "/exchanges-returns", label: "Exchanges & Returns" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-conditions", label: "Terms and Conditions" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    label: "TikTok",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    label: "Pinterest",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[#f6efe2]">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Image
              src="/brand/logo-cloud.png?v=2"
              alt="Nyanopan wool felt cloud emblem"
              width={48}
              height={29}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-2xs"
            />
            <div>
              <span className="font-serif text-3xl font-normal tracking-tight text-foreground group-hover:text-terracotta transition-colors">
                Nyanopan
              </span>
              <span className="block text-[10px] uppercase tracking-[0.26em] text-terracotta font-medium -mt-1">
                Kathmandu &middot; Nepal
              </span>
            </div>
          </Link>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Hand-felted slippers shaped from 100% natural mountain wool.
            Created by fair trade artisans in our Kathmandu workshop, finished with natural calfskin or recycled crepe soles.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{column.title}</h3>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-terracotta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contacts & Socials Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contacts</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-terracotta shrink-0" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-foreground hover:text-terracotta hover:underline transition-colors"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-terracotta shrink-0" />
                <a
                  href="tel:+9779841234567"
                  className="text-foreground hover:text-terracotta hover:underline transition-colors"
                >
                  +977 9841234567
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                <span>Boudha, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Socials</h3>
            <div className="mt-3 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground/80 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-white shadow-2xs"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80 bg-[#efe6d5]/60">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Handcrafted with reverence for Himalayan wool.
          </p>
          <p className="text-[11px]">Fair trade certified cooperative atelier &middot; Kathmandu</p>
        </div>
      </div>
    </footer>
  );
}
