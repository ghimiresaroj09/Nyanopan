import type { Metadata } from "next";

import { ProsePage } from "@/components/shared/prose-page";
import { getPolicyByType } from "@/lib/api/policies";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyByType("TERMS_CONDITIONS");
  
  const title = policy?.title || "Terms and Conditions";
  const description = policy?.content 
    ? policy.content.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Terms and conditions for the Nyanopan storefront and online purchases.";
  
  return {
    title,
    description,
    keywords: [
      "terms and conditions",
      "terms of service",
      "user agreement",
      "legal terms",
      "purchase terms",
    ],
    alternates: { canonical: "/terms-conditions" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/terms-conditions",
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: false,
    },
  };
}

export default async function TermsConditionsPage() {
  const policy = await getPolicyByType("TERMS_CONDITIONS");

  if (!policy) {
    return (
      <ProsePage
        title="Terms and Conditions"
        description="Terms and conditions information is currently unavailable."
        updated="14 September 2026"
      >
        <p>We're sorry, terms and conditions information is currently unavailable. Please contact us for details.</p>
      </ProsePage>
    );
  }

  return (
    <ProsePage
      title={policy.title}
      description="The terms that apply when you use this storefront."
      updated="14 September 2026"
    >
      <div 
        className="space-y-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-muted-foreground [&_table]:w-full [&_table]:text-sm [&_table]:border [&_table]:rounded-md [&_thead]:bg-muted [&_thead]:text-left [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-medium [&_td]:px-4 [&_td]:py-2.5 [&_tbody]:divide-y [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-foreground hover:[&_a]:text-terracotta [&_strong]:text-foreground [&_strong]:font-medium"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </ProsePage>
  );
}
