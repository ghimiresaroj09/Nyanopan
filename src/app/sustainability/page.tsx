import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/shared/page-header";
import { getSustainability } from "@/lib/api/sustainability";
import { generateContentKeywords } from "@/lib/seo/keywords";

export async function generateMetadata(): Promise<Metadata> {
  const sustainabilityData = await getSustainability();
  if (!sustainabilityData) return {};

  const title = sustainabilityData.title;
  const description = sustainabilityData.description.replace(/<[^>]*>/g, "").substring(0, 160);
  const firstImage = sustainabilityData.sections[0]?.image;

  return {
    title,
    description,
    keywords: generateContentKeywords("sustainability"),
    alternates: { canonical: "/sustainability" },
    openGraph: {
      title,
      description,
      type: "article",
      url: "/sustainability",
      ...(firstImage && {
        images: [{ url: firstImage, width: 1200, height: 630, alt: title }],
      }),
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(firstImage && { images: [firstImage] }),
    },
  };
}

export default async function SustainabilityPage() {
  const sustainabilityData = await getSustainability();
  if (!sustainabilityData) return null;

  return (
    <>
      <PageHeader
        title={sustainabilityData.title}
        description={<div dangerouslySetInnerHTML={{ __html: sustainabilityData.description }} />}
      />

      {sustainabilityData.sections.map((section, index) => {
        const isEven = index % 2 === 0;
        const sectionBg = index % 2 === 1 ? "bg-muted/70" : "";

        return (
          <section key={index} className={sectionBg}>
            <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
              {/* Image - Left on even, Right on odd */}
              <Image
                src={section.image}
                alt={section.title}
                width={900}
                height={640}
                className={`aspect-[4/3] w-full rounded-md object-cover ${
                  isEven ? "" : "lg:order-2"
                }`}
              />
              
              {/* Content - Right on even, Left on odd */}
              <div
                className={`space-y-4 text-base leading-relaxed text-muted-foreground ${
                  isEven ? "" : "lg:order-1"
                }`}
              >
                <h2 className="font-serif text-3xl text-foreground">{section.title}</h2>
                <div
                  className="space-y-4 [&_p]:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: section.description }}
                />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
