"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getProductModels, type ProductModel } from "@/lib/api/product-models";
import { getAttributes, type Attribute } from "@/lib/api/attributes";

interface ApiFilterSidebarProps {
  className?: string;
  defaultOpen?: boolean;
}

const GENDER_OPTIONS = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
  { value: "KIDS", label: "Kids" },
  { value: "BABY", label: "Baby" },
];

const SOLE_TYPE_OPTIONS = [
  { value: "LEATHER", label: "Leather" },
  { value: "RUBBER", label: "Rubber" },
];

const USAGE_LOCATION_OPTIONS = [
  { value: "INSIDE", label: "Inside" },
  { value: "OUTSIDE", label: "Outside" },
  { value: "BOTH", label: "Both" },
];

export function ApiFilterSidebar({
  className,
  defaultOpen = true,
}: ApiFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [productModels, setProductModels] = useState<ProductModel[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(true);

  const selectedGender = searchParams.get("gender") || "";
  const selectedSoleType = searchParams.get("sole_type") || "";
  const selectedUsageLocation = searchParams.get("usage_location") || "";
  const selectedModel = searchParams.get("model") || "";

  // Get selected attributes (dynamic)
  const selectedAttributes = attributes.reduce((acc, attr) => {
    const paramKey = `attribute_${attr.id}`;
    const value = searchParams.get(paramKey);
    if (value) {
      acc[paramKey] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const hasActiveFilters = 
    selectedGender || 
    selectedSoleType || 
    selectedUsageLocation || 
    selectedModel ||
    Object.keys(selectedAttributes).length > 0;

  // Fetch product models on mount
  useEffect(() => {
    async function fetchModels() {
      setIsLoadingModels(true);
      const models = await getProductModels();
      setProductModels(models);
      setIsLoadingModels(false);
    }
    fetchModels();
  }, []);

  // Fetch attributes on mount
  useEffect(() => {
    async function fetchAttributes() {
      setIsLoadingAttributes(true);
      const attrs = await getAttributes();
      setAttributes(attrs);
      setIsLoadingAttributes(false);
    }
    fetchAttributes();
  }, []);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle filter: if already selected, remove it; otherwise set it
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAllFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("gender");
    params.delete("sole_type");
    params.delete("usage_location");
    params.delete("model");
    
    // Clear all attribute filters
    attributes.forEach(attr => {
      params.delete(`attribute_${attr.id}`);
    });
    
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  // Static groups
  const staticGroups = [
    {
      id: "gender",
      title: "Gender",
      options: GENDER_OPTIONS,
      selected: selectedGender,
      loading: false,
    },
    {
      id: "sole_type",
      title: "Sole Type",
      options: SOLE_TYPE_OPTIONS,
      selected: selectedSoleType,
      loading: false,
    },
    {
      id: "usage_location",
      title: "Usage Location",
      options: USAGE_LOCATION_OPTIONS,
      selected: selectedUsageLocation,
      loading: false,
    },
    {
      id: "model",
      title: "Model",
      options: productModels.map(m => ({ value: m.slug, label: m.name })),
      selected: selectedModel,
      loading: isLoadingModels,
    },
  ];

  // Dynamic attribute groups
  const attributeGroups = attributes.map(attr => ({
    id: `attribute_${attr.id}`,
    title: attr.name,
    options: attr.values.map(v => ({ value: v.id, label: v.name })),
    selected: selectedAttributes[`attribute_${attr.id}`] || "",
    loading: false,
  }));

  const allGroups = [...staticGroups, ...attributeGroups];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filter</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {isLoadingAttributes && staticGroups.every(g => !g.loading) && (
        <div className="text-xs text-muted-foreground">Loading filters...</div>
      )}

      <Accordion type="multiple" defaultValue={defaultOpen ? allGroups.map((g) => g.id) : []}>
        {allGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger>{group.title}</AccordionTrigger>
            <AccordionContent>
              {group.loading ? (
                <div className="flex flex-col gap-2.5">
                  <div className="h-4 w-full animate-pulse bg-muted rounded" />
                  <div className="h-4 w-full animate-pulse bg-muted rounded" />
                  <div className="h-4 w-full animate-pulse bg-muted rounded" />
                </div>
              ) : group.options.length === 0 ? (
                <p className="text-xs text-muted-foreground">No options available</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {group.options.map((option) => {
                    const selected = group.selected === option.value;
                    return (
                      <div key={option.value} className="flex items-center gap-2.5">
                        <Checkbox
                          id={`filter-${group.id}-${option.value}`}
                          checked={selected}
                          onCheckedChange={() => updateFilter(group.id, option.value)}
                        />
                        <Label
                          htmlFor={`filter-${group.id}-${option.value}`}
                          className="text-sm font-normal leading-none cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
