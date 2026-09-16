"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { CollectionFacets } from "@/types/collection";
import type { ProductFilters } from "@/types/product";

interface FilterSidebarProps {
  facets: CollectionFacets;
  filters: ProductFilters;
  onToggle: (group: keyof ProductFilters, value: string) => void;
  onClear: () => void;
  className?: string;
  defaultOpen?: boolean;
}

const CAPITALIZED = {
  leather: "Leather",
  rubber: "Rubber",
  women: "Women",
  men: "Men",
  unisex: "Unisex",
  girls: "Girls",
  boys: "Boys",
} as const;

function labelFor(value: string): string {
  if (value in CAPITALIZED) {
    return CAPITALIZED[value as keyof typeof CAPITALIZED];
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function FilterSidebar({
  facets,
  filters,
  onToggle,
  onClear,
  className,
  defaultOpen = true,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.colors.length > 0 ||
    filters.soles.length > 0 ||
    filters.models.length > 0 ||
    filters.genders.length > 0 ||
    filters.sizes.length > 0;

  const groups: Array<{
    id: keyof ProductFilters;
    title: string;
    values: string[];
  }> = [
    { id: "colors", title: "Colour", values: facets.colors },
    { id: "soles", title: "Sole", values: facets.soles },
    { id: "models", title: "Model", values: facets.models },
    { id: "genders", title: "Gender", values: facets.genders },
    { id: "sizes", title: "Size", values: facets.sizes.map(String) },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filter</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={defaultOpen ? groups.map((g) => g.id) : []}>
        {groups.map((group) => (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger>{group.title}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2.5">
                {group.values.map((value) => {
                  const selected = (filters[group.id] as (string | number)[]).some(
                    (v) => String(v) === value
                  );
                  return (
                    <div key={value} className="flex items-center gap-2.5">
                      <Checkbox
                        id={`filter-${group.id}-${value}`}
                        checked={selected}
                        onCheckedChange={() => onToggle(group.id, value)}
                      />
                      <Label
                        htmlFor={`filter-${group.id}-${value}`}
                        className="text-sm font-normal leading-none"
                      >
                        {labelFor(value)}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
