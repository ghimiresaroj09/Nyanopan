import Link from "next/link";
import { HeroImageCarousel } from "@/components/home/hero-image-carousel";

export function EditorialHero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative overflow-hidden bg-[#f4eee3]">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[45%] bg-[#ebe1d2] lg:block" />

      <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:min-h-[680px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="editorial-eyebrow text-sm">Hand-felted in Kathmandu</p>
          <h1
            id="home-hero-title"
            className="mt-6 max-w-[13ch] font-serif text-5xl leading-[0.98] tracking-[-0.045em] text-[#28221c] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            Comfort, crafted <span className="text-[#a95438]">in the Himalayas.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#62594d] sm:text-xl">
            Naturally warm slippers, shaped by skilled hands from mountain wool and made for everyday comfort.
          </p>

          <div className="mt-9 flex flex-nowrap items-center gap-2 sm:gap-4">
            <Link
              href="/collections/all"
              className="inline-flex min-h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#263d30] px-3 text-sm font-semibold text-white hover:bg-[#1d3026] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263d30] sm:flex-none sm:px-8 sm:text-base"
            >
              Browse Crafts
            </Link>
            <Link
              href="/our-story"
              className="inline-flex min-h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-[#c8bba7] px-3 text-sm font-semibold text-[#30291f] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263d30] sm:flex-none sm:px-8 sm:text-base"
            >
              Meet our team
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-[#d9cdbb] pt-5 text-sm leading-snug text-[#62594d] sm:gap-6 sm:text-base">
            <p>Natural mountain wool</p>
            <p>Hand-felted in Nepal</p>
            <p>Made for everyday comfort</p>
          </div>
        </div>

        <HeroImageCarousel />
      </div>
    </section>
  );
}
