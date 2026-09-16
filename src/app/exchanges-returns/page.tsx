import type { Metadata } from "next";

import { ProsePage, ProseSection } from "@/components/shared/prose-page";

export const metadata: Metadata = {
  title: "Exchanges and Returns",
  description:
    "How exchanges and returns work at nyanopan, including return costs per country.",
};

const RETURN_COSTS = [
  { country: "Nepal", cost: "Rs. 150" },
  { country: "India", cost: "Rs. 450" },
  { country: "Netherlands", cost: "Rs. 695" },
  { country: "Belgium", cost: "Rs. 795" },
  { country: "Germany", cost: "Rs. 895" },
  { country: "Luxembourg", cost: "Rs. 895" },
  { country: "France", cost: "Rs. 995" },
  { country: "Austria", cost: "Rs. 995" },
  { country: "Other countries", cost: "Rs. 1,495" },
];

export default function ExchangesReturnsPage() {
  return (
    <ProsePage
      title="Exchanges & Returns"
      description="30 days to decide, straightforward exchanges, and return costs that depend on where you ship from."
      updated="14 September 2026"
    >
      <ProseSection title="The return window">
        <p>
          You can return or exchange unworn slippers within 30 days of
          delivery. Slippers that have only been tried on indoors count as
          unworn. Try them on a clean, dry floor and keep the packaging until
          you are sure about the size.
        </p>
        <p>
          Wool felt adapts to the shape of the foot, so the first few minutes
          indoors are enough to judge the fit.
        </p>
      </ProseSection>

      <ProseSection title="Exchanges">
        <p>
          An exchange is the fastest way to a better size. If you exchange for
          a different size or colour, we pay the shipping of the replacement
          pair. One free exchange per order.
        </p>
        <p>How it works:</p>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Email our support team with your order number and the size you need.</li>
          <li>We reserve the replacement and send you a return label for your country.</li>
          <li>Drop the parcel off and keep the receipt.</li>
          <li>The replacement ships as soon as the carrier scans your return.</li>
        </ol>
        <p>
          If the size you need is out of stock, you can wait for it, choose
          another colour, or receive a full refund.
        </p>
      </ProseSection>

      <ProseSection title="Return costs per country">
        <p>
          When you return a pair without exchanging it, the return cost for
          your country is deducted from the refund. The cost depends on the
          country you ship from.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">Country</th>
                <th className="px-4 py-2.5 font-medium">Return cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {RETURN_COSTS.map((row) => (
                <tr key={row.country}>
                  <td className="px-4 py-2.5">{row.country}</td>
                  <td className="px-4 py-2.5">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Returns because of a faulty product or a mistake on our side are
          always free. In that case the full order value, including shipping,
          is refunded.
        </p>
      </ProseSection>

      <ProseSection title="Refunds">
        <p>
          Refunds are issued to the original payment method within 14 days of
          the return arriving at our warehouse. You receive a confirmation
          email when the refund is processed. Depending on your bank, the
          amount can take a few extra days to appear.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
