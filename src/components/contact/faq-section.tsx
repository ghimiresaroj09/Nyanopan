import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import type { FAQCategory } from "@/lib/api/faqs";

export function FAQSection({ categories }: { categories: FAQCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="border-t border-[#ece4d5] bg-white py-16 sm:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f2eada] text-[#a4642d]">
            <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a4642d]">A little help</p>
          <h2 id="faq-heading" className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#28221c] sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-[#675c4e]">Find quick answers about our slippers, orders, and delivery.</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => category.faqs.length > 0 ? (
            <div key={category.id}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#a4642d]">{category.name}</h3>
              <div className="divide-y divide-[#ece4d5] rounded-2xl border border-[#ece4d5] bg-[#fbf9f5] px-5 sm:px-7">
                {category.faqs.map((faq, index) => (
                  <details key={faq.id} className="group py-5" open={index === 0 && categories.length === 1}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#28221c] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4642d]">
                      <span>{faq.question}</span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#a4642d] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="max-w-3xl whitespace-pre-line pt-3 pr-8 text-sm leading-7 text-[#675c4e]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null)}
        </div>
      </div>
    </section>
  );
}
