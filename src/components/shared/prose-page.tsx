import type { ReactNode } from "react";

import { PageHeader } from "@/components/shared/page-header";

interface ProsePageProps {
  title: string;
  description?: string;
  updated?: string;
  children: ReactNode;
}

export function ProsePage({ title, description, updated, children }: ProsePageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <article className="container-page max-w-3xl py-12 md:py-16">
        {updated && (
          <p className="mb-8 text-sm text-muted-foreground">Last updated: {updated}</p>
        )}
        <div className="space-y-6 text-base leading-relaxed text-foreground/90">{children}</div>
      </article>
    </>
  );
}

export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
