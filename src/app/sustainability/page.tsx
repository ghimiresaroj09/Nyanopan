import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/shared/page-header";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "How nyanopan keeps production sustainable: natural materials, fair trade labour and zero-waste felting.",
};

export default function SustainabilityPage() {
  return (
    <>
      <PageHeader
        title="Sustainability"
        description="A small collection, natural materials, and a production process that wastes almost nothing."
      />

      <section className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <Image
          src={images.sheepGreenGrass}
          alt="Sheep grazing"
          width={900}
          height={640}
          className="aspect-[4/3] w-full rounded-md object-cover"
        />
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-3xl text-foreground">Natural materials only</h2>
          <p>
            The wool felt is made of 100% pure new wool from free-grazing
            sheep. It is washed and felted without the use of chemicals.
          </p>
          <p>
            The soles are made of undyed, 100% vegetable-tanned leather or of
            recycled rubber. They are attached to the shaft with a natural,
            solvent-free latex glue.
          </p>
          <p>
            Because the slippers are made of only wool, leather and rubber,
            they can be composted or recycled at the end of their life.
          </p>
        </div>
      </section>

      <section className="bg-muted/70">
        <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:order-2">
            <h2 className="font-serif text-3xl text-foreground">Zero-waste felting</h2>
            <p>
              Cutting a slipper out of a felt sheet leaves material behind.
              In most factories that material would be thrown away. In the
              nyanopan workshop it is collected and re-felted into new sheets.
            </p>
            <p>
              Those sheets become the Lungta special editions: marbled
              slippers where every pair carries its own colour pattern. This
              way, no material is wasted.
            </p>
          </div>
          <Image
            src={images.textilesColourful}
            alt="Colourful wool textiles"
            width={900}
            height={640}
            className="aspect-[4/3] w-full rounded-md object-cover lg:order-1"
          />
        </div>
      </section>

      <section className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <Image
          src={images.yarnRedBlue}
          alt="Balls of wool yarn"
          width={900}
          height={640}
          className="aspect-[4/3] w-full rounded-md object-cover"
        />
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-3xl text-foreground">A small, deliberate collection</h2>
          <p>
            nyanopan deliberately keeps the collection small: a few basic models
            for women, men and children, each available in a limited number of
            colours.
          </p>
          <p>
            No seasonal throwaway collections, no overproduction. A model is
            made as long as it works, and improved only when the improvement
            is real.
          </p>
        </div>
      </section>
    </>
  );
}
