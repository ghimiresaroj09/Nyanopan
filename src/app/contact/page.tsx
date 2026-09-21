import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteConfiguration, fallbackConfig } from "@/lib/api/config";

export const metadata: Metadata = {
  title: "Contact Us | Nyanopan",
  description: "Get in touch with us. We&apos;re here to help with any questions about our handcrafted wool slippers.",
};

export default async function ContactPage() {
  const config = await getSiteConfiguration() || fallbackConfig;

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Hero Section */}
      <section className="relative border-b border-[#ece4d5] bg-gradient-to-b from-[#f5f1e8] to-[#fbf9f5]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#28221c] tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#675c4e] max-w-2xl mx-auto">
              Have a question about our handcrafted wool slippers? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#28221c] mb-4">
                  Contact Information
                </h2>
                <p className="text-[#675c4e] leading-relaxed">
                  {config.company_intro}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f2eada] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#a4642d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#28221c] mb-1">Email</h3>
                    <a 
                      href={`mailto:${config.email}`}
                      className="text-[#675c4e] hover:text-[#a4642d] transition-colors"
                    >
                      {config.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f2eada] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#a4642d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#28221c] mb-1">Phone</h3>
                    <a 
                      href={`tel:${config.phone}`}
                      className="text-[#675c4e] hover:text-[#a4642d] transition-colors"
                    >
                      {config.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f2eada] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#a4642d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#28221c] mb-1">Address</h3>
                    <p className="text-[#675c4e]">{config.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#28221c] mb-1">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${config.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#675c4e] hover:text-[#25D366] transition-colors"
                    >
                      +{config.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ece4d5]">
                <h3 className="font-medium text-[#28221c] mb-3">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="/shipping"
                    className="block text-[#675c4e] hover:text-[#28221c] transition-colors"
                  >
                    Shipping Information
                  </a>
                  <a
                    href="/exchanges-returns"
                    className="block text-[#675c4e] hover:text-[#28221c] transition-colors"
                  >
                    Returns & Exchanges
                  </a>
                  <a
                    href="/our-story"
                    className="block text-[#675c4e] hover:text-[#28221c] transition-colors"
                  >
                    About Our Makers
                  </a>
                </div>
              </div>

              {/* Google Map */}
              <div className="pt-6">
                <h3 className="font-medium text-[#28221c] mb-3">Find Us</h3>
                <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-[#ece4d5] shadow-sm">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nyanopan Location"
                  />
                </div>
                <a
                  href={config.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-[#a4642d] hover:text-[#28221c] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
