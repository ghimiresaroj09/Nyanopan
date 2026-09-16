import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FairTradeSection } from "@/components/partials/fair-trade-section";
import { ComfortSection } from "@/components/partials/comfort-section";
import { SustainabilitySection } from "@/components/partials/sustainability-section";
import { NewsletterSignup } from "@/components/partials/newsletter-signup";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <FeaturedProducts />
      <FairTradeSection />
      <ComfortSection />
      <SustainabilitySection />
      <NewsletterSignup />
    </>
  );
}
