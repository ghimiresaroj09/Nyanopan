import type { Metadata } from "next";

import { ProsePage } from "@/components/shared/prose-page";
import { getPolicyByType } from "@/lib/api/policies";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyByType("EXCHANGES_RETURNS");
  
  const title = policy?.title || "Exchanges and Returns";
  const description = policy?.content 
    ? policy.content.replace(/<[^>]*>/g, "").substring(0, 160)
    : "How exchanges and returns work at Nyanopan, including return costs per country.";
  
  return {
    title,
    description,
    keywords: [
      "return policy",
      "exchange policy",
      "refund policy",
      "30 day returns",
      "product returns",
    ],
    alternates: { canonical: "/exchanges-returns" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/exchanges-returns",
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ExchangesReturnsPage() {
  const policy = await getPolicyByType("EXCHANGES_RETURNS");

  if (!policy) {
    return (
      <ProsePage
        title="Exchanges & Returns"
        description="Exchange and return information is currently unavailable."
        updated="14 September 2026"
      >
        <p>We're sorry, exchange and return information is currently unavailable. Please contact us for details.</p>
      </ProsePage>
    );
  }

  return (
    <ProsePage
      title={policy.title}
      description="30 days to decide, straightforward exchanges, and return costs that depend on where you ship from."
      updated="14 September 2026"
    >
      <div 
        className="space-y-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-muted-foreground [&_table]:w-full [&_table]:text-sm [&_table]:border [&_table]:rounded-md [&_thead]:bg-muted [&_thead]:text-left [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-medium [&_td]:px-4 [&_td]:py-2.5 [&_tbody]:divide-y [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-foreground hover:[&_a]:text-terracotta [&_strong]:text-foreground [&_strong]:font-medium"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </ProsePage>
  );
}
