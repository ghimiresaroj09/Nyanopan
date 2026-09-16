import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center md:py-32">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you are looking for does not exist or has moved. The slippers,
        however, are still here.
      </p>
      <Button asChild className="mt-8">
        <Link href="/collections/all-slippers">Browse the collection</Link>
      </Button>
    </div>
  );
}
