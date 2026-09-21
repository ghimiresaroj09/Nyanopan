import type { ReactNode } from "react";
import type { Crumb } from "@/components/shared/breadcrumbs";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  crumbs?: Crumb[];
}

export function PageHeader({ title, description, crumbs }: PageHeaderProps) {
  return (
    <div className="border-b border-border/70 bg-[#f7f2e8]/70">
      <div className="container-page py-12 md:py-16">
        {crumbs && (
          <div className="mb-4">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground">{title}</h1>
        {description && (
          <div className="mt-3.5 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground [&_span]:inline">
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        )}
      </div>
    </div>
  );
}
