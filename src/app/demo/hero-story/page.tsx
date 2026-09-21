import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Demo page disabled - Static product data has been removed.
 * All products now come from the API.
 */
export default function DemoHeroStoryPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-serif text-4xl mb-4">Demo Page</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        This demo page is temporarily disabled. Static product data has been removed and all products now come from the API.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/collections/all">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
