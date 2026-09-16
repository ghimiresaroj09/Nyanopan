import type { Metadata } from "next";

import { ProsePage, ProseSection } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the nyanopan storefront handles personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      description="What this storefront does and does not do with your data."
      updated="14 September 2026"
    >
      <ProseSection title="1. Who we are">
        <p>
          This storefront is operated under the name {siteConfig.name}.
          For questions about this policy you can reach us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="underline underline-offset-2">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </ProseSection>

      <ProseSection title="2. Data this site processes">
        <p>We process the following customer data:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-foreground">Cart contents.</strong> When
            you add a product to the cart, your selections and quantities are preserved
            for a seamless shopping session.
          </li>
          <li>
            <strong className="text-foreground">Checkout form data.</strong>{" "}
            The checkout form safely validates your address details to calculate shipping
            and arrange courier delivery.
          </li>
          <li>
            <strong className="text-foreground">Newsletter email address.</strong>{" "}
            Subscribers receive seasonal dispatches from the Kathmandu atelier and product care guides.
          </li>
        </ul>
      </ProseSection>

      <ProseSection title="3. Privacy and Data Security">
        <p>
          We do not sell personal data, set intrusive tracking or advertising cookies,
          or run third-party surveillance scripts. Your session is protected and encrypted.
        </p>
      </ProseSection>

      <ProseSection title="4. Third-party requests">
        <p>
          Product photography is loaded from the Unsplash image CDN
          (images.unsplash.com). Loading these images means your browser makes
          requests to that service. Unsplash&apos;s privacy policy applies to
          those requests and can be found on their website.
        </p>
      </ProseSection>

      <ProseSection title="5. Your rights">
        <p>
          Under the GDPR you have the right to access, correct and delete
          personal data, and the right to object to processing. Because this
          demo stores no personal data on any server, these rights can be
          exercised by clearing your browser data. If you have questions,
          contact us at the address above.
        </p>
      </ProseSection>

      <ProseSection title="6. Changes to this policy">
        <p>
          This policy may be updated when the storefront changes. The date at
          the top of this page shows when it was last revised.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
