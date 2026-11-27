import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { OurMakersSection } from "@/components/partials/our-makers-section";
import { getOurMakers } from "@/lib/api/our-makers";
import { getOurStory } from "@/lib/api/our-story";
import { generateContentKeywords } from "@/lib/seo/keywords";

export async function generateMetadata(): Promise<Metadata> {
  const storyData = await getOurStory();
  if (!storyData) return {};

  const title = storyData.title;
  const description = storyData.description.replace(/<[^>]*>/g, "").substring(0, 160);
  const firstImage = storyData.section1?.image;

  return {
    title,
    description,
    keywords: generateContentKeywords("story"),
    alternates: { canonical: "/our-story" },
    openGraph: {
      title,
      description,
      type: "article",
      url: "/our-story",
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

export default async function OurStoryPage() {
  const makersData = await getOurMakers();
  const storyData = await getOurStory();

  return (
    <>
      {storyData && <PageHeader
        title={storyData.title}
        description={
          <div dangerouslySetInnerHTML={{ __html: storyData.description }} />
        }
      />}

      {/* Section 1 - Where nyanopan is made */}
      {storyData?.section1 && (
        <section className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <Image
            src={storyData.section1.image}
            alt={storyData.section1.title}
            width={900}
            height={640}
            className="aspect-[4/3] w-full rounded-md object-cover"
          />
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="font-serif text-3xl text-foreground">{storyData.section1.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: storyData.section1.description }} />
          </div>
        </section>
      )}

      {/* Our Makers Section */}
      {makersData?.team_members.length ? (
        <OurMakersSection 
          title={makersData.title}
          description={makersData.description}
          teamMembers={makersData.team_members}
        />
      ) : null}

      {/* Section 2 - Signed by the maker */}
      {storyData?.section2 && (
        <section>
          <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:order-2">
              <h2 className="font-serif text-3xl text-foreground">{storyData.section2.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: storyData.section2.description }} />
              <Button asChild variant="outline" className="mt-4">
                <Link href="/sustainability">Read about our production</Link>
              </Button>
            </div>
            <Image
              src={storyData.section2.image}
              alt={storyData.section2.title}
              width={900}
              height={640}
              className="aspect-[4/3] w-full rounded-md object-cover lg:order-1"
            />
          </div>
        </section>
      )}

      {/* Section 3 - Our Journey / Subsections */}
      {storyData?.section3 && storyData.section3.subsections.length > 0 && (
        <section className="bg-muted/70">
          <div className="container-page py-14 md:py-20">
            <h2 className="font-serif text-3xl text-foreground text-center mb-8">
              {storyData.section3.title}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {storyData.section3.subsections.map((item, index) => (
                <figure key={index}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="aspect-[3/2] w-full rounded-md object-cover"
                  />
                  <figcaption className="mt-4">
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <div 
                      className="mt-2 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
