import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved favorite products.",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        title="My Wishlist"
        description="Your favorite products saved for later."
        crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <WishlistContent />
    </>
  );
}
