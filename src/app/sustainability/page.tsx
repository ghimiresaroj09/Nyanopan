import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/shared/page-header";
import { getSustainability } from "@/lib/api/sustainability";
import { generateContentKeywords } from "@/lib/seo/keywords";

export async function generateMetadata(): Promise<Metadata> {
  const sustainabilityData = await getSustainability();
  
  const title = sustainabilityData?.title || "Sustainability";
  const description = sustainabilityData?.description 
    ? sustainabilityData.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : "How Nyanopan keeps production sustainable: natural materials, fair trade labour and zero-waste felting.";
  
  const firstImage = sustainabilityData?.sections?.[0]?.image || "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80&auto=format&fit=crop";
  
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
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImage],
    },
  };
}

export default async function SustainabilityPage() {
  const sustainabilityData = await getSustainability();

  // Fallback sections if API data is not available
  const defaultSections = [
    {
      title: "Natural materials only",
      description: `<p>The wool felt is made of 100% pure new wool from free-grazing sheep. It is washed and felted without the use of chemicals.</p>
      <p>The soles are made of undyed, 100% vegetable-tanned leather or of recycled rubber. They are attached to the shaft with a natural, solvent-free latex glue.</p>
      <p>Because the slippers are made of only wool, leather and rubber, they can be composted or recycled at the end of their life.</p>`,
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: "Zero-waste felting",
      description: `<p>Cutting a slipper out of a felt sheet leaves material behind. In most factories that material would be thrown away. In the nyanopan workshop it is collected and re-felted into new sheets.</p>
      <p>Those sheets become the Lungta special editions: marbled slippers where every pair carries its own colour pattern. This way, no material is wasted.</p>`,
      image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: "A small, deliberate collection",
      description: `<p>nyanopan deliberately keeps the collection small: a few basic models for women, men and children, each available in a limited number of colours.</p>
      <p>No seasonal throwaway collections, no overproduction. A model is made as long as it works, and improved only when the improvement is real.</p>`,
      image: "https://images.unsplash.com/photo-1508139430882-c41044324b2c?w=900&q=80&auto=format&fit=crop",
    },
  ];

  const sections = sustainabilityData?.sections || defaultSections;

  return (
    <>
      <PageHeader
        title={sustainabilityData?.title || "Sustainability"}
        description={
          sustainabilityData?.description ? (
            <div dangerouslySetInnerHTML={{ __html: sustainabilityData.description }} />
          ) : (
            "A small collection, natural materials, and a production process that wastes almost nothing."
          )
        }
      />

      {sections.map((section, index) => {
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
