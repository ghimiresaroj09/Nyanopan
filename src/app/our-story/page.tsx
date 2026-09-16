import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { OurMakersSection } from "@/components/partials/our-makers-section";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How nyanopan slippers are made: hand felted from natural wool in a fair trade workshop in Kathmandu, Nepal.",
};

export default function OurStoryPage() {
  return (
    <>
      <PageHeader
        title="Our Story"
        description="The sustainable choice, made by hand in Kathmandu."
      />

      <section className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <Image
          src={images.prayerFlags}
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

      <OurMakersSection />

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
            src={images.hangingSlippers}
            alt="Hand made felt slippers hanging in the workshop"
            width={900}
            height={640}
            className="aspect-[4/3] w-full rounded-md object-cover lg:order-1"
          />
        </div>
      </section>

      <section className="bg-muted/70">
        <div className="container-page py-14 md:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                image: images.sheepHerd,
                title: "Free-grazing sheep",
                text: "Pure new wool from sheep that graze freely, gathered without harm to the animals.",
              },
              {
                image: images.yarnWoodenTable,
                title: "Hand washing and felting",
                text: "The wool is washed by hand and felted with water, pressure and heat. No chemicals.",
              },
              {
                image: images.pileOfSlippers,
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
    </>
  );
}
