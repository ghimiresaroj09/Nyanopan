import type { Metadata } from "next";

import { ProsePage } from "@/components/shared/prose-page";
import { getPolicyByType } from "@/lib/api/policies";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyByType("SHIPPING");
  
  const title = policy?.title || "Shipping";
  const description = policy?.content 
    ? policy.content.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Shipping rates and delivery times for Nyanopan slippers worldwide.";
  
  return {
    title,
    description,
    keywords: [
      "shipping policy",
      "delivery times",
      "international shipping",
      "Nepal delivery",
      "shipping rates",
    ],
    alternates: { canonical: "/shipping" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/shipping",
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ShippingPage() {
  const policy = await getPolicyByType("SHIPPING");

  if (!policy) {
    return (
      <ProsePage
        title="Shipping"
        description="Shipping information is currently unavailable."
        updated="14 September 2026"
      >
        <p>We're sorry, shipping information is currently unavailable. Please contact us for details.</p>
      </ProsePage>
    );
  }

  return (
    <ProsePage
      title={policy.title}
      description="Rates, delivery times and returns for the nyanopan storefront."
      updated="14 September 2026"
    >
      <div 
        className="space-y-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-muted-foreground [&_table]:w-full [&_table]:text-sm [&_table]:border [&_table]:rounded-md [&_thead]:bg-muted [&_thead]:text-left [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-medium [&_td]:px-4 [&_td]:py-2.5 [&_tbody]:divide-y [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-foreground hover:[&_a]:text-terracotta [&_strong]:text-foreground [&_strong]:font-medium"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </ProsePage>
  );
}
