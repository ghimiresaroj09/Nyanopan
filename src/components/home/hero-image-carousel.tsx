"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/hero/shoes1.jpg",
    alt: "Brown and cream felt slippers with stitched animal details",
    caption: "Hand-felted character slippers",
  },
  {
    src: "/hero/shoes2.jpg",
    alt: "Sheep-shaped wool slippers",
    caption: "Playful sheep slippers",
  },
  {
    src: "/hero/shoes3.jpg",
    alt: "Brown felt animal slippers with tall ears",
    caption: "Made by hand in Nepal",
  },
  {
    src: "/hero/shoes4.jpg",
    alt: "Pink and cream felt slippers with animal faces",
    caption: "Soft wool, joyful details",
  },
  {
    src: "/hero/shoes5.jpg",
    alt: "Pink animal-shaped wool slippers",
    caption: "A little character in every pair",
  },
];

export function HeroImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  return (
    <div
      role="region"
      aria-label="Featured slipper designs"
      aria-roledescription="carousel"
      className="relative mx-auto w-full max-w-[620px] rounded-[2rem] bg-[#e7dccb] p-3 shadow-[0_24px_70px_-38px_rgba(70,48,30,0.5)] sm:p-5"
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${slides.length}: ${activeSlide.alt}`}
        className="relative overflow-hidden rounded-[1.4rem] bg-[#e9c2a0]"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1023px) 90vw, 48vw"
            className="object-cover"
          />
        </div>

        <p className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-[#fbf9f5]/95 px-4 py-2 text-sm font-medium text-[#30291f] shadow-sm sm:bottom-5 sm:left-5">
          {activeSlide.caption}
        </p>

        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous slipper image"
          className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30291f] shadow-md hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263d30] sm:left-4"
        >
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <button
          type="button"
          onClick={showNext}
          aria-label="Next slipper image"
          className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30291f] shadow-md hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263d30] sm:right-4"
        >
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 px-1 sm:px-2">
        <p aria-live="polite" className="shrink-0 font-serif text-lg text-[#30291f]">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-[#a99a85]">/</span>
          <span className="text-[#756a5c]">{String(slides.length).padStart(2, "0")}</span>
        </p>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}: ${slide.alt}`}
              aria-pressed={activeIndex === index}
              className={`relative aspect-square w-10 overflow-hidden rounded-lg border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263d30] sm:w-12 ${
                activeIndex === index
                  ? "border-[#263d30]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
