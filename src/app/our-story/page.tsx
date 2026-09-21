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
  
  const title = storyData?.title || "Our Story";
  const description = storyData?.description 
    ? storyData.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : "How Nyanopan slippers are made: hand felted from natural wool in a fair trade workshop in Kathmandu, Nepal.";
  
  const firstImage = storyData?.section1?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80&auto=format&fit=crop";
  
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

export default async function OurStoryPage() {
  const makersData = await getOurMakers();
  const storyData = await getOurStory();

  return (
    <>
      <PageHeader
        title={storyData?.title || "Our Story"}
        description={storyData?.description ? (
          <div dangerouslySetInnerHTML={{ __html: storyData.description }} />
        ) : (
          "The sustainable choice, made by hand in Kathmandu."
        )}
      />

      {/* Section 1 - Where nyanopan is made */}
      {storyData?.section1 ? (
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
      ) : (
        <section className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80&auto=format&fit=crop"
            alt="Prayer flags in Nepal"
            width={900}
            height={640}
            className="aspect-[4/3] w-full rounded-md object-cover"
          />
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="font-serif text-3xl text-foreground">Where nyanopan is made</h2>
            <p>
              Every nyanopan is handmade in a small workshop in Kathmandu, Nepal.
              The entire production process is manual work. Only a dryer and a
              stitching machine are used, everything else happens by hand.
            </p>
            <p>
              The wool comes from free-grazing sheep and is washed and felted
              without chemicals. Soles are cut from undyed, vegetable-tanned
              leather or from partly recycled rubber, and glued with a natural
              latex adhesive that contains no solvents.
            </p>
            <p>
              Production follows fair trade principles. Makers earn a fair
              income, childcare is arranged at the workshop, and money is set
              aside in a fund for the education of the makers&apos; children.
            </p>
          </div>
        </section>
      )}

      {/* Our Makers Section */}
      {makersData && (
        <OurMakersSection 
          title={makersData.title}
          description={makersData.description}
          teamMembers={makersData.team_members}
        />
      )}

      {/* Section 2 - Signed by the maker */}
      {storyData?.section2 ? (
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
      ) : (
        <section>
          <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:order-2">
              <h2 className="font-serif text-3xl text-foreground">Signed by the maker</h2>
              <p>
                Each pair of nyanopan slippers carries a stitched signature near
                the entry. It is the maker&apos;s way of saying: I felted these
                slippers, and I stand behind the work.
              </p>
              <p>
                The signature also makes every pair traceable. If you ever want
                to know who made your nyanopan, the answer is in the slipper.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/sustainability">Read about our production</Link>
              </Button>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80&auto=format&fit=crop"
              alt="Hand made felt slippers hanging in the workshop"
              width={900}
              height={640}
              className="aspect-[4/3] w-full rounded-md object-cover lg:order-1"
            />
          </div>
        </section>
      )}

      {/* Section 3 - Our Journey / Subsections */}
      {storyData?.section3 && storyData.section3.subsections.length > 0 ? (
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
      ) : (
        <section className="bg-muted/70">
          <div className="container-page py-14 md:py-20">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600&q=80&auto=format&fit=crop",
                  title: "Free-grazing sheep",
                  text: "Pure new wool from sheep that graze freely, gathered without harm to the animals.",
                },
                {
                  image: "https://images.unsplash.com/photo-1508139430882-c41044324b2c?w=600&q=80&auto=format&fit=crop",
                  title: "Hand washing and felting",
                  text: "The wool is washed by hand and felted with water, pressure and heat. No chemicals.",
                },
                {
                  image: "https://images.unsplash.com/photo-1556656793-b5e29ac3a0bd?w=600&q=80&auto=format&fit=crop",
                  title: "One piece, no waste",
                  text: "Each slipper is felted in a single piece. Leftover felt returns to the workshop as Lungta editions.",
                },
              ].map((item) => (
                <figure key={item.title}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="aspect-[3/2] w-full rounded-md object-cover"
                  />
                  <figcaption className="mt-4">
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
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
