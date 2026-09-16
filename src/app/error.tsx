"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 text-center md:py-32">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        An unexpected error occurred while loading this page.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
