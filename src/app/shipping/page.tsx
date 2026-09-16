import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/shared/prose-page";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping rates and delivery times for the nyanopan storefront.",
};

export default function ShippingPage() {
  return (
    <ProsePage
      title="Shipping"
      description="Rates, delivery times and returns for the nyanopan storefront."
      updated="14 September 2026"
    >
      <ProseSection title="Delivery">
        <p>
          Orders are packed in the workshop in Kathmandu and shipped to Europe
          with tracked parcel services. Once your order is handed over, you
          receive a tracking link by email.
        </p>
        <p>
          Delivery takes 2 to 5 business days for the Netherlands and Belgium,
          and 3 to 7 business days for the rest of Europe. Public holidays can
          add a day.
        </p>
      </ProseSection>

      <ProseSection title="Rates">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">Destination</th>
                <th className="px-4 py-2.5 font-medium">Orders under Rs. 150</th>
                <th className="px-4 py-2.5 font-medium">Orders from Rs. 150</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-2.5">Netherlands, Belgium</td>
                <td className="px-4 py-2.5">Rs. 6.95</td>
                <td className="px-4 py-2.5">Free</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Germany</td>
                <td className="px-4 py-2.5">Rs. 7.95</td>
                <td className="px-4 py-2.5">Free</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Rest of the European Union</td>
                <td className="px-4 py-2.5">Rs. 12.95</td>
                <td className="px-4 py-2.5">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Shipping is free on all orders of Rs. 150 or more, regardless of
          destination.
        </p>
      </ProseSection>

      <ProseSection title="Returns">
        <p>
          You can return unworn slippers within 30 days of delivery. Return
          costs depend on the country you ship from; see the{" "}
          <Link href="/exchanges-returns" className="underline underline-offset-2">
            Exchanges &amp; Returns
          </Link>{" "}
          page for the full overview. Returns because of a faulty product or a
          mistake on our side are always free.
        </p>
        <p>
          Refunds are issued to the original payment method within 14 days of
          the return arriving.
        </p>
        <p>
          Because wool felt adapts to the foot, we recommend trying slippers
          on a clean, dry floor indoors until you are sure of the fit.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
