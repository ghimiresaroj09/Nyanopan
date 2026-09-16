import type { Metadata } from "next";

import { ProsePage, ProseSection } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for the nyanopan storefront.",
};

export default function TermsConditionsPage() {
  return (
    <ProsePage
      title="Terms and Conditions"
      description="The terms that apply when you use this storefront."
      updated="14 September 2026"
    >
      <ProseSection title="1. Nature of this storefront">
        <p>
          This website is a demonstration storefront for {siteConfig.name}. It
          exists to show product pages, a cart and a checkout flow. Nothing on
          this site constitutes a real offer, no orders are accepted, no
          payments are processed and no products are shipped.
        </p>
      </ProseSection>

      <ProseSection title="2. Product information">
        <p>
          Product descriptions, prices, sizes and availability shown here are
          illustrative. Prices are displayed in euros and include VAT. They do
          not bind anyone to anything.
        </p>
      </ProseSection>

      <ProseSection title="3. Use of the site">
        <p>
          You may browse the site freely. You may not attempt to disrupt its
          operation, scrape it at scale, or misrepresent yourself as its
          operator.
        </p>
      </ProseSection>

      <ProseSection title="4. Intellectual property">
        <p>
          The layout and text of this storefront are the property of its
          operator. Photographs are sourced from Unsplash and used under the
          Unsplash License. Trademarks and product names shown belong to their
          respective owners.
        </p>
      </ProseSection>

      <ProseSection title="5. Liability">
        <p>
          The site is provided as is. The operator is not liable for damage
          resulting from the use of the site or from its unavailability.
        </p>
      </ProseSection>

      <ProseSection title="6. Governing law">
        <p>
          These terms are governed by Dutch law. Disputes fall under the
          jurisdiction of the courts of the Netherlands.
        </p>
      </ProseSection>

      <ProseSection title="7. Changes">
        <p>
          These terms may change when the storefront changes. The date at the
          top of this page shows when they were last revised.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
