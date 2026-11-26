import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { FAQSection } from "@/components/contact/faq-section";
import { getSiteConfiguration, fallbackConfig } from "@/lib/api/config";
import { getFAQCategories } from "@/lib/api/faqs";

export const metadata: Metadata = {
  title: "Contact Us | Nyanopan",
  description: "Get in touch with us. We’re here to help with any questions about our handcrafted wool slippers.",
};

export default async function ContactPage() {
  const [siteConfig, faqCategories] = await Promise.all([
    getSiteConfiguration(),
    getFAQCategories(),
  ]);
  const config = siteConfig || fallbackConfig;

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <section className="relative overflow-hidden border-b border-[#ece4d5] bg-gradient-to-br from-[#f3ecde] via-[#f8f4eb] to-[#fbf9f5]">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-[#e8dcc7] sm:right-8" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#a4642d]">Here when you need us</p>
            <h1 className="font-serif text-4xl font-normal tracking-tight text-[#28221c] sm:text-5xl lg:text-6xl">Let&apos;s talk</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#675c4e] sm:text-lg">
              Questions about your order or finding the right pair? Our team is happy to help.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`mailto:${config.email}`} className="rounded-full bg-white/80 px-5 py-2.5 font-medium text-[#675c4e] ring-1 ring-[#e7ddce] transition hover:text-[#a4642d]">{config.email}</a>
              <a href={`tel:${config.phone}`} className="rounded-full bg-white/80 px-5 py-2.5 font-medium text-[#675c4e] ring-1 ring-[#e7ddce] transition hover:text-[#a4642d]">Call our team</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="space-y-5 lg:sticky lg:top-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4642d]">We&apos;re all ears</p>
                <h2 className="mb-3 mt-2 font-serif text-2xl font-normal text-[#28221c] sm:text-3xl">A real person, ready to help</h2>
                <p className="leading-relaxed text-[#675c4e]">{config.company_intro}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <a href={`mailto:${config.email}`} className="group flex items-center gap-4 rounded-2xl border border-[#ece4d5] bg-white p-4 shadow-sm transition hover:border-[#d8c6a9]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2eada] text-[#a4642d]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <span className="min-w-0"><span className="block text-xs text-[#8a7e6d]">Email us</span><span className="block truncate font-medium text-[#28221c] group-hover:text-[#a4642d]">{config.email}</span></span>
                </a>
                <a href={`tel:${config.phone}`} className="group flex items-center gap-4 rounded-2xl border border-[#ece4d5] bg-white p-4 shadow-sm transition hover:border-[#d8c6a9]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2eada] text-[#a4642d]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <span><span className="block text-xs text-[#8a7e6d]">Call us</span><span className="block font-medium text-[#28221c] group-hover:text-[#a4642d]">{config.phone}</span></span>
                </a>
                <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-[#ece4d5] bg-white p-4 shadow-sm transition hover:border-[#d8c6a9]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  </span>
                  <span><span className="block text-xs text-[#8a7e6d]">WhatsApp</span><span className="block font-medium text-[#28221c] group-hover:text-[#a4642d]">+{config.whatsapp}</span></span>
                </a>
                <div className="flex items-center gap-4 rounded-2xl border border-[#ece4d5] bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2eada] text-[#a4642d]"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                  <span><span className="block text-xs text-[#8a7e6d]">Visit our workshop</span><span className="block font-medium text-[#28221c]">{config.address}</span></span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#ece4d5] bg-white p-5">
                <h3 className="mb-3 font-medium text-[#28221c]">Useful information</h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a href="/shipping" className="text-[#675c4e] underline decoration-[#d8ccb6] underline-offset-4 transition-colors hover:text-[#a4642d]">Shipping Information</a>
                  <a href="/exchanges-returns" className="text-[#675c4e] underline decoration-[#d8ccb6] underline-offset-4 transition-colors hover:text-[#a4642d]">Returns &amp; Exchanges</a>
                  <a href="/our-story" className="text-[#675c4e] underline decoration-[#d8ccb6] underline-offset-4 transition-colors hover:text-[#a4642d]">About Our Makers</a>
                </div>
              </div>

              <details className="group overflow-hidden rounded-2xl border border-[#ece4d5] bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-[#28221c] marker:content-none">Find our Kathmandu workshop<span className="text-sm text-[#a4642d] transition-transform group-open:rotate-180">⌄</span></summary>
                <div className="border-t border-[#ece4d5] p-3">
                  <div className="h-56 overflow-hidden rounded-xl bg-[#f2eada]"><iframe src={`https://www.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Nyanopan Location" /></div>
                  <a href={config.map_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-2 text-sm font-medium text-[#a4642d] transition-colors hover:text-[#28221c]">Open in Google Maps <span aria-hidden="true">↗</span></a>
                </div>
              </details>
            </div>

            <div className="lg:pt-1"><ContactForm /></div>
          </div>
        </div>
      </section>

      <FAQSection categories={faqCategories} />
    </main>
  );
}
